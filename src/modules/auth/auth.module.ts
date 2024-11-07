import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { userEntity } from 'src/model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Token } from 'src/helper/utils/token';
import { hash } from 'src/helper/utils/hash';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity]), userEntity, JwtModule.register({}),],
  controllers: [AuthController],
  providers: [AuthService, Token, hash],
  exports: [AuthService, Token, hash]
})
export class AuthModule { }
