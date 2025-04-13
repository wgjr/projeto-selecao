import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from "../config/ormconfig";

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig)],
})
export class DatabaseModule {
}
