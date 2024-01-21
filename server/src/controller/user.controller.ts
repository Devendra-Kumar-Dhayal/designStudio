import { Request, Response } from "express";
import { omit } from "lodash";
import {
  ChangePasswordInput,
  ChooseRoleAdminInput,
  ChooseUserRoleInput,
  CreateUserInput,
  ForgotPasswordInput,
  VerifyEmailForgotPasswordInput,
  chooseRoleSchema,
} from "../schema/user.schema";
import {
  changePassword,
  chooseRole,
  createNewToken,
  createUser,
  findUser,
  getRoleUser,
  verifyForgotUser,
} from "../service/user.service";
import logger from "../utils/logger";
import { use } from "passport";
import { createSessionFromUser } from "./session.controller";
import config from "config";
import { signJwt } from "../utils/jwt.utils";
import sendEmail from "../utils/mailter";
// import { createCompleteSession } from "../service/session.service";

// export type User =

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    // await createCompleteSession(req,user)
    await createSessionFromUser(user, req, res);

    // return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  // if(!res.locals.user)
  console.log("locals", res.locals.user);
  const id = res.locals.user._id;
  const user = await findUser({ _id: id });
  return res.send({ user });
}

export async function setUserRole(
  req: Request<{}, {}, ChooseUserRoleInput["body"]>,
  res: Response
) {
  try {
    const userToUpdate = res.locals.user;
    const user = await chooseRole(userToUpdate._id, req.body.role);

    return res.send({ user: user });
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
}

//forgot password

export const forgotPasswordUserHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  try {
    console.log("handler forgot");
    const user = await findUser({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const updatedUser = await createNewToken(user._id);

    const tokenData: TokenData = {
      userId: updatedUser?._id,
      tokenId: updatedUser?.token,
    };

    const token = signJwt(tokenData, {
      expiresIn: config.get("accessTokenTtl"),
    });
    // const verificationLink = `http://yourwebsite.com/verify/${token}`;

    const url = new URL("http://localhost:3000/verify");
    url.searchParams.set("token", token);
    url.searchParams.set("password", "true");

    const resp = await sendEmail({
      to: user.email,
      from: "gitanshutalwartest@gmail.com",
      subject: "Verify your email",
      html: `<h1> <a href=${url}>Click here</a> to verify email and change password.</h1>`,
    });
    return res.status(201).json({
      message: "Verify Email to Continue...",
    });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(409).json({ message: error.message });
  }
};

//verify token
export const verifyForgotPasswordUserHandler = async (
  req: Request<{}, {}, {}, VerifyEmailForgotPasswordInput>,
  res: Response
) => {
  try {
    console.log("verifyhandler");
    if (!req.query.token) {
      return res.status(401).json({ message: "Invalid or expired request" });
    }
    console.log("one");

    //verify token
    const user = await verifyForgotUser(req.query.token);
    console.log("first", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Something went wrong try again" });
    }
    console.log("second", user);
    const session = await createSessionFromUser(user, req, res);
    console.log("second", session);

    // return res.status(200).send({ message: "User verified successfully" });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(409).json({ error: error.message });
  }
};

//change password

export const changePasswordUserHandler = async (
  req: Request<{}, {}, ChangePasswordInput>,
  res: Response
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired request" });
    }
    const updatedUser = await changePassword(user._id, req.body.password);

    //verify token

    return res.status(200).send({ message: "Password updated successfully" });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(409).json({ error: error.message });
  }
};

export const getRoleUserHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired request" });
    }
    const users = await getRoleUser();
    console.log("user", users);
    return res.status(200).send({ users: users });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(409).json({ error: error.message });
  }
};

export const changeRoleUserHandler = async (
  req: Request<{}, {}, ChooseRoleAdminInput>,
  res: Response
) => {

  try {
    const user = res.locals.user;
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired request" });
    }
    const users = await chooseRole(req.body.userId, req.body.role);
    console.log("user", users);
    return res.status(200).send({ user: users });
  } catch (error: any) {
    logger.error(error.message);
    return res.status(409).json({ error: error.message });
  }
};

export type TokenData = {
  userId: string; // Change this to the appropriate type for user IDs
  tokenId: string | undefined; // Change this to the appropriate type for token IDs
};
