import User from "../user/user.model";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";

interface Credentials {
  username: string;
  email: string;
  password: string;
}

export async function register(data: Credentials) {
  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    username: data.username,
    email: data.email,
    passwordHash,
  });

  const token = signToken({ id: user.id, username: user.username });
  return { token, user: { id: user.id, username: user.username, email: user.email, score: user.score } };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  const token = signToken({ id: user.id, username: user.username });
  return { token, user: { id: user.id, username: user.username, email: user.email, score: user.score } };
}
