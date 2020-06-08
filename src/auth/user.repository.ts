import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

const saveUser = async (user: User) => {
  const DUPLICATE_ERROR_CODE = '23505';
  try {
    await user.save();
  } catch (error) {
    if (error.code === DUPLICATE_ERROR_CODE) throw new ConflictException('Username already exists');
    throw new InternalServerErrorException();
  }
};

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    await saveUser(user);
  }
}
