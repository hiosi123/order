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
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // console.log(config.get('DB_HOST'), config.get('DB_PORT'),config.get('DB_USERNAME'),config.get('DB_PASSWORD'), config.get('DB_DATABASE'))
        return {
          type: 'mysql',
          driver: require('mysql2'), // 'mysql2' 드라이버 명시적으로 사용
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [Buyer, Employee, Department, Order, OrderDetail],
          synchronize: true,
          timezone: 'Z',
        }
      }
    }),
    AuthModule,
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
