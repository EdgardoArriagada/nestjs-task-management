import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

const mockCredentialsDto: AuthCredentialsDto = { username: 'TestUsername', password: 'TestPassword' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp method', () => {
    beforeEach(() => {
      userRepository.create = jest.fn().mockReturnValue({});
      userRepository.hashPassword = jest.fn().mockResolvedValue('testHash');
      userRepository.genSalt = jest.fn().mockResolvedValue('testSalt');
    });

    it('successfully signs the user', async () => {
      expect.assertions(1);
      userRepository.saveUser = jest.fn().mockResolvedValue(undefined);
      await userRepository.signUp(mockCredentialsDto);
      expect(userRepository.saveUser).toHaveBeenCalledWith({
        username: 'TestUsername',
        password: 'testHash',
        salt: 'testSalt',
      });
    });
  });
});
