import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'TestPassword';
    user.salt = 'TestSalt';
    bcrypt.hash = jest.fn();
  });
  it('returns true when password is valid', async () => {
    expect.assertions(3);
    bcrypt.hash.mockResolvedValue('TestPassword');

    expect(bcrypt.hash).not.toHaveBeenCalled();

    const result = await user.validatePassword('1234');

    expect(result).toEqual(true);
    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 'TestSalt');
  });
  it('returns false when password is invalid', async () => {
    expect.assertions(1);
    bcrypt.hash.mockResolvedValue('WrongPassword');

    const result = await user.validatePassword('1234');

    expect(result).toEqual(false);
  });
});
