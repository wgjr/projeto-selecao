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
    HttpException, BadRequestException
} from '@nestjs/common';
import {PaymentsService} from './payments.service';
import {JwtAuthGuard} from "../../auth/auth.guard";
import {CreatePaymentDto} from "./payment.dto";
import {response} from "express";

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {
    }

    @Post()
    async createPayment(
        @Request() req,
        @Body(new ValidationPipe({ whitelist: true })) createPaymentDto: CreatePaymentDto,
    ) {
        try {
            return await this.paymentsService.createPayment({
                    userId: req.user.userId,
                    ...createPaymentDto
                }
            );
        } catch (error) {
            throw new BadRequestException({
                cause: new Error(),
                description: error.message,
            });
        }
    }

    @Get()
    async getPayments(@Request() req) {
        return this.paymentsService.getPayments(req.user.userId);
    }

    @Delete(':id')
    async deletePayment(@Param('id') paymentId: number) {
        return this.paymentsService.deletePayment(paymentId);
    }

    @Put(':id')
    async updatePayment(@Param('id') paymentId: number, @Body('newName') newName: string) {
        return this.paymentsService.updatePayment(paymentId, newName);
    }
}
