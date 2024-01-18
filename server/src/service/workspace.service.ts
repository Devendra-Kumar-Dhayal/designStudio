import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import WorkspaceModel, {
  WorkspaceDocument
} from "../models/workspace.model";

import ProjectModel from "../models/project.model";
import ProjectElementModel from "../models/projectElements.model";
import {
  CreateProjectElementInput,
  CreateProjectInput,
  CreateWorkspaceInput,
  GetProjectElementInput,
  RemoveProjectElementInput,
  UpdateProjectElementInput,
} from "../schema/workspace.schema";
import logger from "../utils/logger";
import { databaseResponseTimeHistogram } from "../utils/metrics";

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

export async function convertWorkspace(query: { workspaceId: string ,elements:any[]}) {
  //fetch all the elements from workspace
  const result = await WorkspaceModel.findOne({
    _id: query.workspaceId,
  });
  if(!result){
    throw new Error("Workspace Not Found!")
  }

  const elements = query.elements;

  //for each element in workspace find the project element
  //@ts-ignore
  elements.forEach(async (element) => {
    console.log(element);
    const projectElement = await ProjectElementModel.findOne({
      project: result?.project,
      name: element.options.meta.common.label,
    });

    if (!projectElement) {
      throw new Error("Project element not found");
    }
    if (element.type === "line") {
      // @ts-ignore
      const depending = element.options.depending.map((dep) => {
        const obj = {
          ...dep,
          //@ts-ignore
          name: elements[dep.element].options.meta.common.label,
        };
        return obj;
      });
      element = {
        ...element,
        options: {
          ...element.options,
          depending,
        },
      };
    }
    // Remove the specified workspaceId from the workspaces array
    //@ts-ignore
    const updatedWorkspaces = projectElement.workspaces.filter((workspace) => {
      //@ts-ignore

      return workspace.workspaceId.toString() !== query.workspaceId;
    });

    updatedWorkspaces.push({
      //@ts-ignore
      workspaceId: query.workspaceId,
      meta: element,
      isSubmitted: true,
    });

    // Update the project element with the modified workspaces
    const updated = await ProjectElementModel.findOneAndUpdate(
      {
        _id: projectElement._id,
      },
      {
        workspaces: updatedWorkspaces,
      }
    );

    return updated;
  });
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
export async function findProjectElements({
  projectId,
}: {
  projectId: string;
}) {
  try {
    const project = await ProjectElementModel.find({
      project: projectId,
    });
    //@ts-ignore
    const projectElements = [];

    project.forEach((element) => {
      console.log(element.workspaces);
      const arr = element.workspaces.filter(
        //@ts-ignore
        (workspace) => workspace.isSubmitted
      );
      if (arr.length > 0) {
        projectElements.push({
          _id: element._id,
          name: element.name,
          project: element.project,
          workspaces: arr,
        });
      }
      console.log(element);
      // console.log(arr)
    });
    //@ts-ignore
    // console.log("inside", project, projectElements);
    //@ts-ignore

    return projectElements;
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
      type: input.type,
      color: input.color,
    });
    return projectElement;
  } catch (error) {
    throw error;
  }
}

export async function createOrUpdateProjectElement(
  input: UpdateProjectElementInput
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
            meta: workspace.meta, //@ts-ignore
            isSubmitted: workspace.isSubmitted ?? false,
          }))
        : [];

      // Update the project element with the merged workspaces
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
    } else throw new Error("Project element not found");
  } catch (error) {
    throw error;
  }
}

export async function removeWorkspaceFromProjectElement({
  projectId,
  name,
  workspace,
}:RemoveProjectElementInput) {
  try {
    // Find the project element with the given name and projectId
    const workspaceIdToRemove = workspace
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
          workspace.workspaceId.toString() === workspaceIdToRemove
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
