import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { Employee } from './entities/employee.entity';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

  const mockEmployeesService = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findEmployee', () => {
    it('should return an employee', async () => {
      const employeeId = 'emp-uuid';
      const expectedResult = { employeeId, employeeName: 'John Doe' } as unknown as Employee;
      mockEmployeesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findEmployee(employeeId);

      expect(service.findOne).toHaveBeenCalledWith(employeeId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllEmployees', () => {
    it('should return an array of employees', async () => {
      const email = 'test@example.com';
      const expectedResult = [{ employeeId: 'emp-uuid', email }] as unknown as Employee[];
      mockEmployeesService.find.mockResolvedValue(expectedResult);

      const result = await controller.findAllEmployees(email);

      expect(service.find).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create an employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        email: 'test@example.com',
        employeeName: 'John Doe',
        password: 'password',
        dateOfBirth: '19900101',
        departmentId: 1,
      };
      const expectedResult = { employeeId: 'emp-uuid', ...createEmployeeDto } as unknown as Employee;
      mockEmployeesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createEmployeeDto);

      expect(service.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee', async () => {
      const employeeId = 'emp-uuid';
      const updateEmployeeDto: UpdateEmployeeDto = { employeeName: 'Jane Doe' };
      const expectedResult = { employeeId, ...updateEmployeeDto } as unknown as Employee;
      mockEmployeesService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateEmployee(employeeId, updateEmployeeDto);

      expect(service.update).toHaveBeenCalledWith(employeeId, updateEmployeeDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee', async () => {
      const employeeId = 'emp-uuid';
      const expectedResult = { deleted: true };
      mockEmployeesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.deleteEmployee(employeeId);

      expect(service.remove).toHaveBeenCalledWith(employeeId);
      expect(result).toEqual(expectedResult);
    });
  });
});
