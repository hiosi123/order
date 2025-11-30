// buyers/buyers.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto } from './dtos/create-buyer.dto';
import { UpdateBuyerDto } from './dtos/update-buyer.dto';
import { Buyer } from './entities/buyer.entity';

@ApiTags('Buyers')
@Controller('buyers')
export class BuyersController {
    constructor(
        private BuyersService: BuyersService
    ){}

    @ApiOperation({ summary: '구매자 ID로 조회' })
    @ApiParam({ name: 'buyerId', description: '구매자 ID (UUID)' })
    @ApiResponse({ status: 200, description: '조회 성공', type: Buyer })
    @ApiResponse({ status: 404, description: '구매자를 찾을 수 없음' })
    @Get('/:buyerId')
    async findBuyer(
        @Param('buyerId') buyerId: string,
    ) {
        return this.BuyersService.findOne(buyerId)
    }

    @ApiOperation({ summary: '구매자 목록 조회' })
    @ApiQuery({ name: 'email', description: '검색할 이메일', required: false })
    @ApiResponse({ status: 200, description: '조회 성공', type: [Buyer] })
    @Get()
    async findAllBuyers(
        @Query('email') email?: string,
    ) {
        return this.BuyersService.find(email)
    }

    @ApiOperation({ summary: '구매자 생성' })
    @ApiResponse({ status: 201, description: '생성 성공', type: Buyer })
    @ApiResponse({ status: 400, description: '잘못된 요청' })
    @Post()
    create(
        @Body() createBuyerDto: CreateBuyerDto
    ) {
        return this.BuyersService.create(createBuyerDto);
    }

    @ApiOperation({ summary: '구매자 정보 수정' })
    @ApiParam({ name: 'buyerId', description: '구매자 ID (UUID)' })
    @ApiResponse({ status: 200, description: '수정 성공', type: Buyer })
    @ApiResponse({ status: 404, description: '구매자를 찾을 수 없음' })
    @Patch('/:buyerId')
    async updateBuyer(
        @Param('buyerId') buyerId: string,
        @Body() updateBuyerDto: UpdateBuyerDto,
    ) {
        return this.BuyersService.update(buyerId, updateBuyerDto)
    }

    @ApiOperation({ summary: '구매자 삭제' })
    @ApiParam({ name: 'buyerId', description: '구매자 ID (UUID)' })
    @ApiResponse({ status: 200, description: '삭제 성공' })
    @ApiResponse({ status: 404, description: '구매자를 찾을 수 없음' })
    @Delete('/:buyerId')
    async deleteBuyer(
        @Param('buyerId') buyerId: string,
    ) {
        return this.BuyersService.remove(buyerId)
    }
}