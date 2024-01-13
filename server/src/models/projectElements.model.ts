import mongoose from "mongoose";
import { WorkspaceDocument } from "./workspace.model";




export interface ProjectElementInput {
  name: string;
  project: string;
  workspaces: {
    workspace: WorkspaceDocument["_id"];
    meta: object;
  }[];
  type: string; // Added meta field
}


export interface ProjectElementDocument extends ProjectElementInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const projectElements = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project: { type: mongoose.Schema.ObjectId, required: true },
    type:{ type: String, required: true }, // Added meta field
    workspaces: [
      {
        workspace: { type: [mongoose.Schema.Types.ObjectId], ref: "Workspace" },
        meta: { type: Object },
      },
    ],
  },
  {
    timestamps: true,
  }
);

projectElements.index({ name: 1, project: 1 }, { unique: true });


const ProjectElementModel = mongoose.model<ProjectElementDocument>("ProjectElement", projectElements);

export default ProjectElementModel;