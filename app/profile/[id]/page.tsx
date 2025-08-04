"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import EditPostDialog from "@/components/EditPostDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IPost } from "@/lib/models/Post";
import { UserWithoutPassword } from "@/lib/models/User";
import { CalendarDays, Mail, Edit3 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
interface ProfileData {
  user: UserWithoutPassword;
  posts: IPost[];
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<IPost | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { data: session } = useSession();
  const params = useParams();
  const userId = params.id as string;

  const isOwnProfile = session?.user?.id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          toast.error("User not found");
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

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
        setProfileData((prev) =>
          prev
            ? {
                ...prev,
                posts: prev.posts.filter(
                  (post) => post._id!.toString() !== postId
                ),
              }
            : null
        );
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("delete post error:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600">
              The user you&apos;re looking for doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, posts } = profileData;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.name}
                    </h1>
                    {isOwnProfile && (
                      <Link href="/settings">
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  {user.bio && (
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge variant="secondary">
                      {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {isOwnProfile ? "Your Posts" : `${user.name}'s Posts`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {posts.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-gray-500 mb-4">
                  {isOwnProfile
                    ? "You haven't created any posts yet."
                    : "This user hasn't created any posts yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {posts.map((post) => (
                  <PostCard
                    key={post._id!.toString()}
                    post={post}
                    onEdit={isOwnProfile ? handleEditPost : undefined}
                    onDelete={isOwnProfile ? handleDeletePost : undefined}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EditPostDialog
        post={editingPost}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
