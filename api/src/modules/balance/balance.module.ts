import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { Balance } from './balance.entity';
import { User } from '../user/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Balance, User])],
  providers: [BalanceService],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class BalanceModule {}
