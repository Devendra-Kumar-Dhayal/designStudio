import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface WorkspaceInput {
  // user: UserDocument["_id"];
  elements: object;
}

export interface WorkspaceDocument extends WorkspaceInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      unique: true,
      default: () => `workspace_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    elements: { type: [Object], required: true },
  },
  {
    timestamps: true,
  }
);

const WorkspaceModel = mongoose.model<WorkspaceDocument>(
  "Workspace",
  workspaceSchema
);

export default WorkspaceModel;
