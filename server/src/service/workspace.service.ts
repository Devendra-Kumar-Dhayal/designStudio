import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import WorkspaceModel, {
  WorkspaceDocument,
  WorkspaceInput,
} from "../models/workspace.model";

import { databaseResponseTimeHistogram } from "../utils/metrics";
import {
  CreateProjectElementInput,
  CreateProjectInput,
  CreateWorkspaceInput,
  GetProjectElementInput,
} from "../schema/workspace.schema";
import ProjectModel from "../models/project.model";
import logger from "../utils/logger";
import ProjectElementModel from "../models/projectElements.model";
import { arrayBuffer } from "stream/consumers";
import e from "express";

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

export async function createProjectElement(input: CreateProjectElementInput) {
  try {
    const arr = input.workspaces
      ? input.workspaces.map((workspace) => ({
          workspaceId: workspace.workspaceId,
          meta: workspace.meta,
        }))
      : [];
    console.log("inside service", input.workspaces, arr);

    const projectElement = await ProjectElementModel.create({
      name: input.name,
      project: input.projectId,
      workspaces: arr,
    });
    return projectElement;
  } catch (error) {
    throw error;
  }
}

export async function createOrUpdateProjectElement(
  input: CreateProjectElementInput
) {
  try {
    // Check if a project element with the given name and projectId already exists
    const existingProjectElement = await ProjectElementModel.findOne({
      name: input.name,
      project: input.projectId,
    });

    // If it exists, update the workspaces
    if (existingProjectElement) {
      const updatedWorkspaces = input.workspaces
        ? input.workspaces.map((workspace) => ({
            workspaceId: workspace.workspaceId,
            meta: workspace.meta,
          }))
        : [];

      // Merge the existing workspaces with the updated workspaces, keeping only unique ones based on workspaceId
      const mergedWorkspaces = [
        ...existingProjectElement.workspaces,
        ...updatedWorkspaces,
      ].reduce((acc, workspace) => {
        // Explicit type check to handle union types
        if ("workspaceId" in workspace) {
          const existingWorkspaceIndex = acc.findIndex(
            (w) => w.workspaceId === workspace.workspaceId
          );

          if (existingWorkspaceIndex === -1) {
            acc.push(workspace);
          } else {
            acc[existingWorkspaceIndex] = workspace;
          }
        }

        return acc;
      }, [] as { workspaceId: string; meta: any }[]);

      // Update the project element with the merged workspaces
      const updated = await ProjectElementModel.findOneAndUpdate(
        {
          _id: existingProjectElement._id,
        },
        {
          workspaces: mergedWorkspaces,
        },
        { new: true } // Return the updated document
      );

      return updated;
    }
  } catch (error) {
    throw error;
  }
}



export async function removeWorkspaceFromProjectElement(
  projectId: string,
  name: string,
  workspaceIdToRemove: string
) {
  try {
    // Find the project element with the given name and projectId
    const existingProjectElement = await ProjectElementModel.findOne({
      name,
      project: projectId,
    });

    if (!existingProjectElement) {
      throw new Error("Project element not found");
    }

    // Remove the specified workspaceId from the workspaces array
    const updatedWorkspaces = existingProjectElement.workspaces
      .map((workspace) => {
        if (
          //@ts-ignore
          workspace.workspaceId === workspaceIdToRemove
        ) {
          // Exclude the workspace with the specified workspaceId
          return undefined;
        }
        return workspace;
      })
      .filter(Boolean); // Remove undefined entries

    // Update the project element with the modified workspaces
    const updated = await ProjectElementModel.findOneAndUpdate(
      {
        _id: existingProjectElement._id,
      },
      {
        workspaces: updatedWorkspaces,
      },
      { new: true } // Return the updated document
    );

    return updated;
  } catch (error) {
    throw error;
  }
}





export async function findProjectElement(input: GetProjectElementInput) {
  const projectElement = await ProjectElementModel.findOne({
    project: input.projectId,
    name: input.name,
  });
  return projectElement;
}
