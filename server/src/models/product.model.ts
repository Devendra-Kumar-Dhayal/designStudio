import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface ProductInput {
  user: UserDocument["_id"];
  elements : object;
  
}

export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    elements: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;
