import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import { Repository } from 'typeorm';
import { CreateBuyerDto } from './dtos/create-buyer.dto';

@Injectable()
export class BuyersService {
    constructor (
        @InjectRepository(Buyer) private repo: Repository<Buyer>
    ){}

    async create(createBuyerDto: CreateBuyerDto) {
        const buyers = await this.find(createBuyerDto.email)
        if (buyers.length) {
            throw new BadRequestException("Email in use")
        }

        const buyer = this.repo.create(createBuyerDto)
        return this.repo.save(buyer)
    }

    find(email: string) {
        return this.repo.find({where: {email}}) // return array
    }

    findOne(buyerId: string) {
        if (!buyerId) {
            throw new NotFoundException('Buyer ID is required')
        }

        return this.repo.findOneBy({buyerId})
    }

    async update(buyerId: string, attrs: Partial<Buyer>) {
        const buyer = await this.repo.findOneBy({buyerId})
        if (!buyer) {
            throw new NotFoundException('Buyer not found')
        }

        Object.assign(buyer, attrs)
        return this.repo.save(buyer)
    }

    async remove(buyerId: string) {
        const buyer = await this.repo.findOneBy({buyerId})
        if (!buyer) {
            throw new NotFoundException('Buyer not found')
        }

        return this.repo.remove(buyer)
    }
}
