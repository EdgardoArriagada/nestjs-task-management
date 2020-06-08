import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    await this.saveUser(user);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async saveUser(user: User) {
    const DUPLICATE_ERROR_CODE = '23505';
    try {
      await user.save();
    } catch (error) {
      if (error.code === DUPLICATE_ERROR_CODE) throw new ConflictException('Username already exists');
      throw new InternalServerErrorException();
    }
  }
}
