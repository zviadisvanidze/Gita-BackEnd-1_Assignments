import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('statistics')
  getStatisticsByGender() {
    return this.usersService.getStatisticsByGender();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Throttle({ strict: { limit: 5, ttl: 60000 } })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Throttle({ strict: { limit: 5, ttl: 60000 } })
  @Post('upgrade-subscription')
  upgradeSubscription(@Body() upgradeSubscriptionDto: UpgradeSubscriptionDto) {
    return this.usersService.upgradeSubscription(upgradeSubscriptionDto.email);
  }

  @Throttle({ strict: { limit: 5, ttl: 60000 } })
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    if (currentUser.userId !== id) {
      throw new ForbiddenException('You can only modify your own account');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Throttle({ strict: { limit: 5, ttl: 60000 } })
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    if (currentUser.userId !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(id);
  }
}
