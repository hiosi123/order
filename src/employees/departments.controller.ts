import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get('/:departmentId')
  findOne(@Param('departmentId') departmentId: string) {
    return this.departmentsService.findOne(parseInt(departmentId));
  }

  @Patch('/:departmentId')
  update(
    @Param('departmentId') departmentId: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(parseInt(departmentId), updateDepartmentDto);
  }

  @Delete('/:departmentId')
  remove(@Param('departmentId') departmentId: string) {
    return this.departmentsService.remove(parseInt(departmentId));
  }
}
