import { Request, Response, NextFunction } from "express";
import { findUser } from "../service/user.service";

const requireDesigner = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if(!user) return res.sendStatus(403)

  const userDatabase = await findUser({ _id: user._doc._id });
  

  if ( !userDatabase|| userDatabase.role !== "designer") {
    console.log("forb design",userDatabase)
    return res.sendStatus(403);
  }

  return next();
};

export default requireDesigner;
