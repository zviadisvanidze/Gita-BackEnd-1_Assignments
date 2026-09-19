import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async create(input: CreatePostInput, authorId: string): Promise<Post> {
    const post = new this.postModel({ ...input, author: authorId });
    return post.save();
  }

  async update(id: string, input: UpdatePostInput): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, input);
    return post.save();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return true;
  }
}
