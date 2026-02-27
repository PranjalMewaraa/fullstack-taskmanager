import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { env } from '../../config/env';
import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/apiError';
import { LoginInput, RegisterInput } from './auth.schema';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type JwtPayload = {
  sub: string;
  email: string;
};

const signToken = (payload: JwtPayload, secret: Secret, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const buildTokens = (user: Pick<User, 'id' | 'email'>): Tokens => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
  };

  return {
    accessToken: signToken(payload, env.ACCESS_TOKEN_SECRET, env.ACCESS_TOKEN_EXPIRES_IN),
    refreshToken: signToken(payload, env.REFRESH_TOKEN_SECRET, env.REFRESH_TOKEN_EXPIRES_IN),
  };
};

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

    if (existingUser) {
      throw new ApiError(400, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const tokens = buildTokens(user);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, env.BCRYPT_SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
      refreshToken: tokens.refreshToken,
    };
  },

  async refresh(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as JwtPayload;
    } catch {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user?.refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const isTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isTokenMatch) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const newAccessToken = signToken(
      { sub: user.id, email: user.email },
      env.ACCESS_TOKEN_SECRET,
      env.ACCESS_TOKEN_EXPIRES_IN,
    );

    return {
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  },

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },
};
