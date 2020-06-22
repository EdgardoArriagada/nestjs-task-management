import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

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

  describe('validateUserPassword method', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();

      user = new User();
      user.username = 'TestUsername';
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is successfully', async () => {
      expect.assertions(1);
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toEqual('TestUsername');
    });

    it('throws if the user is not found', async () => {
      expect.assertions(1);
      userRepository.findOne.mockResolvedValue(null);
      await expect(userRepository.validateUserPassword(mockCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('does not call validatePassword if the user is not found', async () => {
      expect.assertions(1);
      userRepository.findOne.mockResolvedValue(null);
      try {
        await userRepository.validateUserPassword(mockCredentialsDto);
      } catch (e) {}

      expect(user.validatePassword).not.toHaveBeenCalled();
    });
    it('throws if the password is invalid', async () => {
      expect.assertions(1);
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      await expect(userRepository.validateUserPassword(mockCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
