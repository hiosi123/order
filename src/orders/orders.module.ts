import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/orderDetail.entity';
import { BuyersModule } from 'src/buyers/buyers.module';
import { OrderDetailsService } from './orderDetails.service';
import { EmployeesModule } from 'src/employees/employees.module';
import { AuthModule } from 'src/auth/auth.module';
import { DepartmentGuard } from 'src/auth/guards/department.guard';
import { RoleGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    BuyersModule,
    EmployeesModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService, 
    OrderDetailsService,
  ],
  exports: [OrdersService]
})
export class OrdersModule {}
