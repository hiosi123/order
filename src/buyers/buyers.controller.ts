import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto } from './dtos/create-buyer.dto';
import { UpdateBuyerDto } from './dtos/update-buyer.dto';

@Controller('buyers')
export class BuyersController {
    constructor(
        private BuyersService: BuyersService
    ){}

    @Get('/:buyerId')
    async findBuyer(
        @Param('buyerId') buyerId: string,
    ) {
        return this.BuyersService.findOne(buyerId)
    }

    @Get()
    async findAllBuyers(
        @Query('email') email: string,
    ) {
        return this.BuyersService.find(email)
    }

    @Post()
    create(
        @Body() createBuyerDto: CreateBuyerDto
    ) {
        return this.BuyersService.create(createBuyerDto);
    }

    @Patch('/:buyerId')
    async updateBuyer(
        @Param('buyerId') buyerId: string,
        @Body() updateBuyerDto: UpdateBuyerDto,
    ) {
        return this.BuyersService.update(buyerId, updateBuyerDto)
    }

    @Delete('/:buyerId')
    async deleteBuyer(
        @Param('buyerId') buyerId: string,
    ) {
        return this.BuyersService.remove(buyerId)
    }
}
