import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type Gender = 'm' | 'f';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, index: true })
  age: number;

  @Prop({ required: true, enum: ['m', 'f'] })
  gender: Gender;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
