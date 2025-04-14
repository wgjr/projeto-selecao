import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { CreatePaymentDto } from './payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true }))
    createPaymentDto: CreatePaymentDto,
  ) {
    try {
      return await this.paymentsService.createPayment({
        userId: req.user.userId,
        ...createPaymentDto,
      });
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Get()
  async getPayments(@Request() req) {
    try {
      return await this.paymentsService.getPayments(req.user.userId);
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Get('/:id')
  async getPaymentById(@Request() req, @Param('id') paymentId: number) {
    try {
      return await this.paymentsService.getPaymentsById(
        paymentId,
        req.user.userId,
      );
    } catch (error) {
      throw new BadRequestException({
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Delete(':id')
  async deletePayment(@Request() req, @Param('id') paymentId: number) {
    try {
      return await this.paymentsService.deletePayment(
        paymentId,
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
  async updatePayment(
    @Request() req,
    @Param('id') paymentId: number,
    @Body('newName') newName: string,
  ) {
    try {
      return await this.paymentsService.updatePayment(
        paymentId,
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
