import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { DepartmentsService } from './departments.service';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee) private repo: Repository<Employee>,
        private departmentsService: DepartmentsService,
    ){}

    async create(createEmployeeDto: CreateEmployeeDto) {
        const department = await this.departmentsService.findOne(createEmployeeDto.departmentId)
        if (!department) {
            throw new NotFoundException("Department not found")
        }

        const employee = this.repo.create(createEmployeeDto)
        employee.department = department

        return this.repo.save(employee)
    }

    find(email: string) {
        return this.repo.find({
            where: {email},
            relations: ['department']
        })
    }

    findOne(employeeId: string) {
        if (!employeeId) {
            throw new NotFoundException('Employee ID is required')
        }

        return this.repo.findOne({
            where: { employeeId },
            relations: ['department']
        })
    }

    async update(employeeId: string, attrs: Partial<Employee>) {
        const employee = await this.repo.findOneBy({employeeId})
        if (!employee) {
            throw new NotFoundException('Employee not found')
        }

        Object.assign(employee, attrs)
        return this.repo.save(employee)
    }

    async remove(employeeId: string) {
        const employee = await this.repo.findOneBy({employeeId})
        if (!employee) {
            throw new NotFoundException('Employee not found')
        }

        return this.repo.remove(employee)
    }

    async findByEmailWithPassword(email: string) {
        return this.repo.findOne({
            where: { email },
            relations: ['department'],
            select: ['employeeId', 'employeeName', 'email', 'password'],
        });
    }
}
