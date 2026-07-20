import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  username: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}
