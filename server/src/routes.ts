import { Express, Request, Response } from "express";
import {
  createWorkspaceHandler,
  getWorkspaceHandler,
  getAllWorkspacesHandler,
  deleteWorkspaceHandler,
  updateWorkspaceHandler,
  getAllWorkspacesRecentHandler,
  createProjectHandler,
  findProjectByIdHandler,
  findAllProjectsHandler,
  createProjectElementHandler,
  getProjectElementHandler,
  updateProjectElementHandler,
  submitWorkspaceHandler,
  findProjectElementsHandler,
} from "./controller/workspace.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
  googleOauthHandler,
} from "./controller/session.controller";
import {
  createUserHandler,
  getCurrentUser,
  setUserRole,
} from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import {
  createProjectElementSchema,
  createProjectSchema,
  createWorkspaceSchema,
  deleteWorkspaceSchema,
  getProjectElementSchema,
  getProjectSchema,
  getWorkspaceSchema,
  updateWorkspaceSchema,
} from "./schema/workspace.schema";
import { createSessionSchema } from "./schema/session.schema";
import { chooseRoleSchema, createUserSchema } from "./schema/user.schema";
import express from "express";
import deserializeUser from "./middleware/deserializeUser";
import requireDesigner from "./middleware/requireDesigner";

const router = express.Router();

/**
 * @openapi
 * '/api/users':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post(
  "/api/users",
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
/**
 * @openapi
 * '/api/sessions':
 *  get:
 *    tags:
 *    - Session
 *    summary: Get all sessions
 *    responses:
 *      200:
 *        description: Get all sessions for current user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetSessionResponse'
 *      403:
 *        description: Forbidden
 *  post:
 *    tags:
 *    - Session
 *    summary: Create a session
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateSessionInput'
 *    responses:
 *      200:
 *        description: Session created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateSessionResponse'
 *      401:
 *        description: Unauthorized
 *  delete:
 *    tags:
 *    - Session
 *    summary: Delete a session
 *    responses:
 *      200:
 *        description: Session deleted
 *      403:
 *        description: Forbidden
 */
router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createUserSessionHandler
);

router.get("/api/sessions", requireUser, getUserSessionsHandler);

router.delete("/api/sessions", requireUser, deleteSessionHandler);

router.get("/api/sessions/oauth/google", googleOauthHandler);
router.get("/oauth/error", (req, res) => {
  // Handle OAuth error here
  const error = req.query.error;
  console.log("error", error);
  // Process error or redirect as needed
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

// PUT /api/workspaces/{workspaceId} - Update a single workspace by its ID
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



router.get("/api/project/:projectId", [
  requireUser,
  validateResource(getProjectSchema)],
  findProjectByIdHandler
);
router.post("/api/project/", [
  requireDesigner,
  validateResource(createProjectSchema),
],
createProjectHandler);


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
  [requireUser, validateResource(createProjectElementSchema)],
  updateProjectElementHandler
);

router.get(
  "/api/projectelement",
  [requireUser, validateResource(getProjectElementSchema)],
  getProjectElementHandler
);

export default router;
