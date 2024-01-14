import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import WorkspaceModel, {
  WorkspaceDocument,
  WorkspaceInput,
} from "../models/workspace.model"; // Changed import from ProductModel to WorkspaceModel

import { databaseResponseTimeHistogram } from "../utils/metrics";
import {
  CreateProjectInput,
  CreateWorkspaceInput,
} from "../schema/workspace.schema";
import ProjectModel from "../models/project.model";
import logger from "../utils/logger";

export async function createWorkspace(input: CreateWorkspaceInput) {
  const { meta, projectId } = input;

  try {
    logger.info("one");

    const createdWorkspace = await WorkspaceModel.create({
      elements: [],
      meta,
      project: projectId,
    });

    logger.info("two");
    await ProjectModel.updateOne(
      { _id: projectId },
      { $push: { workspaces: createdWorkspace._id } }
    );
    return createdWorkspace;
  } catch (e) {
    throw e;
  }
}

export async function findWorkspace(
  query: { workspaceId: string },
  options: QueryOptions = { lean: true }
) {
  const metricsLabels = {
    operation: "findWorkspace",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await WorkspaceModel.findOne(
      {
        _id: query.workspaceId,
      },
      {},
      options
    ); // Changed ProductModel to WorkspaceModel
    timer({ ...metricsLabels, success: "true" });
    console.log("result", result);
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

// export async function createNewProject()

export async function findAllProjects() {
  try {
    const projects = await ProjectModel.find({});
    return projects;
  } catch (error) {
    throw error;
  }
}

export async function findproject({ projectId }: { projectId: string }) {
  try {
    const project = await ProjectModel.findOne({ _id: projectId }).populate({
      path: "workspaces",
      select: "_id meta",
    });
    return project;
  } catch (error) {
    throw error;
  }
}

export async function createProject(input: CreateProjectInput) {
  try {
    const project = await ProjectModel.create(input);
    return project;
  } catch (error) {
    throw error;
  }
}
