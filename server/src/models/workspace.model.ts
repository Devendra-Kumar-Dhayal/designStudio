import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface WorkspaceInput {
  // user: UserDocument["_id"];
  project: string;
  elements: object;
  meta: object; // Added meta field
}

export interface WorkspaceDocument extends WorkspaceInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new mongoose.Schema(
  {
    elements: { type: [Object], required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    meta: { type: Object }, // Added meta field
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
