import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import WorkspaceModel, {
  WorkspaceDocument,
  WorkspaceInput,
} from "../models/workspace.model"; // Changed import from ProductModel to WorkspaceModel

import { databaseResponseTimeHistogram } from "../utils/metrics";
import { CreateWorkspaceInput } from "../schema/workspace.schema";

export async function createWorkspace(input:CreateWorkspaceInput) {
  const metricsLabels = {
    operation: "createWorkspace",
  };
  const {meta } = input;

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await WorkspaceModel.create({ elements: [] ,meta});
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findWorkspace(
  query: { workspaceId :string},
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findWorkspace",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await WorkspaceModel.findOne({
      _id: query.workspaceId,
    }, {}, options); // Changed ProductModel to WorkspaceModel
    timer({ ...metricsLabels, success: "true" });
    console.log("result",result)
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export async function findAndUpdateWorkspace(
  query: { workspaceId: string },
  update: UpdateQuery<WorkspaceDocument>,
  options: QueryOptions
) {
  return WorkspaceModel.findOneAndUpdate(
    {
      _id: query.workspaceId,
    },
    update,
    options
  ); // Changed ProductModel to WorkspaceModel
}

export async function deleteWorkspace(query: FilterQuery<WorkspaceDocument>) {
  return WorkspaceModel.deleteOne(query); // Changed ProductModel to WorkspaceModel
}

export async function findAllWorkspaces({ limit }: { limit?: number }) {
  const metricsLabels = {
    operation: "findAllWorkspaces",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    let workspaces;
    if (limit) workspaces = await WorkspaceModel.find({}).limit(limit);
    else workspaces = await WorkspaceModel.find({});
    timer({ ...metricsLabels, success: "true" });
    return workspaces;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}
