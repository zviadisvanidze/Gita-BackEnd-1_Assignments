import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { UsersService } from '../users/users.service';
import { Post, PostDocument } from './schemas/post.schema';
import { User } from '../users/schemas/user.schema';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Resolver(() => Post)
@UseGuards(GqlAuthGuard)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Post])
  posts() {
    return this.postsService.findAll();
  }

  @Query(() => Post)
  post(@Args('id', { type: () => ID }) id: string) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  createPost(
    @Args('input') input: CreatePostInput,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.postsService.create(input, user.userId);
  }

  @Mutation(() => Post)
  updatePost(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePostInput,
  ) {
    return this.postsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deletePost(@Args('id', { type: () => ID }) id: string) {
    return this.postsService.remove(id);
  }

  @ResolveField('author', () => User)
  resolveAuthor(@Parent() post: PostDocument) {
    return this.usersService.findOne(post.author.toString());
  }
}
