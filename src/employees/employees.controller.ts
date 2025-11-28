import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

@Controller('employees')
export class EmployeesController {
    constructor(
        private EmployeesService: EmployeesService
    ){}

    @Get('/:employeeId')
    async findEmployee(
        @Param('employeeId') employeeId: string,
    ) {
        return this.EmployeesService.findOne(employeeId)
    }

    @Get()
    async findAllEmployees(
        @Query('email') email: string,
    ) {
        return this.EmployeesService.find(email)
    }

    @Post()
    create(
        @Body() createEmployeeDto: CreateEmployeeDto
    ) {
        return this.EmployeesService.create(createEmployeeDto);
    }

    @Patch('/:employeeId')
    async updateEmployee(
        @Param('employeeId') employeeId: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.EmployeesService.update(employeeId, updateEmployeeDto)
    }

    @Delete('/:employeeId')
    async deleteEmployee(
        @Param('employeeId') employeeId: string,
    ) {
        return this.EmployeesService.remove(employeeId)
    }
}
