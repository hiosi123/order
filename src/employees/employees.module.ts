import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department])],
  controllers: [EmployeesController, DepartmentsController],
  providers: [EmployeesService, DepartmentsService],
  exports: [EmployeesService]
})
export class EmployeesModule {}
