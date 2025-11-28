import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { ConfirmOrderDto } from './dtos/confirm-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    async createOrder(
        @Body() body: CreateOrderDto
    ) {
        return this.ordersService.create(body)
    }

    // 고객이 주문 수정 (pending 상태만)
    @Patch('/:orderId')
    async updateOrder(
        @Param('orderId') orderId: string,
        @Body() body: UpdateOrderDto
    ){
        return this.ordersService.updateByBuyer(orderId, body)
    }

    // 직원이 주문 확정
    @Post('/:orderId/confirm')
    async confirmOrder(
        @Param('orderId') orderId: string,
        @Body() body: ConfirmOrderDto,
    ){
        return this.ordersService.conifrmByEmployee(orderId, body)
    }

    // 직원이 주문 반려
    @Post('/:orderId/reject') 
    async rejectOrder(
        @Param('orderId') orderId: string,
        @Body() body: ConfirmOrderDto,
    ) {
        return this.ordersService.rejectByEmployee(orderId, body)
    }

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
