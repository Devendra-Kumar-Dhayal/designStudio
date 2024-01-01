import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import validate from "../middleware/validateResource";

export enum UserRole {
  Viewer = "viewer",
  Designer = "designer",
}

export interface UserInput {
  email: string;
  name: string;
  password?: string;
  role?: UserRole;
  googleId?:string;
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
      unique: true,
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
  return !!(this.password || this.googleId);
}

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }
  if(!user.password){
    return next()
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user!.password as string ).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
