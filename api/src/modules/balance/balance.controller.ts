import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { CreateBalanceDto } from './balance.dto';
@Controller('balances')
@UseGuards(JwtAuthGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  async createBalance(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true }))
    createBalanceDto: CreateBalanceDto,
  ) {
    try {
      return this.balanceService.createBalance({
        amountValue: createBalanceDto.amount,
        userId: req.user.userId,
        name: createBalanceDto.name,
        description: createBalanceDto.description,
      });
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Get()
  async getBalances(@Request() req) {
    try {
      return this.balanceService.getBalances(req.user.userId);
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Get('/:id')
  async getBalanceById(@Request() req, @Param('id') balanceId: number) {
    try {
      return this.balanceService.getBalanceFromId(balanceId, req.user.userId);
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Delete(':id')
  async deleteBalance(@Request() req, @Param('id') balanceId: number) {
    try {
      return await this.balanceService.deleteBalance(
        balanceId,
        req.user.userId,
      );
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Put(':id')
  async updateBalance(
    @Request() req,
    @Param('id') balanceId: number,
    @Body('newName') newName: string,
  ) {
    try {
      return this.balanceService.updateBalance(
        balanceId,
        newName,
        req.user.userId,
      );
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }
}
