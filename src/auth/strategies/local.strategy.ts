import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException(`User with email ${email} not found`);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException(`Invalid password for email ${email}`);

    delete user['password'];
    delete user['is_deleted'];
    delete user['created_at'];
    delete user['updated_at'];
    delete user['deleted_at'];
    return user;
  }
}
