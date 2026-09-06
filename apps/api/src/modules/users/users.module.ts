import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UsersRepository } from './repositories/users.repository.js';
import { UsersService } from './services/users.service.js';
import { UsersController } from './controllers/users.controller.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UsersRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
