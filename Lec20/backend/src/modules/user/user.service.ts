import User, { IUser } from "./user.model";
import { hashPassword } from "../../utils/password";

const PUBLIC_FIELDS = "-passwordHash";


export async function getAllUsers() {
  return User.find().select(PUBLIC_FIELDS).sort({ score: -1 });
}


export async function getUserById(id: string) {
  return User.findById(id).select(PUBLIC_FIELDS);
}


export async function createUser(data: { username: string; email: string; password: string }) {
  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    username: data.username,
    email: data.email,
    passwordHash,
  });
  const { passwordHash: _omit, ...rest } = user.toObject();
  return rest;
}


export async function updateUser(
  id: string,
  data: Partial<{ username: string; email: string; password: string; score: number }>
) {
  const update: Partial<IUser> = {};
  if (data.username !== undefined) update.username = data.username;
  if (data.email !== undefined) update.email = data.email;
  if (data.score !== undefined) update.score = data.score;
  if (data.password !== undefined) update.passwordHash = await hashPassword(data.password);

  return User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).select(PUBLIC_FIELDS);
}


export async function deleteUser(id: string) {
  return User.findByIdAndDelete(id);
}
