import { Schema, model, models, Types } from "mongoose";

export interface IPost {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  authorId: Types.ObjectId;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export const Post = models.Post || model<IPost>("Post", PostSchema);
