import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/orderDetail.entity';
import { BuyersModule } from 'src/buyers/buyers.module';
import { OrderDetailsService } from './orderDetails.service';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    BuyersModule,
    EmployeesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderDetailsService],
})
export class OrdersModule {}
