import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../users/schemas/user.schema';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  const result = await userModel.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } },
  );

  console.log(
    `Matched ${result.matchedCount} user(s), updated ${result.modifiedCount} user(s) with isActive: true`,
  );

  await app.close();
}

run().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
