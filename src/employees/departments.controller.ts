import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @ApiOperation({ summary: '부서 생성', description: '새로운 부서를 생성합니다.' })
  @ApiResponse({ status: 201, description: '생성 성공', type: Department })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @ApiOperation({ summary: '부서 목록 조회', description: '모든 부서 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '조회 성공', type: [Department] })
  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @ApiOperation({ summary: '부서 ID로 조회', description: '특정 부서의 정보를 조회합니다.' })
  @ApiParam({ name: 'departmentId', description: '부서 ID', example: '1' })
  @ApiResponse({ status: 200, description: '조회 성공', type: Department })
  @ApiResponse({ status: 404, description: '부서를 찾을 수 없음' })
  @Get('/:departmentId')
  findOne(@Param('departmentId') departmentId: string) {
    return this.departmentsService.findOne(parseInt(departmentId));
  }

  @ApiOperation({ summary: '부서 정보 수정', description: '부서 정보를 수정합니다.' })
  @ApiParam({ name: 'departmentId', description: '부서 ID', example: '1' })
  @ApiResponse({ status: 200, description: '수정 성공', type: Department })
  @ApiResponse({ status: 404, description: '부서를 찾을 수 없음' })
  @Patch('/:departmentId')
  update(
    @Param('departmentId') departmentId: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(parseInt(departmentId), updateDepartmentDto);
  }

  @ApiOperation({ summary: '부서 삭제', description: '부서를 삭제합니다.' })
  @ApiParam({ name: 'departmentId', description: '부서 ID', example: '1' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '부서를 찾을 수 없음' })
  @Delete('/:departmentId')
  remove(@Param('departmentId') departmentId: string) {
    return this.departmentsService.remove(parseInt(departmentId));
  }
}
