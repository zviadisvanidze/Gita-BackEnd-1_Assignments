import 'dotenv/config';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { User, UserSchema } from './users/schemas/user.schema';

const TOTAL_USERS = 150_000;
const BATCH_SIZE = 5_000;

function buildUser(index: number) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const gender = faker.person.sex() === 'male' ? 'm' : 'f';
  const age = faker.number.int({ min: 1, max: 90 });
  const email = `${faker.internet.email({ firstName, lastName }).split('@')[0]}.${index}@example.com`;

  return { firstName, lastName, age, gender, email };
}

async function seed() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error('MONGO_URL არ არის მითითებული .env ფაილში');
  }

  await mongoose.connect(mongoUrl);
  console.log('დაკავშირებულია MongoDB-სთან');

  const UserModel = mongoose.model(User.name, UserSchema);

  await UserModel.deleteMany({});
  console.log('ძველი იუზერები წაშლილია');

  for (let start = 0; start < TOTAL_USERS; start += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, TOTAL_USERS - start) }, (_, i) =>
      buildUser(start + i),
    );
    await UserModel.insertMany(batch, { ordered: false });
    console.log(`დაემატა ${start + batch.length}/${TOTAL_USERS} იუზერი`);
  }

  console.log(`სულ ${TOTAL_USERS} იუზერი დაემატა`);

  await mongoose.disconnect();
  console.log('სიდი დასრულებულია');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
