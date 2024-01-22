import { Request, Response, NextFunction } from "express";
import { findUser } from "../service/user.service";

const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if(!user) return res.sendStatus(403)

  const userDatabase = await findUser({ _id: user._id });
  

  if ( !userDatabase|| userDatabase.role !== "admin") {
    console.log("forb design",userDatabase)
    return res.sendStatus(403);
  }

  return next();
};

export default requireAdmin;
