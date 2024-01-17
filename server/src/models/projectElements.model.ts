import mongoose from "mongoose";
import { WorkspaceDocument } from "./workspace.model";

export interface ProjectElementInput {
  name: string;
  project: string;
  // type: string; // Added meta field
  workspaces: {
    workspace: WorkspaceDocument["_id"];
    meta: object;
  }[];
  type: string; // Added meta field
}

export interface ProjectElementDocument
  extends ProjectElementInput,
    mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const workspaceElementSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace", // Assuming you have a Workspace model
    required: true,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}, // Default to an empty object
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

const projectElements = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project: { type: mongoose.Schema.ObjectId, required: true, ref: "Project" },
    type: { type: String, required: true }, // Added meta field
    workspaces: [workspaceElementSchema],
    color: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

projectElements.index({ name: 1, project: 1 }, { unique: true });

const ProjectElementModel = mongoose.model<ProjectElementDocument>(
  "ProjectElement",
  projectElements
);

export default ProjectElementModel;
