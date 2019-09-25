import jwt from 'jsonwebtoken';

export function createJWT(userId: number): string {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET || 'secret');
}

export default createJWT;
