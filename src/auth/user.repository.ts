import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

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

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (await user?.validatePassword(password)) return user.username;

    throw new UnauthorizedException('Invalid credentials');
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
