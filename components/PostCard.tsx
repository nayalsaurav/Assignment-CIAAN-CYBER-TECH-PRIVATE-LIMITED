"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { IPost } from "@/lib/models/Post";

interface PostCardProps {
  post: IPost;
  onEdit?: (post: IPost) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const isAuthor = session?.user?.id === post.authorId.toString();

  const formatTimeAgo = (date: Date) => {
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {post.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${post.authorId}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {post.authorName}
              </Link>
              <p className="text-sm text-gray-500">
                {formatTimeAgo(new Date(post.createdAt))}
              </p>
            </div>
          </div>
          {isAuthor && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(post)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(post._id!.toString())}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
          <p className="text-gray-700 leading-relaxed">{post.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
