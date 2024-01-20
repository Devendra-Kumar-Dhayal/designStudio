import { Request, Response } from "express";
import { omit } from "lodash";
import {
  ChooseUserRoleInput,
  CreateUserInput,
  chooseRoleSchema,
} from "../schema/user.schema";
import { chooseRole, createUser, findUser } from "../service/user.service";
import logger from "../utils/logger";
import { use } from "passport";
import { createSessionFromUser } from "./session.controller";
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
