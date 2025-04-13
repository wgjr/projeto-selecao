import {Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Request, ValidationPipe} from '@nestjs/common';
import { BalanceService } from './balance.service';
import {JwtAuthGuard} from "../../auth/auth.guard";
import {CreatePaymentDto} from "../payments/payment.dto";
import {CreateBalanceDto} from "./balance.dto";
@Controller('balances')
@UseGuards(JwtAuthGuard)
export class BalanceController {
    constructor(private readonly balanceService: BalanceService) {}

    @Post()
    async createBalance(
        @Request() req,
        @Body(new ValidationPipe({ whitelist: true })) createBalanceDto: CreateBalanceDto,
    ) {
        return this.balanceService.createBalance(
            {
                amountValue: createBalanceDto.amount,
                userId: req.user.userId,
                name: createBalanceDto.name,
                description: createBalanceDto.description,
            }
        );
    }

    @Get()
    async getBalances(@Request() req) {
        return this.balanceService.getBalances(req.user.userId);
    }

    @Delete(':id')
    async deleteBalance(@Param('id') balanceId: number) {
        return this.balanceService.deleteBalance(balanceId);
    }

    @Put(':id')
    async updateBalance(@Param('id') balanceId: number, @Body('newName') newName: string, @Body('newValue') newValue: number) {
        return this.balanceService.updateBalance(balanceId, newName, newValue);
    }
}
