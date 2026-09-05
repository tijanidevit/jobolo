import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository.js';
import { UserEntity } from '../entities/user.entity.js';
import { AppNotFoundException } from '../../../common/exceptions/app.exceptions.js';

/**
 * Users service — owns user profile business operations.
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new AppNotFoundException('User', 'USER_NOT_FOUND');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  async updateProfile(
    id: string,
    data: { firstName?: string; lastName?: string },
  ): Promise<UserEntity> {
    const user = await this.findById(id);

    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;

    return this.usersRepository.save(user);
  }
}
