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
  ...payload,
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

export type CreateWorkspaceInput = TypeOf<typeof createWorkspaceSchema>[
  "body"
];
export type UpdateWorkspaceInput = TypeOf<typeof updateWorkspaceSchema>;
export type ReadWorkspaceInput = TypeOf<typeof getWorkspaceSchema>;
export type DeleteWorkspaceInput = TypeOf<typeof deleteWorkspaceSchema>;
