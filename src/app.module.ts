import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { EmployeesModule } from './employees/employees.module';
import { BuyersModule } from './buyers/buyers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './buyers/entities/buyer.entity';
import { Employee } from './employees/entities/employee.entity';
import { Order } from './orders/entities/order.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Department } from './employees/entities/department.entity';
import { OrderDetail } from './orders/entities/orderDetail.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite', 
          database: config.get<string>('DB_NAME'),
          synchronize: true, // true for development, false for production
          entities: [Buyer, Employee, Department, Order, OrderDetail],
        }
      }
    }),
    BuyersModule,
    OrdersModule, 
    EmployeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer){
    consumer.apply()
    .forRoutes('*')
  }
}
