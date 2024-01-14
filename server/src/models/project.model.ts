import mongoose from "mongoose";
import { WorkspaceDocument } from "./workspace.model";

export interface ProjectInput {
  workspaces: [WorkspaceDocument["_id"]];
  meta: object; // Added meta field
}

export interface ProjectDocument extends ProjectInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}



const projectSchema = new mongoose.Schema(
  {
    workspaces: { type: [mongoose.Schema.Types.ObjectId], ref: "Workspace" },
    meta: { type: Object },
    name:{type:String,required:true} // Added meta field
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);

export default ProjectModel;