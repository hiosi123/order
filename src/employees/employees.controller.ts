import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';

@Controller('employees')
export class EmployeesController {
    constructor(
        private EmployeesService: EmployeesService
    ){}

    @ApiOperation({ summary: '직원 ID로 조회' })
    @ApiParam({ name: 'employeeId', description: '직원 ID (UUID)' })
    @ApiResponse({ status: 200, description: '조회 성공', type: Employee })
    @ApiResponse({ status: 404, description: '직원을 찾을 수 없음' })
    @Get('/:employeeId')
    async findEmployee(
        @Param('employeeId') employeeId: string,
    ) {
        return this.EmployeesService.findOne(employeeId)
    }

    @ApiOperation({ summary: '직원 목록 조회' })
    @ApiQuery({ name: 'email', description: '검색할 이메일', required: false })
    @ApiResponse({ status: 200, description: '조회 성공', type: [Employee] })
    @Get()
    async findAllEmployees(
        @Query('email') email: string,
    ) {
        return this.EmployeesService.find(email)
    }

    @ApiOperation({ summary: '직원 생성' })
    @ApiResponse({ status: 201, description: '생성 성공', type: Employee })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    @Post()
    create(
        @Body() createEmployeeDto: CreateEmployeeDto
    ) {
        return this.EmployeesService.create(createEmployeeDto);
    }

    @ApiOperation({ summary: '직원 정보 수정' })
    @ApiParam({ name: 'employeeId', description: '직원 ID (UUID)' })
    @ApiResponse({ status: 200, description: '수정 성공', type: Employee })
    @ApiResponse({ status: 404, description: '직원을 찾을 수 없음' })
    @Patch('/:employeeId')
    async updateEmployee(
        @Param('employeeId') employeeId: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.EmployeesService.update(employeeId, updateEmployeeDto)
    }

    @ApiOperation({ summary: '직원 삭제' })
    @ApiParam({ name: 'employeeId', description: '직원 ID (UUID)' })
    @ApiResponse({ status: 200, description: '삭제 성공' })
    @ApiResponse({ status: 404, description: '직원을 찾을 수 없음' })
    @Delete('/:employeeId')
    async deleteEmployee(
        @Param('employeeId') employeeId: string,
    ) {
        return this.EmployeesService.remove(employeeId)
    }
}
