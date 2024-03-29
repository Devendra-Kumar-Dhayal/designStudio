import config from "config";
import { CookieOptions, Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import {
  findUserOrCreate,
  getGoogleOAuthTokens,
  getGoogleUser,
  validatePassword,
} from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { UserDocument } from "../models/user.model";
import { CreateSessionInput } from "../schema/session.schema";

export const accessTokenCookieOptions: CookieOptions = {
  maxAge: 86400000, // 1 day
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};

export async function createSessionFromUser(
  user: UserDocument,
  req: Request,
  res: Response
) {
  const session = await createSession(user._id, req.get("user-agent") || "");

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
  );
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
  // return access & refresh tokens

  return res.send({ accessToken, refreshToken });
}

export async function createUserSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create an access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
  );
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
  // return access & refresh tokens

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

export async function googleOauthHandler(req: Request, res: Response) {
  // get the code from qs
  console.log("handler");
  const code = req.query.code as string;

  try {
    // get the id and access token with the code
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });

    // get user with tokens
    const googleUser = await getGoogleUser({ id_token, access_token });
    //jwt.decode(id_token);

    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }

    console.log("here");

    // upsert the user
    const user = await findUserOrCreate(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
      },
      {
        upsert: true,
        new: true,
        returnOriginal: false,
      }
    );

    console.log("user", user);
    if (!user) return res.status(401).send("User not found");

    // create a session
    // create a session
    const session = await createSession(user!._id, req.get("user-agent") || "");

    console.log(user, session);

    // create an access token

    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
    );

    // create a refresh token
    const refreshToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get("refreshTokenTtl") } // 1 year
    );

    // set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // redirect back to client
    res.redirect(config.get("origin"));
  } catch (error) {
    console.log(error);
    logger.error(error, "Failed to authorize Google userf");
    return res.redirect(`${config.get("origin")}/oauth/error`);
  }
}
