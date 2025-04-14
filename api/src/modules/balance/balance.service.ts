import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './balance.entity';
import { User } from '../user/user.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBalance(data: {
    userId: number;
    name: string;
    description?: string;
    amountValue: number;
  }): Promise<Balance> {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('Usuário não localizado');
    }

    const balance = new Balance();
    balance.name = data.name;
    balance.description = data.description;
    balance.initial_value = data.amountValue;
    balance.remaining_value = data.amountValue;
    balance.operations_value = 0;
    balance.user_id = data.userId;

    const saveBalance = await this.balanceRepository.save(balance);

    if (!saveBalance) {
      throw new Error('Ocorreu um erro ao registrar o saldo. Tente novamente.');
    }

    return saveBalance;
  }

  async processBalance(
    balanceId: number,
    value: number,
    userId: number,
  ): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: { id: balanceId, user_id: userId },
    });

    if (!balance) {
      throw new Error('Saldo não localizado');
    }

    if (balance.remaining_value < value) {
      throw new Error('Saldo insuficiente para essa operação');
    }

    balance.remaining_value = +balance.remaining_value - +value;
    balance.operations_value = +balance.operations_value + +value;

    return await this.balanceRepository.save(balance);
  }

  async getBalances(userId: number): Promise<Balance[]> {
    return await this.balanceRepository.find({ where: { user_id: userId } });
  }

  async getBalanceFromId(
    balanceId: number,
    userId: number,
  ): Promise<Balance | null> {
    return await this.balanceRepository.findOne({
      where: { id: balanceId, user_id: userId },
    });
  }

  async updateBalance(
    balanceId: number,
    newName: string,
    userId: number,
  ): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: { id: balanceId, user_id: userId },
    });

    if (!balance) {
      throw new Error('Saldo não localizado');
    }

    balance.name = newName;

    return await this.balanceRepository.save(balance);
  }

  async deleteBalance(balanceId: number, userId: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: { id: balanceId, user_id: userId },
      relations: ['payments'],
    });

    if (!balance) {
      throw new Error('Saldo não localizado');
    }

    if (balance.payments.length > 0) {
      throw new Error('Existem pagamentos associados a esse saldo');
    }

    await this.balanceRepository.delete({ id: balanceId });

    return balance;
  }
}
