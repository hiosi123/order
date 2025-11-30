import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { ConfirmOrderDto } from './dtos/confirm-order.dto';
import { ForbiddenException } from '@nestjs/common';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    updateByBuyer: jest.fn(),
    conifrmByEmployee: jest.fn(),
    rejectByEmployee: jest.fn(),
    getOrderHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    const createOrderDto: CreateOrderDto = {
      buyerId: 'buyer-uuid',
      orderDetail: {
        productName: 'Socks',
        quantity: 100,
        unitPrice: 500,
        color: 'Red',
        size: 'L',
        dueDate: '20251130',
      },
    } as CreateOrderDto;

    it('should create an order if user is buyer', async () => {
      const user = { userId: 'buyer-uuid', userType: 'buyer' };
      const expectedResult = { orderId: 'order-uuid', ...createOrderDto };

      mockOrdersService.create.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(createOrderDto, user);

      expect(ordersService.create).toHaveBeenCalledWith({
        ...createOrderDto,
        buyerId: user.userId,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw ForbiddenException if user is not buyer', async () => {
      const user = { userId: 'emp-uuid', userType: 'employee' };

      await expect(controller.createOrder(createOrderDto, user)).rejects.toThrow(
        ForbiddenException,
      );
      expect(ordersService.create).not.toHaveBeenCalled();
    });
  });

  describe('updateOrder', () => {
    const orderId = 'order-uuid';
    const updateOrderDto: UpdateOrderDto = {
      orderDetail: {
        quantity: 200,
      },
      buyerId: 'buyer-uuid',
    } as UpdateOrderDto;

    it('should update an order if user is buyer', async () => {
      const user = { userId: 'buyer-uuid', userType: 'buyer' };
      const expectedResult = { orderId, ...updateOrderDto };

      mockOrdersService.updateByBuyer.mockResolvedValue(expectedResult);

      const result = await controller.updateOrder(orderId, updateOrderDto, user);

      expect(ordersService.updateByBuyer).toHaveBeenCalledWith(orderId, {
        ...updateOrderDto,
        buyerId: user.userId,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw ForbiddenException if user is not buyer', async () => {
      const user = { userId: 'emp-uuid', userType: 'employee' };

      await expect(
        controller.updateOrder(orderId, updateOrderDto, user),
      ).rejects.toThrow(ForbiddenException);
      expect(ordersService.updateByBuyer).not.toHaveBeenCalled();
    });
  });

  describe('confirmOrder', () => {
    const orderId = 'order-uuid';
    const confirmOrderDto: ConfirmOrderDto = {
      employeeId: 'emp-uuid',
    };

    it('should confirm an order', async () => {
      const user = { userId: 'emp-uuid' };
      const expectedResult = { orderId, status: 3 };

      mockOrdersService.conifrmByEmployee.mockResolvedValue(expectedResult);

      const result = await controller.confirmOrder(orderId, confirmOrderDto, user);

      expect(ordersService.conifrmByEmployee).toHaveBeenCalledWith(orderId, {
        ...confirmOrderDto,
        employeeId: user.userId,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('rejectOrder', () => {
    const orderId = 'order-uuid';
    const confirmOrderDto: ConfirmOrderDto = {
      employeeId: 'emp-uuid',
    };

    it('should reject an order', async () => {
      const user = { userId: 'emp-uuid' };
      const expectedResult = { orderId, status: 9 };

      mockOrdersService.rejectByEmployee.mockResolvedValue(expectedResult);

      const result = await controller.rejectOrder(orderId, confirmOrderDto, user);

      expect(ordersService.rejectByEmployee).toHaveBeenCalledWith(orderId, {
        ...confirmOrderDto,
        employeeId: user.userId,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getOrder', () => {
    const orderId = 'order-uuid';

    it('should return order history', async () => {
      const query = { version: 1 };
      const expectedResult = {
        orderId,
        history: [{ version: 1, status: 3 }],
      };

      mockOrdersService.getOrderHistory.mockResolvedValue(expectedResult);

      const result = await controller.getOrder(
        orderId,
        query.version,
        undefined,
        undefined,
        undefined,
      );

      expect(ordersService.getOrderHistory).toHaveBeenCalledWith(orderId, {
        version: 1,
        timestamp: undefined,
        fromVersion: undefined,
        toVersion: undefined,
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
