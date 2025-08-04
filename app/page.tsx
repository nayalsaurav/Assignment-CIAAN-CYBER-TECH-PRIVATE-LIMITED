"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PostCard from "@/components/PostCard";
import CreatePostDialog from "@/components/CreatePostDialog";
import EditPostDialog from "@/components/EditPostDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IPost } from "@/lib/models/Post";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingPost, setEditingPost] = useState<IPost | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { data: session } = useSession();
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEditPost = (post: IPost) => {
    setEditingPost(post);
    setEditDialogOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post deleted successfully!");
        setPosts(posts.filter((post) => post._id!.toString() !== postId));
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {session && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <CreatePostDialog>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Share your thoughts...
                  </Button>
                </CreatePostDialog>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Recent Posts</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPosts}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Be the first to share something with the community!
              </p>
              {session && (
                <CreatePostDialog>
                  <Button>Create Your First Post</Button>
                </CreatePostDialog>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post._id!.toString()}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>

      <EditPostDialog
        post={editingPost}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
