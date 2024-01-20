import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import validate from "../middleware/validateResource";
import { log } from "console";
import logger from "../utils/logger";
import argon2 from "argon2";
import { randomBytes, pbkdf2Sync } from "crypto";

export enum UserRole {
  Viewer = "viewer",
  Designer = "designer",
}

export interface UserInput {
  email: string;
  name: string;
  password?: string;
  role?: UserRole;
  googleId?: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: {
      type: String,
      required: false,
      validate: passwordOrGoogleIdValidator,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
    },
    googleId: {
      type: String,
      required: false,
      unique: false,
      validate: passwordOrGoogleIdValidator,
    },
  },
  {
    timestamps: true,
  }
);
function passwordOrGoogleIdValidator(this: any) {
  // Ensure at least one of password or googleId exists

  console.log("mongoose.this", this);
  const bool = !!(this.password !== undefined || this.googleId !== undefined);
  console.log(bool);
  return bool;
}

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;
  console.log("user", user);

  if (!user.isModified("password")) {
    return next();
  }
  console.log("first");
  if (!user.password) {
    return next();
  }
  console.log("second");

  try {
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(user.password, salt, 10000, 64, "sha512").toString(
      "hex"
    );
    console.log("Hashed password", hash);
    user.password = `${salt}$${hash}`;
    next();
  } catch (error: any) {
    console.error("Error during hashing:", error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  const password = user.password as string;
  const [salt, hashedPassword] = password.split("$");

  const candidateHash = pbkdf2Sync(
    candidatePassword,
    salt,
    10000,
    64,
    "sha512"
  ).toString("hex");

  return candidateHash === hashedPassword;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
