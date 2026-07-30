import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.headers['email'];

    let hasActiveSubscription = false;
    if (typeof email === 'string') {
      const user = await this.usersService.findByEmail(email);
      if (user && user.subscriptionEndDate > new Date()) {
        hasActiveSubscription = true;
      }
    }

    request['hasActiveSubscription'] = hasActiveSubscription;
    return true;
  }
}
