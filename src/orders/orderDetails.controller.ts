import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDetailDto } from './dtos/create-orderDetail.dto';

@Controller('orderDetails')
export class OrderDetailsController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    create(@Body() body: CreateOrderDetailDto) {
        return this.ordersService.create 
    }
}
