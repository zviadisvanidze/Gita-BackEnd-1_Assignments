import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type Gender = 'male' | 'female' | 'other';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: Gender;

  @Prop({ required: true })
  subscriptionStartDate: Date;

  @Prop({ required: true })
  subscriptionEndDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as { password?: string }).password;
    return ret;
  },
});
