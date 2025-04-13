import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Payment} from './payment.entity';
import {Balance} from '../balance/balance.entity';
import {User} from '../user/user.entity';
import {BalanceService} from "../balance/balance.service";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Balance)
        private balanceRepository: Repository<Balance>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private balanceService: BalanceService
    ) {
    }

    async createPayment(
        data: {
            userId: number,
            name: string,
            description: string,
            amount: number,
            balanceId: number,
        }
    ): Promise<Payment> {
        try {
            const user = await this.userRepository.findOne({where: {id: data.userId}});

            if (!user) {
                throw new Error('Usuário não identificado');
            }

            await this.balanceService.processBalance(data.balanceId, data.amount)

            const payment = new Payment();
            payment.name = data.name;
            payment.description = data.description;
            payment.amount = data.amount;
            payment.balance_id = data.balanceId;
            payment.user_id = data.userId;

            return await this.paymentsRepository.save(payment);
        } catch (error) {
            throw new Error(`${ error.message}`);
        }
    }

    async getPayments(userId: number): Promise<Payment[]> {
        return this.paymentsRepository.find({where: {user_id: userId}});
    }

    async deletePayment(paymentId: number): Promise<void> {
        const payment = await this.paymentsRepository.findOne({where: {id: paymentId}});

        if (!payment) {
            throw new Error('Payment not found');
        }

        const lastBalance= await this.balanceRepository.findOne({where: {id: payment.balance_id}})

        if (!lastBalance) {
            throw new Error('Balance not found');
        }

        lastBalance.initial_value = lastBalance.remaining_value
        lastBalance.remaining_value = (lastBalance.remaining_value + payment.amount)
    }

    async updatePayment(paymentId: number, newName: string): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({where: {id: paymentId}});

        if (!payment) {
            throw new Error('Payment not found');
        }

        payment.name = newName;
        return this.paymentsRepository.save(payment);
    }
}
