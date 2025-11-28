import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { BuyersService } from 'src/buyers/buyers.service';
import { OrderDetailsService } from './orderDetails.service';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderDetail } from './entities/orderDetail.entity';
import { ConfirmOrderDto } from './dtos/confirm-order.dto';
import { EmployeesService } from 'src/employees/employees.service';

// orders.service.ts
interface HistoryQuery {
    version?: number;
    timestamp?: string;
    fromVersion?: number;
    toVersion?: number;
}

@Injectable()
export class OrdersService {

    
    constructor(
        @InjectRepository(Order) private repo: Repository<Order>,
        private buyersService: BuyersService, 
        private employeesService: EmployeesService,
        private orderDetailsService: OrderDetailsService
    ){}

    async create(orderDto: CreateOrderDto) {

        const buyer = await this.buyersService.findOne(orderDto.buyerId)
        if (!buyer) {
            throw new NotFoundException('Buyer not found')
        }

        // Order 먼저 생성
        const order = this.repo.create()
        order.buyer = buyer
        const savedOrder = await this.repo.save(order)

        // OrderDetail 생성 및 저장
        await this.orderDetailsService.create(orderDto.orderDetail, order)

        return savedOrder
    }

    async update(orderId: string, orderDto: Partial<Order>) {
        const order = await this.repo.findOneBy({orderId})
        if (!order) {
            throw new NotFoundException("Order not found")
        }

        Object.assign(order, orderDto)
        return this.repo.save(order)
    }

    async updateByBuyer(orderId: string, orderDto: UpdateOrderDto) {

        // 1.최소 1개 필드 확인
        const hasAtLeastOneField = Object.values(orderDto.orderDetail || {})
            .some(value => value !== undefined);

        if (!hasAtLeastOneField) {
            throw new BadRequestException('At least one field must be provided');
        }
    

        // 2. buyer 정보 확인
        const buyer = await this.buyersService.findOne(orderDto.buyerId)
        if (!buyer) {
            throw new NotFoundException('Buyer not found')
        }

        // 3. order 가져오기
        const order = await this.repo.findOne({ 
            where: { orderId }, 
            relations: ['orderDetails', 'buyer'] 
        });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // 3.5 buyer 와 order 의 정보가 일치하는지 확인
        if (order.buyer.buyerId !== buyer.buyerId) {
            throw new BadRequestException("Order is not buyer's order")
        }

        // 4. 주문서 분류
        const latestOrder = order.orderDetails.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
        if (!latestOrder.length) {
            throw new NotFoundException('Order not found')
        }


        if (latestOrder[0].status > 3) {
            throw new NotFoundException('Previous request is not in confirm state')
        }

        // 5. 오더 디테일 상태 업데이트
        const confirmedOrderDetail = latestOrder[0]
        Object.assign(confirmedOrderDetail, orderDto.orderDetail)
        confirmedOrderDetail.status = 2
        confirmedOrderDetail.createdAt = new Date()

        // 6. 오더 상태 업데이트
        order.orderStatus = 2
        await this.update(order.orderId, order)

        return this.orderDetailsService.create(confirmedOrderDetail, order)
    }

    async conifrmByEmployee(orderId: string, confirmDto: ConfirmOrderDto) {

        // 1. 오더 가져오기
        const order = await this.repo.findOne({
            where: {orderId},
            relations: ['orderDetails']
        })
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // 2. pending 오더 확인        
        const latestOrder = order.orderDetails.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
        if (!latestOrder.length) {
            throw new NotFoundException('Order not found')
        }

        if (latestOrder[0].status !== 2) {
            throw new NotFoundException('Previous request is not in pending state')
        }


        // 3. 직원 존재 여부
        const employee = await this.employeesService.findOne(confirmDto.employeeId)
        if (!employee) {
            throw new NotFoundException("Employee not found")
        }

        // 4. 직원 권한 여부
        if (employee.department.departmentCode !== "S1") {
            throw new BadRequestException("Department is not sourcing team")
        }

        // 5. 오더 디테일 상태 업데이트
        const orderDetail = latestOrder[0]
        orderDetail.status = 3
        orderDetail.employee = employee
        orderDetail.createdAt = new Date()

        // 6. 오더 상태 업데이트
        order.orderStatus = 3
        await this.update(order.orderId, order)

        return this.orderDetailsService.create(orderDetail, order)
    }

    async rejectByEmployee(orderId: string, confirmDto: ConfirmOrderDto) {
        // 1. 오더 가져오기
        const order = await this.repo.findOne({
            where: {orderId},
            relations: ['orderDetails']
        })
        if (!order) {
            throw new NotFoundException('Order does not exist')
        }

        // 2. pending order 확인
        const latestOrder = order.orderDetails.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
        if (!latestOrder.length) {
            throw new NotFoundException('Order not found')
        }

        if (latestOrder[0].status !== 2) {
            throw new NotFoundException('Previous request is not in pending state')
        }

        // 3. 직원 존재 여부
        const employee = await this.employeesService.findOne(confirmDto.employeeId)
        if (!employee) {
            throw new NotFoundException("Employee not found")
        }

        // 4. 직원 권한 여부
        if (employee.department.departmentCode !== "S1") {
            throw new BadRequestException("Department is not sourcing team")
        }

        // 5. 오더 디테일 상태 업데이트
        const orderDetail = latestOrder[0]
        orderDetail.status = 9
        orderDetail.employee = employee
        orderDetail.createdAt = new Date()
        

        return this.orderDetailsService.create(orderDetail, order)
    }

    
    async getOrderHistory(orderId: string, query: HistoryQuery) {
        // 1. 오더 가져오기
        const order = await this.repo.findOne({
            where: {orderId},
            relations: ['orderDetails', 'buyer']
        })
        if (!order) {
            throw new NotFoundException('Order not found')
        }

        // 2. 오더 시간순 정렬
        const sortedDetails = order.orderDetails.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).filter((e) => e.status === 3)

        // 3. 쿼리 타입에 따라 분기

        // 3-1.버전간 비교 (status가 3인것만 보기)
        if (query.fromVersion !== undefined && query.toVersion !== undefined) {
            return this.compareVersion(sortedDetails, query.fromVersion, query.toVersion)
        }

        return order
    }

    // 특정 버전 조회
    private 
}
