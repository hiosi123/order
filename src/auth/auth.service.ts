import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BuyersService } from "../buyers/buyers.service";
import { EmployeesService } from "../employees/employees.service";
import { SignupBuyerDto } from "./dtos/signup-buyer.dto";
import * as bcrypt from 'bcrypt';
import { SignupEmployeeDto } from "./dtos/signup-employee.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private buyersService: BuyersService,
        private employeesService: EmployeesService,
        private configService: ConfigService,
    ){}

    async signupBuyer(signupDto: SignupBuyerDto) {
        console.log(signupDto)
        // 이메일 중복 체크
        const existingBuyer = await this.buyersService.find(signupDto.email)
        if (existingBuyer.length) {
            throw new ConflictException('Email already exists')
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);

        // buyer 생성
        const buyer = await this.buyersService.create({
            ...signupDto,
            password: hashedPassword
        })

        // jwt 토큰 생성
        const payload: JwtPayload = {
            sub: buyer.buyerId, 
            userType: 'buyer',
            email: buyer.email,
        }

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<number>('JWT_EXPIRATION') || 60*60*24
        })

        return {
            access_token: token,
            user: {
                id: buyer.buyerId,
                name: buyer.buyerName,
                email: buyer.email,
                type: 'buyer',
            }
        }
    }

    async signupEmployee(signupDto: SignupEmployeeDto) {
        const existingEmployee = await this.employeesService.find(signupDto.email)
        if (existingEmployee.length) {
            throw new ConflictException('Email already exists');
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);

        // Employee 생성
        const employee = await this.employeesService.create({
            ...signupDto,
            password: hashedPassword
        })

        // JWT 토큰 생성
        const payload: JwtPayload = {
            sub: employee.employeeId,
            userType: 'employee',
            email: employee.email,
            departmentCode: employee.department?.departmentCode,
            role: this.getEmployeeRoles(employee.department?.departmentCode)
        }

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<number>('JWT_EXPIRATION') || 60*60*24
        })

        return {
            access_token: token,
            user: {
                id: employee.employeeId,
                name: employee.employeeName,
                email: employee.email,
                type: 'employee',
                department: employee.department?.departmentName
            }
        }
        
    }

    // Buyer 로그인
    async loginBuyer(email: string, password: string) {
        const buyer = await this.buyersService.findByEmailWithPassword(email);
        if (!buyer || !(await bcrypt.compare(password, buyer.password))) {
            throw new UnauthorizedException("Invalid credentials")
        }
        const payload: JwtPayload = {
            sub: buyer.buyerId,
            userType: 'buyer',
            email: buyer.email,
        }

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<number>('JWT_EXPIRATION') || 60*60*24
        })

        return {
            access_token: token,
            user: {
                id: buyer.buyerId,
                name: buyer.buyerName,
                email: buyer.email,
                type: 'buyer',
            }
        }
    }

    // Employee login
    async loginEmployee(email: string, password: string) {
        const employee = await this.employeesService.findByEmailWithPassword(email)
        if (!employee || !(await bcrypt.compare(password, employee.password))) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload: JwtPayload = {
            sub: employee.employeeId,
            userType: 'employee',
            email: employee.email,
            departmentCode: employee.department?.departmentCode,
            role: this.getEmployeeRoles(employee.department?.departmentCode),
        }
    
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<number>('JWT_EXPIRATION') || 60*60*24
        })


        return {
            access_token: token,
            user: {
                id: employee.employeeId,
                name: employee.employeeName,
                email: employee.email, 
                type: 'employee',
                department: employee.department?.departmentName
            }
        }
    }

    private getEmployeeRoles(departmentCode: string): string[] {
        const roleMap = {
            'S1': ['sourcing', 'approve_order', 'reject_order'],
            'P1': ['production', 'manufacture_order'],
            'AD': ['admin']
        }

        return roleMap[departmentCode] || []
    }
}