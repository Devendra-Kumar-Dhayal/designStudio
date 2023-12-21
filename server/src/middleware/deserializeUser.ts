import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("deserial",req.headers.cookie)
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");


  console.log(accessToken)
  if (!accessToken) {
    return next();
  }

  
  const { decoded, expired } = verifyJwt(accessToken);
  
  console.log("decoded",decoded)
  if (decoded) {
    console.log("inside decoded")
    res.locals.user = decoded;
    console.log("locals",res.locals)
    return next();
  }
  console.log("somehting")

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }

    const result = verifyJwt(newAccessToken as string);

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
