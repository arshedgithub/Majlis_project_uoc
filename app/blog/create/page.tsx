"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  BookOpen,
  User,
  FileText,
  Image as ImageIcon,
  Building2,
  Star,
  Eye,
  Upload,
  CheckCircle2
} from "lucide-react";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getProgress = () => {
    let completed = 0;
    if (title) completed += 25;
    if (author) completed += 25;
    if (content) completed += 35;
    if (image) completed += 15;
    return completed;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateBlog = async () => {
    if (!title || !author || !content) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("http://localhost:3200/api/blogs", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert("Blog created successfully!");
        setTitle("");
        setAuthor("");
        setContent("");
        setImage(null);
        setPreviewUrl(null);
      } else {
        alert(data.message || "Failed to create blog.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4 overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Card className="w-full max-w-md p-8 text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-pulse"></div>
                <Loader2 className="h-12 w-12 animate-spin bg-gradient-to-r from-[#2E2AB1] to-[#33A9E0] bg-clip-text text-transparent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Publishing Your Article</h3>
                <p className="text-gray-600">Sharing knowledge with the Ummah...</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
          <Card className="w-full h-full flex flex-col border-0 shadow-lg overflow-hidden">
            <CardHeader className="border-b bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#33A9E0] to-[#2E2AB1] border-2 border-white flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Create New Blog Post
                </CardTitle>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 border-blue-200 ">
                  Progress: {getProgress()}%
                </Badge>
              </div>
              <Progress value={getProgress()} className="h-2 mt-4" />
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4" />
                    Blog Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter your blog title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setFocusedField("title")}
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author" className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4" />
                    Author Name
                  </Label>
                  <Input
                    id="author"
                    placeholder="Enter author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    onFocus={() => setFocusedField("author")}
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content" className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4" />
                    Blog Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setFocusedField("content")}
                    rows={10}
                    className="bg-white min-h-[200px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2 text-gray-700">
                    <ImageIcon className="h-4 w-4" />
                    Featured Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                          <Upload className="h-6 w-6 mb-2" />
                          <span className="text-xs text-center">Upload Image</span>
                        </div>
                      )}
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <div className="flex-1 text-sm text-gray-500">
                      {previewUrl ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Image selected</span>
                        </div>
                      ) : (
                        <p>Upload a high-quality image that represents your blog (JPEG, PNG)</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <div className="p-6 border-t bg-white">
              <Button
                onClick={handleCreateBlog}
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r  from-[#33A9E0] to-[#2E2AB1] hover:from-emerald-700 hover:to-teal-600 text-white font-semibold shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Blog Post"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}