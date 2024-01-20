import express from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
  googleOauthHandler,
} from "./controller/session.controller";
import {
  changePasswordUserHandler,
  createUserHandler,
  forgotPasswordUserHandler,
  getCurrentUser,
  setUserRole,
  verifyForgotPasswordUserHandler,
} from "./controller/user.controller";
import {
  createProjectElementHandler,
  createProjectHandler,
  createWorkspaceHandler,
  deleteWorkspaceHandler,
  findAllProjectsHandler,
  findProjectByIdHandler,
  findProjectElementsHandler,
  getAllWorkspacesHandler,
  getAllWorkspacesRecentHandler,
  getProjectElementHandler,
  getWorkspaceHandler,
  removeProjectElementHandler,
  submitWorkspaceHandler,
  updateProjectElementHandler,
  updateWorkspaceHandler,
} from "./controller/workspace.controller";
import requireDesigner from "./middleware/requireDesigner";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import {
  changePassword,
  chooseRoleSchema,
  createUserSchema,
  forgotPassword,
  verifyEmailForgotPassword,
} from "./schema/user.schema";
import {
  createProjectElementSchema,
  createProjectSchema,
  deleteWorkspaceSchema,
  getProjectElementSchema,
  getProjectSchema,
  getWorkspaceSchema,
  removeProjectElementSchema,
  updateProjectElementSchema,
  updateWorkspaceSchema,
} from "./schema/workspace.schema";

const router = express.Router();

//user

router.get("/api/healthcheck", (req, res) => res.sendStatus(200));
router.post(
  "/api/register",
  validateResource(createUserSchema),
  createUserHandler
);

router.get("/api/auth/user/me", requireUser, getCurrentUser);
router.put(
  "/api/auth/user/role",
  validateResource(chooseRoleSchema),
  requireUser,
  setUserRole
);

router.post(
  "/api/login",
  validateResource(createSessionSchema),
  createUserSessionHandler
);

router.get(
  "/api/forgot-password",
  validateResource(forgotPassword),
  forgotPasswordUserHandler
);
router.get(
  "/api/verify",
  validateResource(verifyEmailForgotPassword),
  verifyForgotPasswordUserHandler
);
router.get(
  "/api/change-password",
  [requireUser, validateResource(changePassword)],
  changePasswordUserHandler
);

router.delete("/api/sessions", requireUser, deleteSessionHandler);

router.get("/api/sessions/oauth/google", googleOauthHandler);
router.get("/oauth/error", (req, res) => {
  // Handle OAuth error here
  const error = req.query.error;
  console.log("error", error);
  res.status(500).send(`OAuth Error: ${error}`);
});

// POST /api/workspaces - Create a new workspace
router.post("/api/workspaces", [requireDesigner], createWorkspaceHandler);

// GET /api/workspaces/{workspaceId} - Get a single workspace by its ID
router.get(
  "/api/workspaces/:workspaceId",
  validateResource(getWorkspaceSchema),
  getWorkspaceHandler
);

router.put(
  "/api/workspaces/:workspaceId",
  [requireDesigner, validateResource(updateWorkspaceSchema)],
  updateWorkspaceHandler
);

// DELETE /api/workspaces/{workspaceId} - Delete a single workspace by its ID
router.delete(
  "/api/workspaces/:workspaceId",
  [requireDesigner, validateResource(deleteWorkspaceSchema)],
  deleteWorkspaceHandler
);

router.put(
  "/api/workspaces/submit/:workspaceId",
  [requireDesigner, validateResource(deleteWorkspaceSchema)],
  submitWorkspaceHandler
);
// GET /api/workspaces - Get all workspaces
router.get(
  "/api/workspacesrecent",
  requireUser,
  getAllWorkspacesRecentHandler // Implement getAllWorkspacesHandler to fetch all workspaces
);
router.get(
  "/api/workspaces",
  requireUser,
  getAllWorkspacesHandler // Implement getAllWorkspacesHandler to fetch all workspaces
);

router.get(
  "/api/project/:projectId",
  [requireUser, validateResource(getProjectSchema)],
  findProjectByIdHandler
);
router.post(
  "/api/project/",
  [requireDesigner, validateResource(createProjectSchema)],
  createProjectHandler
);

router.get("/api/project", [requireUser], findAllProjectsHandler);

router.get(
  "/api/projectsubmit/:projectId",
  [requireUser, validateResource(getProjectSchema)],
  findProjectElementsHandler
);

router.post(
  "/api/projectelement",
  [requireUser, validateResource(createProjectElementSchema)],
  createProjectElementHandler
);
router.put(
  "/api/projectelement",
  [requireUser, validateResource(updateProjectElementSchema)],
  updateProjectElementHandler
);

router.delete(
  "/api/projectelement",
  [requireUser, validateResource(removeProjectElementSchema)],
  removeProjectElementHandler
);

router.get(
  "/api/projectelement",
  [requireUser, validateResource(getProjectElementSchema)],
  getProjectElementHandler
);

export default router;
