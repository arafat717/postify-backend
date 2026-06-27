import { prisma } from "../../lib/prisma";
import bycript from "bcrypt";
import { TLogin } from "./auth.interface";
import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUserIntoDb = async (payload: TLogin) => {
  const { email, password } = payload;
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bycript.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect!");
  }

  const tokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    tokenPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    tokenPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

const getMyProfileIntoDb = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const updateProfileIntoDb = async (userId: string, data: any) => {
  const { name, email, bio, profilePhoto } = data;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return updatedUser;
};

export const authService = {
  loginUserIntoDb,
  getMyProfileIntoDb,
  updateProfileIntoDb,
};
