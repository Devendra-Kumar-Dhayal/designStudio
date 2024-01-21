import { object, string, TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: string({
      required_error: "passwordConfirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});
export const chooseRoleSchema = object({
  body: object({
    
    role: string({
      required_error: "Role is required",
    }).refine((value) => value === "viewer" || value === "designer", {
      message: "Invalid role",
      path: ["role"],
    }),
  }),
});


export const chooseRoleAdminSchema = object({
  body: object({
    userId:string({
      required_error: "User Id is required",
    }),
    role: string({
      required_error: "Role is required",
    }).refine((value) => value === "viewer" || value === "designer", {
      message: "Invalid role",
      path: ["role"],
    }),
  }),
});



export const forgotPassword = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

export const verifyEmailForgotPassword = object({
  query: object({
    token: string({
      required_error: "Token is required",
    }),
  }),
});

export const changePassword = object({
  body: object({
    password: string({
      required_error: "New Password is required",
    }),
    passwordConfirmation: string({
      required_error: "Confirm Password is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
export type ChooseUserRoleInput = TypeOf<typeof chooseRoleSchema>;
export type ForgotPasswordInput = TypeOf<typeof forgotPassword>["body"];
export type VerifyEmailForgotPasswordInput = TypeOf<
  typeof verifyEmailForgotPassword
>["query"];
export type ChangePasswordInput = TypeOf<typeof changePassword>["body"];
export type ChooseRoleAdminInput = TypeOf<typeof chooseRoleAdminSchema>["body"];
