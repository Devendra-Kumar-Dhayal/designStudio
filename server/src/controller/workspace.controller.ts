import { Request, Response } from "express";
import {
  CreateProjectInput,
  CreateWorkspaceInput,
  GetProjectInput,
  UpdateWorkspaceInput,
} from "../schema/workspace.schema";
import {
  createWorkspace,
  deleteWorkspace,
  findAndUpdateWorkspace,
  findWorkspace,
  findAllWorkspaces,
  findproject,
  createProject,
  findAllProjects, // New service function for fetching all workspaces
} from "../service/workspace.service"; // Adjusted service functions for workspace

export async function createWorkspaceHandler(
  req: Request<{},{}, CreateWorkspaceInput, {}>,
  res: Response
) {
  const userId = res.locals.user._id;

  const workspace = await createWorkspace(req.body);

  return res.send(workspace);
}

export async function updateWorkspaceHandler(
  req: Request<UpdateWorkspaceInput["params"], UpdateWorkspaceInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  
  const workspaceId = req.params.workspaceId;
  const update = req.body;
  
  const workspace = await findWorkspace({ workspaceId });
  console.log("inside handler",workspace)

  if (!workspace) {
    return res.sendStatus(404);
  }

  console.log("inside handler three");


  const updatedWorkspace = await findAndUpdateWorkspace(
    { workspaceId },
    update,
    {
      new: true,
    }
  );
  console.log("inside handler 4",updatedWorkspace);


  return res.send(updatedWorkspace);
}

export async function getWorkspaceHandler(
  req: Request<UpdateWorkspaceInput["params"]>,
  res: Response
) {
  const workspaceId = req.params.workspaceId;
  const workspace = await findWorkspace({ workspaceId });

  if (!workspace) {
    return res.sendStatus(404);
  }

  return res.send(workspace);
}

export async function deleteWorkspaceHandler(
  req: Request<UpdateWorkspaceInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const workspaceId = req.params.workspaceId;

  const workspace = await findWorkspace({ workspaceId });

  if (!workspace) {
    return res.sendStatus(404);
  }

  await deleteWorkspace({ workspaceId });

  return res.sendStatus(200);
}

export async function getAllWorkspacesHandler(req: Request, res: Response) {
  const workspaces = await findAllWorkspaces({}); // Implement logic to fetch all workspaces

  return res.send(workspaces);
}
export async function getAllWorkspacesRecentHandler(
  req: Request,
  res: Response
) {
  console.log("getRecents");
  const workspaces = await findAllWorkspaces({ limit: 25 }); // Implement logic to fetch all workspaces

  return res.send( workspaces);
}


export async function findAllProjectsHandler(req: Request, res: Response) {
  const projects = await findAllProjects(); // Implement logic to fetch all workspaces

  return res.send({projects});
}

export async function findProjectByIdHandler(
  req: Request<GetProjectInput['params'],{},{}>,
  res: Response
) {
  const projectId = req.params.projectId;
  const project = await findproject({ projectId });

  if (!project) {
    return res.sendStatus(404);
  }

  return res.send(project);
}


export async function createProjectHandler(
  req: Request<{}, {}, CreateProjectInput, {}>,
  res: Response
) {
  const userId = res.locals.user._id;
  

  const project = await createProject(req.body);

  return res.status(201).send(project);

}