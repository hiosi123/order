// auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BuyersService } from '../buyers/buyers.service';
import { EmployeesService } from '../employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// bcrypt 모킹
jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let buyersService: BuyersService;
    let employeesService: EmployeesService;
    let jwtService: JwtService;
    let configService: ConfigService;

    const mockBuyersService = {
        find: jest.fn(),
        create: jest.fn(),
        findByEmailWithPassword: jest.fn(),
    };

    const mockEmployeesService = {
        find: jest.fn(),
        create: jest.fn(),
        findByEmailWithPassword: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: BuyersService,
                    useValue: mockBuyersService,
                },
                {
                    provide: EmployeesService,
                    useValue: mockEmployeesService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        buyersService = module.get<BuyersService>(BuyersService);
        employeesService = module.get<EmployeesService>(EmployeesService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);

        // ConfigService 기본 설정
        mockConfigService.get.mockImplementation((key: string) => {
            if (key === 'JWT_SECRET') return 'test-secret';
            if (key === 'JWT_EXPIRATION') return 86400;
            return null;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signupBuyer', () => {
        const signupDto = {
            buyerName: '디자이너',
            email: 'design@gmail.com',
            password: 'password123',
            dateOfBirth: '19951108',
            phone: '01020311883',
        };

        const createdBuyer = {
            buyerId: 'buyer-uuid',
            buyerName: '디자이너',
            email: 'design@gmail.com',
            dateOfBirth: '19951108',
            phone: '01020311883',
        };

        it('should successfully signup a buyer', async () => {
            // Mock implementations
            mockBuyersService.find.mockResolvedValue([]); // 이메일 중복 없음
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockBuyersService.create.mockResolvedValue(createdBuyer);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.signupBuyer(signupDto);

            // Assertions
            expect(buyersService.find).toHaveBeenCalledWith(signupDto.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
            expect(buyersService.create).toHaveBeenCalledWith({
                ...signupDto,
                password: 'hashed-password',
            });
            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    sub: createdBuyer.buyerId,
                    userType: 'buyer',
                    email: createdBuyer.email,
                },
                {
                    secret: 'test-secret',
                    expiresIn: 86400,
                }
            );
            expect(result).toEqual({
                access_token: 'mock-jwt-token',
                user: {
                    id: createdBuyer.buyerId,
                    name: createdBuyer.buyerName,
                    email: createdBuyer.email,
                    type: 'buyer',
                },
            });
        });

        it('should throw ConflictException if email already exists', async () => {
            mockBuyersService.find.mockResolvedValue([{ email: signupDto.email }]);

            await expect(service.signupBuyer(signupDto)).rejects.toThrow(
                ConflictException
            );
            await expect(service.signupBuyer(signupDto)).rejects.toThrow(
                'Email already exists'
            );
            expect(buyersService.find).toHaveBeenCalledWith(signupDto.email);
            expect(buyersService.create).not.toHaveBeenCalled();
        });

        it('should hash password before saving', async () => {
            mockBuyersService.find.mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockBuyersService.create.mockResolvedValue(createdBuyer);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            await service.signupBuyer(signupDto);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(buyersService.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: 'hashed-password',
                })
            );
        });
    });

    describe('signupEmployee', () => {
        const signupDto = {
            employeeName: '김소싱',
            email: 'sourcing@company.com',
            password: 'password123',
            dateOfBirth: '19900315',
            departmentId: 1,
        };

        const createdEmployee = {
            employeeId: 'employee-uuid',
            employeeName: '김소싱',
            email: 'sourcing@company.com',
            department: {
                departmentId: 1,
                departmentName: '소싱팀',
                departmentCode: 'S1',
            },
        };

        it('should successfully signup an employee', async () => {
            mockEmployeesService.find.mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockEmployeesService.create.mockResolvedValue(createdEmployee);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.signupEmployee(signupDto);

            expect(employeesService.find).toHaveBeenCalledWith(signupDto.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
            expect(employeesService.create).toHaveBeenCalledWith({
                ...signupDto,
                password: 'hashed-password',
            });
            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    sub: createdEmployee.employeeId,
                    userType: 'employee',
                    email: createdEmployee.email,
                    departmentCode: 'S1',
                    role: ['sourcing', 'approve_order', 'reject_order'],
                },
                {
                    secret: 'test-secret',
                    expiresIn: 86400,
                }
            );
            expect(result).toEqual({
                access_token: 'mock-jwt-token',
                user: {
                    id: createdEmployee.employeeId,
                    name: createdEmployee.employeeName,
                    email: createdEmployee.email,
                    type: 'employee',
                    department: '소싱팀',
                },
            });
        });

        it('should throw ConflictException if email already exists', async () => {
            mockEmployeesService.find.mockResolvedValue([{ email: signupDto.email }]);

            await expect(service.signupEmployee(signupDto)).rejects.toThrow(
                ConflictException
            );
            expect(employeesService.find).toHaveBeenCalledWith(signupDto.email);
            expect(employeesService.create).not.toHaveBeenCalled();
        });

        it('should assign correct roles based on department code', async () => {
            mockEmployeesService.find.mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockEmployeesService.create.mockResolvedValue(createdEmployee);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            await service.signupEmployee(signupDto);

            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: ['sourcing', 'approve_order', 'reject_order'],
                }),
                expect.any(Object)
            );
        });
    });

    describe('loginBuyer', () => {
        const email = 'design@gmail.com';
        const password = 'password123';
        const hashedPassword = 'hashed-password';

        const buyer = {
            buyerId: 'buyer-uuid',
            buyerName: '디자이너',
            email: 'design@gmail.com',
            password: hashedPassword,
        };

        it('should successfully login a buyer', async () => {
            mockBuyersService.findByEmailWithPassword.mockResolvedValue(buyer);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.loginBuyer(email, password);

            expect(buyersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    sub: buyer.buyerId,
                    userType: 'buyer',
                    email: buyer.email,
                },
                {
                    secret: 'test-secret',
                    expiresIn: 86400,
                }
            );
            expect(result).toEqual({
                access_token: 'mock-jwt-token',
                user: {
                    id: buyer.buyerId,
                    name: buyer.buyerName,
                    email: buyer.email,
                    type: 'buyer',
                },
            });
        });

        it('should throw UnauthorizedException if buyer not found', async () => {
            mockBuyersService.findByEmailWithPassword.mockResolvedValue(null);

            await expect(service.loginBuyer(email, password)).rejects.toThrow(
                UnauthorizedException
            );
            await expect(service.loginBuyer(email, password)).rejects.toThrow(
                'Invalid credentials'
            );
            expect(buyersService.findByEmailWithPassword).toHaveBeenCalledWith(email);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            mockBuyersService.findByEmailWithPassword.mockResolvedValue(buyer);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.loginBuyer(email, password)).rejects.toThrow(
                UnauthorizedException
            );
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
        });
    });

    describe('loginEmployee', () => {
        const email = 'sourcing@company.com';
        const password = 'password123';
        const hashedPassword = 'hashed-password';

        const employee = {
            employeeId: 'employee-uuid',
            employeeName: '김소싱',
            email: 'sourcing@company.com',
            password: hashedPassword,
            department: {
                departmentId: 1,
                departmentName: '소싱팀',
                departmentCode: 'S1',
            },
        };

        it('should successfully login an employee', async () => {
            mockEmployeesService.findByEmailWithPassword.mockResolvedValue(employee);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            const result = await service.loginEmployee(email, password);

            expect(employeesService.findByEmailWithPassword).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    sub: employee.employeeId,
                    userType: 'employee',
                    email: employee.email,
                    departmentCode: 'S1',
                    role: ['sourcing', 'approve_order', 'reject_order'],
                },
                {
                    secret: 'test-secret',
                    expiresIn: 86400,
                }
            );
            expect(result).toEqual({
                access_token: 'mock-jwt-token',
                user: {
                    id: employee.employeeId,
                    name: employee.employeeName,
                    email: employee.email,
                    type: 'employee',
                    department: '소싱팀',
                },
            });
        });

        it('should throw UnauthorizedException if employee not found', async () => {
            mockEmployeesService.findByEmailWithPassword.mockResolvedValue(null);

            await expect(service.loginEmployee(email, password)).rejects.toThrow(
                UnauthorizedException
            );
            expect(employeesService.findByEmailWithPassword).toHaveBeenCalledWith(email);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            mockEmployeesService.findByEmailWithPassword.mockResolvedValue(employee);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.loginEmployee(email, password)).rejects.toThrow(
                UnauthorizedException
            );
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
        });
    });

    describe('getEmployeeRoles', () => {
        it('should return correct roles for S1 (sourcing)', async () => {
            // private 메서드이므로 간접 테스트
            const employee = {
                employeeId: 'employee-uuid',
                employeeName: '김소싱',
                email: 'sourcing@company.com',
                department: {
                    departmentCode: 'S1',
                    departmentName: '소싱팀',
                },
            };

            mockEmployeesService.find.mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockEmployeesService.create.mockResolvedValue(employee);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            await service.signupEmployee({
                employeeName: '김소싱',
                email: 'sourcing@company.com',
                password: 'password123',
                dateOfBirth: '19900315',
                departmentId: 1,
            });

            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: ['sourcing', 'approve_order', 'reject_order'],
                }),
                expect.any(Object)
            );
        });

        it('should return correct roles for P1 (production)', async () => {
            const employee = {
                employeeId: 'employee-uuid',
                employeeName: '김생산',
                email: 'production@company.com',
                department: {
                    departmentCode: 'P1',
                    departmentName: '생산팀',
                },
            };

            mockEmployeesService.find.mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockEmployeesService.create.mockResolvedValue(employee);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            await service.signupEmployee({
                employeeName: '김생산',
                email: 'production@company.com',
                password: 'password123',
                dateOfBirth: '19900315',
                departmentId: 2,
            });

            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: ['production', 'manufacture_order'],
                }),
                expect.any(Object)
            );
        });

        it('should return admin role for AD department', async () => {
            const employee = {
                employeeId: 'employee-uuid',
                employeeName: '김관리',
                email: 'admin@company.com',
                department: {
                    departmentCode: 'AD',
                    departmentName: '관리팀',
                },
            };

            mockEmployeesService.find.mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockEmployeesService.create.mockResolvedValue(employee);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            await service.signupEmployee({
                employeeName: '김관리',
                email: 'admin@company.com',
                password: 'password123',
                dateOfBirth: '19900315',
                departmentId: 3,
            });

            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: ['admin'],
                }),
                expect.any(Object)
            );
        });

        it('should return empty array for unknown department code', async () => {
            const employee = {
                employeeId: 'employee-uuid',
                employeeName: '김기타',
                email: 'other@company.com',
                department: {
                    departmentCode: 'XX',
                    departmentName: '기타',
                },
            };

            mockEmployeesService.find.mockResolvedValue([]);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            mockEmployeesService.create.mockResolvedValue(employee);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');

            await service.signupEmployee({
                employeeName: '김기타',
                email: 'other@company.com',
                password: 'password123',
                dateOfBirth: '19900315',
                departmentId: 99,
            });

            expect(jwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: [],
                }),
                expect.any(Object)
            );
        });
    });
});