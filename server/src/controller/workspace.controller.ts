import { Request, Response } from "express";
import {
  CreateProjectElementInput,
  CreateProjectInput,
  CreateWorkspaceInput,
  GetProjectElementInput,
  GetProjectInput,
  RemoveProjectElementInput,
  SearchWorkspaceElementInput,
  SearchWorkspaceInput,
  UpdateProjectElementInput,
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
  findAllProjects,
  findProjectElement,
  createProjectElement,
  createOrUpdateProjectElement,
  convertWorkspace,
  findProjectElements,
  removeWorkspaceFromProjectElement,
  searchWorkspace,
  searchWorkspaceElement, // New service function for fetching all workspaces
} from "../service/workspace.service"; // Adjusted service functions for workspace

export async function createWorkspaceHandler(
  req: Request<{}, {}, CreateWorkspaceInput, {}>,
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

  if (!workspace) {
    return res.sendStatus(404);
  }

  const updatedWorkspace = await findAndUpdateWorkspace(
    { workspaceId },
    update,
    {
      new: true,
    }
  );

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
export async function submitWorkspaceHandler(
  req: Request<
    UpdateWorkspaceInput["params"],
    {},
    UpdateWorkspaceInput["body"]
  >,
  res: Response
) {
  const workspaceId = req.params.workspaceId;
  const workspace = await findWorkspace({ workspaceId });

  if (!workspace) {
    return res.sendStatus(404);
  }
  const elements = req.body.elements ?? [];
  await convertWorkspace({ workspaceId, elements });

  return res.status(200).send(workspace);
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
  const workspaces = await findAllWorkspaces({ limit: 25 }); // Implement logic to fetch all workspaces

  return res.send(workspaces);
}

export async function findAllProjectsHandler(req: Request, res: Response) {
  const projects = await findAllProjects(); // Implement logic to fetch all workspaces

  return res.send({ projects });
}

export async function findProjectByIdHandler(
  req: Request<GetProjectInput["params"], {}, {}>,
  res: Response
) {
  const projectId = req.params.projectId;
  const project = await findproject({ projectId });

  if (!project) {
    return res.sendStatus(404);
  }

  return res.send(project);
}
export async function findProjectElementsHandler(
  req: Request<GetProjectInput["params"], {}, {}>,
  res: Response
) {
  const projectId = req.params.projectId;
  const project = await findProjectElements({ projectId });

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

export async function createProjectElementHandler(
  req: Request<{}, {}, CreateProjectElementInput, {}>,
  res: Response
) {
  try {
    console.log("inside service1");

    const input = req.body;
    const existing = await findProjectElement({
      projectId: input!.projectId ?? "",
      name: input!.name ?? "",
    });

    if (existing) {
      throw new Error("Name already exists");
    }

    const project = await createProjectElement(req.body);

    return res.status(201).send(project);
  } catch (error: any) {
    console.log(error, error.message);
    return res.status(404).send(error.message);
  }
}
export async function updateProjectElementHandler(
  req: Request<{}, {}, UpdateProjectElementInput, {}>,
  res: Response
) {
  try {
    const input = req.body;
    const existing = await createOrUpdateProjectElement(input);

    return res.status(200).send(existing);
  } catch (error: any) {
    console.log(error, error.message);
    return res.status(404).send(error.message);
  }
}
export async function removeProjectElementHandler(
  req: Request<{}, {}, {}, RemoveProjectElementInput>,
  res: Response
) {
  try {
    const input = req.query;
    const existing = await removeWorkspaceFromProjectElement(input);

    return res.status(200).send(existing);
  } catch (error: any) {
    console.log(error, error.message);
    return res.status(404).send(error.message);
  }
}

export async function getProjectElementHandler(
  req: Request<{}, {}, {}, GetProjectElementInput>,
  res: Response
) {
  // const projectId = req.params.projectId;
  try {
    const project = await findProjectElement(req.query);

    if (!project) {
      return res.sendStatus(200);
    }

    return res.status(200).send(project);
  } catch (error) {
    return res.status(404);
  }
}


export async function WorkspaceSearchHandler(
  req: Request<{}, {}, {}, SearchWorkspaceInput>,
  res: Response
) {
  // const projectId = req.params.projectId;
  try {
    const project = await searchWorkspace(req.query);

    if (!project) {
      return res.sendStatus(200);
    }

    return res.status(200).send(project);
  } catch (error) {
    return res.status(404);
  }
}
export async function WorkspaceElementSearchHandler(
  req: Request<{}, {}, {}, SearchWorkspaceElementInput>,
  res: Response
) {
  // const projectId = req.params.projectId;
  try {
    const project = await searchWorkspaceElement(req.query);

    if (!project) {
      return res.sendStatus(200);
    }

    return res.status(200).send(project);
  } catch (error) {
    return res.status(404);
  }
}