// orders/orders.controller.ts
import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { ConfirmOrderDto } from './dtos/confirm-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { DepartmentGuard } from 'src/auth/guards/department.guard';
import { Departments } from 'src/auth/decorators/departments.decorator';
import { Order } from './entities/order.entity';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @ApiOperation({ 
        summary: '주문 생성',
        description: 'Buyer만 주문을 생성할 수 있습니다. JWT 토큰에서 buyerId가 자동으로 설정됩니다.'
    })
    @ApiResponse({ 
        status: 201, 
        description: '주문 생성 성공',
        type: Order,
    })
    @ApiResponse({ status: 403, description: 'Buyer만 주문 생성 가능' })
    @Post()
    async createOrder(
        @Body() body: CreateOrderDto,
        @GetUser() user: any,
    ) {
        if (user.userType !== 'buyer') {
            throw new ForbiddenException('only buyers can create orders')
        }
        body.buyerId = user.userId;
        return this.ordersService.create(body)
    }

    @ApiOperation({ 
        summary: '주문 수정 (Buyer)',
        description: 'Buyer가 자신의 주문을 수정합니다. 승인된(status=3) 주문만 수정 가능합니다.'
    })
    @ApiParam({ name: 'orderId', description: '주문 ID (UUID)' })
    @ApiResponse({ 
        status: 200, 
        description: '주문 수정 성공',
        type: Order,
    })
    @ApiResponse({ status: 403, description: 'Buyer만 주문 수정 가능' })
    @ApiResponse({ status: 404, description: '주문을 찾을 수 없음' })
    @Patch('/:orderId')
    async updateOrder(
        @Param('orderId') orderId: string,
        @Body() body: UpdateOrderDto,
        @GetUser() user: any, 
    ){
        if (user.userType !== 'buyer') {
            throw new ForbiddenException('only buyers can update orders')
        }
        body.buyerId = user.userId
        return this.ordersService.updateByBuyer(orderId, body)
    }

    @ApiOperation({ 
        summary: '주문 승인 (Employee)',
        description: 'Sourcing 팀(S1)만 주문을 승인할 수 있습니다.'
    })
    @ApiParam({ name: 'orderId', description: '주문 ID (UUID)' })
    @ApiResponse({ 
        status: 201, 
        description: '주문 승인 성공',
        type: Order,
    })
    @ApiResponse({ status: 403, description: 'Sourcing 팀만 승인 가능' })
    @ApiResponse({ status: 404, description: '주문을 찾을 수 없음' })
    @Post('/:orderId/confirm')
    @UseGuards(DepartmentGuard)
    @Departments('S1')
    async confirmOrder(
        @Param('orderId') orderId: string,
        @Body() body: ConfirmOrderDto,
        @GetUser() user: any,
    ){
        body.employeeId = user.userId
        return this.ordersService.conifrmByEmployee(orderId, body)
    }

    @ApiOperation({ 
        summary: '주문 거부 (Employee)',
        description: 'Sourcing 팀(S1)만 주문을 거부할 수 있습니다.'
    })
    @ApiParam({ name: 'orderId', description: '주문 ID (UUID)' })
    @ApiResponse({ 
        status: 201, 
        description: '주문 거부 성공',
        type: Order,
    })
    @ApiResponse({ status: 403, description: 'Sourcing 팀만 거부 가능' })
    @ApiResponse({ status: 404, description: '주문을 찾을 수 없음' })
    @Post('/:orderId/reject') 
    @UseGuards(DepartmentGuard)
    @Departments('S1')
    async rejectOrder(
        @Param('orderId') orderId: string,
        @Body() body: ConfirmOrderDto,
        @GetUser() user: any,
    ) {
        body.employeeId = user.userId
        return this.ordersService.rejectByEmployee(orderId, body)
    }

    @ApiOperation({ 
        summary: '주문 이력 조회',
        description: '주문의 변경 이력을 조회합니다. 쿼리 파라미터로 특정 버전, 시점, 버전 간 비교가 가능합니다.'
    })
    @ApiParam({ name: 'orderId', description: '주문 ID (UUID)' })
    @ApiQuery({ name: 'version', description: '특정 버전 조회 (예: 2번째 버전)', required: false, type: Number })
    @ApiQuery({ name: 'timestamp', description: '특정 시점 조회 (ISO 8601 또는 Unix timestamp)', required: false, type: String, example: '2025-02-15T10:00:00Z' })
    @ApiQuery({ name: 'fromVersion', description: '비교 시작 버전', required: false, type: Number })
    @ApiQuery({ name: 'toVersion', description: '비교 종료 버전', required: false, type: Number })
    @ApiResponse({ 
        status: 200, 
        description: '조회 성공',
        schema: {
            example: {
                orderId: '57ba651c-230d-418c-acbf-187b05307504',
                buyer: { buyerId: '...', buyerName: '디자이너' },
                currentStatus: 3,
                totalVersions: 3,
                history: [
                    { version: 1, productName: '양말', quantity: 1000, status: 3 },
                    { version: 2, productName: '양말', quantity: 1500, status: 3 },
                ]
            }
        }
    })
    @ApiResponse({ status: 404, description: '주문을 찾을 수 없음' })
    @Get('/:orderId')
    async getOrder(
        @Param('orderId') orderId: string,
        @Query('version') version?: number,
        @Query('timestamp') timestamp?: string,
        @Query('fromVersion') fromVersion?: number,
        @Query('toVersion') toVersion?: number,
    ) {
        return this.ordersService.getOrderHistory(orderId, {
            version,
            timestamp,
            fromVersion,
            toVersion,
        })
    }
}