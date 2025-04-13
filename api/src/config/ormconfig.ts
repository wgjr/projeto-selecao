import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/dbname',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};
