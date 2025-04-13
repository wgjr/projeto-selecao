import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { BalanceModule } from './modules/balance/balance.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        PaymentsModule,
        BalanceModule,
    ],
})
export class AppModule {
}
