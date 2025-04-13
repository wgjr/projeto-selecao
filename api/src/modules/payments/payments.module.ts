import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import {Payment} from "./payment.entity";
import {Balance} from "../balance/balance.entity";
import {User} from "../user/user.entity";
import {BalanceModule} from "../balance/balance.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Balance, User]),
    BalanceModule
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
