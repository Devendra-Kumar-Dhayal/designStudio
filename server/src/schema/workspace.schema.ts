import { object, string, number, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *   schema:
 *     Workspace:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - price
 *        - image
 *       properties:
 *         title:
 *           type: string
 *           default: "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
 *         description:
 *           type: string
 *           default: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
 *         price:
 *           type: number
 *           default: 879.99
 *         image:
 *           type: string
 *           default: "https://i.imgur.com/QlRphfQ.jpg"
 *     workspaceResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         workspaceId:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         __v:
 *           type: number
 *
 */

const payload = {
  body: object({
    elements: object({}).array().optional(),
    meta: object({}).optional(), // Added meta field
  }),
};

const params = {
  params: object({
    workspaceId: string({
      required_error: "workspaceId is required",
    }),
  }),
};

export const createWorkspaceSchema = object({
  body: object({
    projectId: string({
      required_error: "projectId is required",
    }),
    elements: object({}).array().optional(),
    meta: object({}).optional(), // Added meta field
  }),
});

export const updateWorkspaceSchema = object({
  ...payload,
  ...params,
});

export const deleteWorkspaceSchema = object({
  ...params,
});

export const getWorkspaceSchema = object({
  ...params,
});

export const searchWorkspaceSchema = object({
  query: object({
    workspace: string({
      required_error: "q is required",
    }),
  }),
});



const projectPayload = {
  body: object({
    workspaces: object({}).array().optional(),
    meta: object({}).optional(), // Added meta field
  }),
};

const projectParams = {
  params: object({
    projectId: string({
      required_error: "projectId is required",
    }),
  }),
};

export const createProjectSchema = object({
  body: object({
    workspaces: object({}).array().optional(),
    meta: object({}).optional(),
    name: string({
      required_error: "name is required",
    }), // Added meta field
  }),
});

export const updateProjectSchema = object({
  ...projectPayload,
  ...projectParams,
});

export const deleteProjectSchema = object({
  ...projectParams,
});

export const getProjectSchema = object({
  ...projectParams,
});

export type CreateWorkspaceInput = TypeOf<typeof createWorkspaceSchema>["body"];
export type UpdateWorkspaceInput = TypeOf<typeof updateWorkspaceSchema>;
export type ReadWorkspaceInput = TypeOf<typeof getWorkspaceSchema>;
export type DeleteWorkspaceInput = TypeOf<typeof deleteWorkspaceSchema>;

export type CreateProjectInput = TypeOf<typeof createProjectSchema>["body"];

export type UpdateProjectInput = TypeOf<typeof updateProjectSchema>;
export type DeleteProjectInput = TypeOf<typeof deleteProjectSchema>;
export type GetProjectInput = TypeOf<typeof getProjectSchema>;


//projectElement

const workspaceSchema = object({
  workspaceId: string(),
  meta: object({
    })
    .optional(),
});

const projectElementPayload = {
  body: object({
    workspaces: workspaceSchema.array().optional(),
    name: string({ required_error: "Name is required" }),
    projectId: string({ required_error: "projectId is required" }),
    type: string({ required_error: "type is required" }),
    color: string({ required_error: "type is required" }),

  }),
};
const projectElementQuery = {
  query: object({

    name: string({ required_error: "Name is required" }),
    projectId: string({ required_error: "projectId is required" }),
  }),
};


export const searchWorkspaceElementSchema = object({
  query: object({
    element: string({
      required_error: "element is required",
    }),
    projectId: string({
      required_error: "projectId is required",
    }),
  }),
});

export const createProjectElementSchema = object({
  ...projectElementPayload
})
export const updateProjectElementSchema = object({
  body: object({
    workspaces: workspaceSchema.array().optional(),
    name: string({ required_error: "Name is required" }),
    projectId: string({ required_error: "projectId is required" }),
   
  }),
});
export const getProjectElementSchema = object({
  ...projectElementQuery,
});

export const removeProjectElementSchema = object({
  query: object({
    workspace: string({ required_error: "Name is required" }),
    name: string({ required_error: "Name is required" }),
    projectId: string({ required_error: "projectId is required" }),
  }),
});

export type CreateProjectElementInput = TypeOf<typeof createProjectElementSchema>["body"];
export type GetProjectElementInput = TypeOf<typeof getProjectElementSchema>["query"];
export type UpdateProjectElementInput = TypeOf<typeof updateProjectElementSchema>["body"];
export type RemoveProjectElementInput = TypeOf<typeof removeProjectElementSchema>["query"];
export type SearchWorkspaceInput = TypeOf<typeof searchWorkspaceSchema>["query"];
export type SearchWorkspaceElementInput = TypeOf<
  typeof searchWorkspaceElementSchema
>["query"]
;