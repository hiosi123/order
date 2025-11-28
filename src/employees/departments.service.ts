import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dtos/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private repo: Repository<Department>,
  ) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.repo.create(createDepartmentDto);
    return this.repo.save(department);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(departmentId: number) {
    if (!departmentId) {
      return null;
    }
    return this.repo.findOneBy({ departmentId });
  }

  async update(departmentId: number, attrs: Partial<Department>) {
    const department = await this.findOne(departmentId);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    Object.assign(department, attrs);
    return this.repo.save(department);
  }

  async remove(departmentId: number) {
    const department = await this.findOne(departmentId);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return this.repo.remove(department);
  }
}
