import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  console.log("res locals",)

  if (user===undefined||user===null) {
    console.log("forb",user)
    return res.sendStatus(403);
  }

  return next();
};

export default requireUser;
