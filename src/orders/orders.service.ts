import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, DataSource } from 'typeorm';
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
        private dataSource: DataSource,
        private buyersService: BuyersService, 
        private employeesService: EmployeesService,
        private orderDetailsService: OrderDetailsService
    ){}

    async create(orderDto: CreateOrderDto) {
        const buyer = await this.buyersService.findOne(orderDto.buyerId);
        if (!buyer) {
            throw new NotFoundException('Buyer not found');
        }

        return await this.dataSource.transaction(async (manager) => {
            // Order 생성
            const order = manager.create(Order, { buyer });
            const savedOrder = await manager.save(order);

            // OrderDetail 생성 (트랜잭션 매니저 전달)
            await this.orderDetailsService.createWithManager(
                orderDto.orderDetail, 
                savedOrder, 
                manager
            );

            return savedOrder;
        });
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
        const latestOrder = order.orderDetails.sort((a,b) => b.orderDetailId - a.orderDetailId)
        if (!latestOrder.length) {
            throw new NotFoundException('Order not found')
        }


        if (latestOrder[0].status < 3) {
            throw new NotFoundException('Previous request is not in confirm state')
        }

        // 트랜잭션 시작
        return await this.dataSource.transaction(async (manager) => {

            // 5. 새로운 OrderDetail 생성 (기존 객체 수정하지 않음)
            const newOrderDetail = {
                ...latestOrder[0],
                ...orderDto.orderDetail,
                status: 2,
            };

            // 6. Order 상태 업데이트
            await manager.update(Order, { orderId }, { orderStatus: 2 });

            // 7. 새 OrderDetail 저장
            return await this.orderDetailsService.createWithManager(
                newOrderDetail,
                order,
                manager
            );
        });
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
        const latestOrder = order.orderDetails.sort((a,b) => b.orderDetailId - a.orderDetailId)
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

        // 트랜잭션 시작
        return await this.dataSource.transaction(async (manager) => {
            // 5. 새로운 OrderDetail 생성
            const newOrderDetail = {
                ...latestOrder[0],
                status: 3,
                employee: employee,
            };

            // 6. Order 상태 업데이트
            await manager.update(Order, { orderId }, { orderStatus: 3 });

            // 7. 새 OrderDetail 저장
            return await this.orderDetailsService.createWithManager(
                newOrderDetail,
                order,
                manager
            );
        });
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
        const latestOrder = order.orderDetails.sort((a,b) => b.orderDetailId - a.orderDetailId)
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

        // 트랜잭션 시작
        return await this.dataSource.transaction(async (manager) => {
            // 5. 새로운 OrderDetail 생성 (거부 상태)
            const newOrderDetail = {
                ...latestOrder[0],
                status: 9,
                employee: employee,
            };

            // 6. 새 OrderDetail 저장 (Order 상태는 변경하지 않음)
            return await this.orderDetailsService.createWithManager(
                newOrderDetail,
                order,
                manager
            );
        });
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
        const sortedDetails = order.orderDetails.sort((a,b) => a.orderDetailId - b.orderDetailId).filter((e) => e.status === 3)

        // 3. 쿼리 타입에 따라 분기 (status가 3인것만 보기)
        const confiremdDetails = sortedDetails.filter((e) => e.status === 3) 
        console.log(confiremdDetails)
        // 3-1.버전간 비교 
        if (query.fromVersion !== undefined && query.toVersion !== undefined) {
            return this.compareVersions(confiremdDetails, query.fromVersion, query.toVersion)
        }
        // 3-2.특정 버전 조회
        if (query.version !== undefined) {
            return this.getVersionDetail(confiremdDetails, query.version)
        }
        // 3-3.특정 시점 조회
        if (query.timestamp) {
            return this.getDetailAtTimestamp(sortedDetails, query.timestamp)
        }

        return {
            orderId: order.orderId,
            buyer: order.buyer,
            currentStatus: order.orderStatus,
            totalVersions: confiremdDetails.length,
            history: confiremdDetails.map((detail, index) => ({
                version: index + 1,
                ...detail
            }))
        };
    }

    // 특정 버전 조회
    private getVersionDetail(details: OrderDetail[], version: number) {
        if (version < 1 || version > details.length) {
            throw new BadRequestException(`Version ${version} does not exist. Available version: 1-${details.length}`)
        }

        const detail = details[version-1]

        return {
            version,
            ...detail
        }
    }

    // 특정 시점 조회
    private getDetailAtTimestamp(details: OrderDetail[], timestamp: string) {
        const targetTime = this.parseTimestamp(timestamp).getTime()
        
        const validDetails = details.filter(d => {
            console.log(d.createdAt.getTime())
            console.log(targetTime)
            return d.createdAt.getTime() <= targetTime
        })

        if (validDetails.length === 0 ) {
            throw new NotFoundException('No order detail exists at the timestamp')
        }

        const detail = validDetails[validDetails.length - 1];
        const version = details.indexOf(detail) + 1

        return {
            requestedTimestamp: timestamp,
            version,
            ...detail
        }
    }

    // 버전 간 비교
    private compareVersions(details: OrderDetail[], fromVersion: number, toVersion: number) {
        if (fromVersion < 1|| fromVersion > details.length) {
            throw new BadRequestException(`From version ${fromVersion} does not exist`)
        }
        if (toVersion < 1 || toVersion > details.length) {
            throw new BadRequestException(`To version ${toVersion} does not exist`)
        }

        const from = details[fromVersion - 1];
        const to = details[toVersion - 1];

        const changes: any[] = []
        const fields = ['productName', 'quantity', 'unitPrice', 'color', 'size', 'dueDate']

        fields.forEach(field => {
            if (from[field] !== to[field]) {
                const verDiff = {
                    field,
                    from: from[field],
                    to: to[field],
                }

                if (typeof from[field] === "number" && typeof to[field] === "number") {
                    verDiff["difference"] = to[field] - from[field]
                } 

                changes.push(verDiff)
            }
        })

        return {
            fromVersion,
            toVersion,
            from: {
                ...from
            },
            to: {
                ...to
            },
            changes,
            changedFields: changes.length
        }
    }

    private parseTimestamp(timestamp: string): Date {
        // Unix timestamp 체크 (숫자만 있는 경우)
        if (/^\d+$/.test(timestamp)) {
            const num = parseInt(timestamp);
            // 밀리초인지 초인지 판단 (13자리면 밀리초, 10자리면 초)
            return new Date(timestamp.length === 13 ? num : num * 1000);
        }
        
        // ISO 8601 형식
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            throw new BadRequestException('Invalid timestamp format. Use ISO 8601 or Unix timestamp');
        }
        
        return date;
    }

}
