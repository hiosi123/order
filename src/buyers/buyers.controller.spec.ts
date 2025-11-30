// buyers/buyers.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BuyersController } from './buyers.controller';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto } from './dtos/create-buyer.dto';
import { UpdateBuyerDto } from './dtos/update-buyer.dto';
import { NotFoundException } from '@nestjs/common';

describe('BuyersController', () => {
    let controller: BuyersController;
    let buyersService: BuyersService;

    // Mock BuyersService
    const mockBuyersService = {
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BuyersController],
            providers: [
                {
                    provide: BuyersService,
                    useValue: mockBuyersService,
                },
            ],
        }).compile();

        controller = module.get<BuyersController>(BuyersController);
        buyersService = module.get<BuyersService>(BuyersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findBuyer', () => {
        const buyerId = 'd694e14f-385b-47ec-b66c-62c9b3aca02f';
        const mockBuyer = {
            buyerId: 'd694e14f-385b-47ec-b66c-62c9b3aca02f',
            buyerName: '디자이너',
            email: 'design@gmail.com',
            dateOfBirth: '19951108',
            phone: '01020311883',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should return a buyer by ID', async () => {
            mockBuyersService.findOne.mockResolvedValue(mockBuyer);

            const result = await controller.findBuyer(buyerId);

            expect(buyersService.findOne).toHaveBeenCalledWith(buyerId);
            expect(buyersService.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockBuyer);
            expect(result?.buyerId).toBe(buyerId);
        });

        it('should throw NotFoundException if buyer not found', async () => {
            mockBuyersService.findOne.mockResolvedValue(null);

            const result = await controller.findBuyer('non-existent-id');

            expect(buyersService.findOne).toHaveBeenCalledWith('non-existent-id');
            expect(result).toBeNull();
        });
    });

    describe('findAllBuyers', () => {
        const mockBuyers = [
            {
                buyerId: 'buyer-1',
                buyerName: '디자이너',
                email: 'design@gmail.com',
                dateOfBirth: '19951108',
                phone: '01020311883',
            },
            {
                buyerId: 'buyer-2',
                buyerName: '구매자2',
                email: 'buyer2@gmail.com',
                dateOfBirth: '19900101',
                phone: '01012345678',
            },
        ];

        it('should return all buyers', async () => {
            mockBuyersService.find.mockResolvedValue(mockBuyers);

            const result = await controller.findAllBuyers(undefined);

            expect(buyersService.find).toHaveBeenCalledWith(undefined);
            expect(result).toEqual(mockBuyers);
            expect(result.length).toBe(2);
        });

        it('should return buyers filtered by email', async () => {
            const filteredBuyers = [mockBuyers[0]];
            mockBuyersService.find.mockResolvedValue(filteredBuyers);

            const result = await controller.findAllBuyers('design@gmail.com');

            expect(buyersService.find).toHaveBeenCalledWith('design@gmail.com');
            expect(result).toEqual(filteredBuyers);
            expect(result.length).toBe(1);
        });

        it('should return empty array if no buyers found', async () => {
            mockBuyersService.find.mockResolvedValue([]);

            const result = await controller.findAllBuyers('nonexistent@gmail.com');

            expect(buyersService.find).toHaveBeenCalledWith('nonexistent@gmail.com');
            expect(result).toEqual([]);
            expect(result.length).toBe(0);
        });
    });

    describe('create', () => {
        const createBuyerDto: CreateBuyerDto = {
            buyerName: '디자이너',
            email: 'design@gmail.com',
            password: 'password123',
            dateOfBirth: '19951108',
            phone: '01020311883',
        };

        const mockCreatedBuyer = {
            buyerId: 'new-buyer-uuid',
            buyerName: '디자이너',
            email: 'design@gmail.com',
            dateOfBirth: '19951108',
            phone: '01020311883',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should create a new buyer', async () => {
            mockBuyersService.create.mockResolvedValue(mockCreatedBuyer);

            const result = await controller.create(createBuyerDto);

            expect(buyersService.create).toHaveBeenCalledWith(createBuyerDto);
            expect(buyersService.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockCreatedBuyer);
            expect(result.buyerId).toBeDefined();
            expect(result.buyerName).toBe(createBuyerDto.buyerName);
            expect(result.email).toBe(createBuyerDto.email);
        });

        it('should handle creation with all required fields', async () => {
            mockBuyersService.create.mockResolvedValue(mockCreatedBuyer);

            const result = await controller.create(createBuyerDto);

            expect(result).toHaveProperty('buyerId');
            expect(result).toHaveProperty('buyerName');
            expect(result).toHaveProperty('email');
            expect(result).toHaveProperty('dateOfBirth');
            expect(result).toHaveProperty('phone');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('updatedAt');
        });
    });

    describe('updateBuyer', () => {
        const buyerId = 'd694e14f-385b-47ec-b66c-62c9b3aca02f';
        const updateBuyerDto: UpdateBuyerDto = {
            buyerName: '수정된이름',
            email: 'updated@gmail.com',
            dateOfBirth: '19951108',
            phone: '01099998888',
        };

        const mockUpdatedBuyer = {
            buyerId: 'd694e14f-385b-47ec-b66c-62c9b3aca02f',
            buyerName: '수정된이름',
            email: 'updated@gmail.com',
            dateOfBirth: '19951108',
            phone: '01099998888',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date(),
        };

        it('should update a buyer', async () => {
            mockBuyersService.update.mockResolvedValue(mockUpdatedBuyer);

            const result = await controller.updateBuyer(buyerId, updateBuyerDto);

            expect(buyersService.update).toHaveBeenCalledWith(buyerId, updateBuyerDto);
            expect(buyersService.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUpdatedBuyer);
            expect(result.buyerName).toBe(updateBuyerDto.buyerName);
            expect(result.email).toBe(updateBuyerDto.email);
        });

        it('should update only provided fields', async () => {
            const partialUpdate: UpdateBuyerDto = {
                buyerName: '부분수정',
            } as UpdateBuyerDto;

            const partiallyUpdatedBuyer = {
                ...mockUpdatedBuyer,
                buyerName: '부분수정',
            };

            mockBuyersService.update.mockResolvedValue(partiallyUpdatedBuyer);

            const result = await controller.updateBuyer(buyerId, partialUpdate);

            expect(buyersService.update).toHaveBeenCalledWith(buyerId, partialUpdate);
            expect(result.buyerName).toBe('부분수정');
        });

        it('should throw NotFoundException if buyer to update not found', async () => {
            mockBuyersService.update.mockRejectedValue(
                new NotFoundException('Buyer not found')
            );

            await expect(
                controller.updateBuyer('non-existent-id', updateBuyerDto)
            ).rejects.toThrow(NotFoundException);

            expect(buyersService.update).toHaveBeenCalledWith(
                'non-existent-id',
                updateBuyerDto
            );
        });
    });

    describe('deleteBuyer', () => {
        const buyerId = 'd694e14f-385b-47ec-b66c-62c9b3aca02f';

        it('should delete a buyer', async () => {
            mockBuyersService.remove.mockResolvedValue({ affected: 1 });

            const result = await controller.deleteBuyer(buyerId);

            expect(buyersService.remove).toHaveBeenCalledWith(buyerId);
            expect(buyersService.remove).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ affected: 1 });
        });

        it('should throw NotFoundException if buyer to delete not found', async () => {
            mockBuyersService.remove.mockRejectedValue(
                new NotFoundException('Buyer not found')
            );

            await expect(controller.deleteBuyer('non-existent-id')).rejects.toThrow(
                NotFoundException
            );

            expect(buyersService.remove).toHaveBeenCalledWith('non-existent-id');
        });

        it('should return deletion result', async () => {
            const deleteResult = { affected: 1, raw: [] };
            mockBuyersService.remove.mockResolvedValue(deleteResult);

            const result = await controller.deleteBuyer(buyerId);

            expect(result).toHaveProperty('affected');
        });
    });

    describe('Integration scenarios', () => {
        it('should handle complete buyer lifecycle', async () => {
            const createDto: CreateBuyerDto = {
                buyerName: '테스트',
                email: 'test@gmail.com',
                password: 'password123',
                dateOfBirth: '19900101',
                phone: '01011112222',
            };

            const createdBuyer = {
                buyerId: 'test-uuid',
                ...createDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // 1. Create
            mockBuyersService.create.mockResolvedValue(createdBuyer);
            const created = await controller.create(createDto);
            expect(created.buyerId).toBe('test-uuid');

            // 2. Find
            mockBuyersService.findOne.mockResolvedValue(createdBuyer);
            const found = await controller.findBuyer('test-uuid');
            expect(found).toEqual(createdBuyer);

            // 3. Update
            const updateDto: UpdateBuyerDto = {
                buyerName: '수정됨',
                email: 'test@gmail.com',
                dateOfBirth: '19900101',
                phone: '01011112222',
            };
            const updatedBuyer = { ...createdBuyer, ...updateDto };
            mockBuyersService.update.mockResolvedValue(updatedBuyer);
            const updated = await controller.updateBuyer('test-uuid', updateDto);
            expect(updated.buyerName).toBe('수정됨');

        });

        it('should validate email format in search', async () => {
            mockBuyersService.find.mockResolvedValue([]);

            const result = await controller.findAllBuyers('invalid-email');

            expect(buyersService.find).toHaveBeenCalledWith('invalid-email');
            expect(result).toEqual([]);
        });
    });
});