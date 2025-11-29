// auth/auth.controller.ts
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignupBuyerDto } from "./dtos/signup-buyer.dto";
import { AuthService } from "./auth.service";
import { SignupEmployeeDto } from "./dtos/signup-employee.dto";
import { SigninDto } from "./dtos/singin.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @ApiOperation({ 
        summary: 'Buyer 회원가입',
        description: '구매자 계정을 생성하고 JWT 토큰을 반환합니다.'
    })
    @ApiResponse({ 
        status: 201, 
        description: '회원가입 성공',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'd694e14f-385b-47ec-b66c-62c9b3aca02f',
                    name: '디자이너',
                    email: 'design@gmail.com',
                    type: 'buyer'
                }
            }
        }
    })
    @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
    @Post('/signup/buyer')
    async signupBuyer(
        @Body() signupDto: SignupBuyerDto
    ) {
       return this.authService.signupBuyer(signupDto);
    }

    @ApiOperation({ 
        summary: 'Employee 회원가입',
        description: '직원 계정을 생성하고 JWT 토큰을 반환합니다.'
    })
    @ApiResponse({ 
        status: 201, 
        description: '회원가입 성공',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    name: '김소싱',
                    email: 'sourcing@company.com',
                    type: 'employee',
                    department: '소싱팀'
                }
            }
        }
    })
    @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
    @Post('/signup/employee')
    async signupEmployee(
        @Body() signupDto: SignupEmployeeDto
    ) {
        return this.authService.signupEmployee(signupDto)
    }

    @ApiOperation({ 
        summary: 'Buyer 로그인',
        description: '구매자 계정으로 로그인하여 JWT 토큰을 받습니다.'
    })
    @ApiResponse({ 
        status: 200, 
        description: '로그인 성공',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'd694e14f-385b-47ec-b66c-62c9b3aca02f',
                    name: '디자이너',
                    email: 'design@gmail.com',
                    type: 'buyer'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: '잘못된 인증 정보' })
    @Post('/signin/buyer')
    async signinBuyer(
        @Body() signinDto: SigninDto
    ) {
        return this.authService.loginBuyer(signinDto.email, signinDto.password)
    }

    @ApiOperation({ 
        summary: 'Employee 로그인',
        description: '직원 계정으로 로그인하여 JWT 토큰을 받습니다.'
    })
    @ApiResponse({ 
        status: 200, 
        description: '로그인 성공',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: {
                    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    name: '김소싱',
                    email: 'sourcing@company.com',
                    type: 'employee',
                    department: '소싱팀'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: '잘못된 인증 정보' })
    @Post('/signin/employee')
    async signinEmploye(
        @Body() signinDto: SigninDto
    ) {
        return this.authService.loginEmployee(signinDto.email, signinDto.password)
    }
}