import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createPost, getAllPosts } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }
    const authorId = new Types.ObjectId(session.user.id);

    const post = await createPost({
      title,
      description,
      authorId: new Types.ObjectId(session.user.id),
      authorName: session.user.name || "Unknown",
      authorEmail: session.user.email || "",
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
