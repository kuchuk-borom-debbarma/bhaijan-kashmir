import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.AUTH_SECRET || 'dev-secret-key-change-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

export async function createMagicLinkToken(payload: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // Token valid for 1 hour
    .sign(key);
}

export async function verifyMagicLinkToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
    };
  } catch (error) {
    return null;
  }
}
