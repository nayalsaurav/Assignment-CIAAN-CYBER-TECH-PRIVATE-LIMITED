import { User, IUser } from "./models/User";
import { Post, IPost } from "./models/Post";
import { connectToDatabase } from "./database";

// User operations

export async function createUser(
  userData: Omit<IUser, "_id" | "createdAt" | "updatedAt">
): Promise<IUser> {
  await connectToDatabase();
  const user = new User(userData);
  await user.save();
  return user.toObject();
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectToDatabase();
  return await User.findOne({ email }).exec();
}

export async function getUserById(
  id: string
): Promise<Omit<IUser, "password"> | null> {
  await connectToDatabase();
  const user = await User.findById(id).select("-password").exec();
  return user ? user.toObject() : null;
}

export async function updateUser(
  id: string,
  userData: Partial<Pick<IUser, "name" | "bio">>
): Promise<boolean> {
  await connectToDatabase();
  const result = await User.updateOne(
    { _id: id },
    {
      $set: {
        ...userData,
        updatedAt: new Date(),
      },
    }
  );
  return result.modifiedCount > 0;
}

// Post operations

export async function createPost(
  postData: Omit<IPost, "_id" | "createdAt" | "updatedAt">
): Promise<IPost> {
  await connectToDatabase();
  const post = new Post(postData);
  await post.save();
  return post.toObject();
}

export async function getAllPosts(): Promise<IPost[]> {
  await connectToDatabase();
  return await Post.find().sort({ createdAt: -1 }).exec();
}

export async function getPostsByUserId(userId: string): Promise<IPost[]> {
  await connectToDatabase();
  return await Post.find({ authorId: userId }).sort({ createdAt: -1 }).exec();
}

export async function updatePost(
  postId: string,
  userId: string,
  postData: Partial<Pick<IPost, "title" | "description">>
): Promise<boolean> {
  await connectToDatabase();
  const result = await Post.updateOne(
    { _id: postId, authorId: userId },
    {
      $set: {
        ...postData,
        updatedAt: new Date(),
      },
    }
  );
  return result.modifiedCount > 0;
}

export async function deletePost(
  postId: string,
  userId: string
): Promise<boolean> {
  await connectToDatabase();
  const result = await Post.deleteOne({
    _id: postId,
    authorId: userId,
  });
  return result.deletedCount > 0;
}
