import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthDialog } from "@/components/AuthDialogProvider";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, LogOut, Play, User, Lock } from "lucide-react";

interface Course {
  id: string;
  title: string;
  is_free: boolean;
}

interface CourseVideo {
  id: string;
  course_id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string | null;
}

const Lessons = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { openAuth } = useAuthDialog();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<CourseVideo | null>(null);
  const [fetching, setFetching] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  // SEO basics
  useEffect(() => {
    document.title = "Lessons – Course Video Library";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Watch GCSE lessons by course. Filter videos by course and play them in a beautiful popup player.";
      document.head.appendChild(m);
    } else {
      metaDesc.setAttribute(
        "content",
        "Watch GCSE lessons by course. Filter videos by course and play them in a beautiful popup player."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = window.location.origin + "/lessons";
      document.head.appendChild(link);
    }
  }, []);

  const handleDashboardClick = () => navigate("/dashboard");
  const handleSignOut = async () => { await signOut(); };

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("id, title, is_free")
          .order("title");
        if (error) throw error;
        setCourses(data || []);
      } catch (e) {
        console.error("Error loading courses", e);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  // Fetch user's enrollments when logged in
  useEffect(() => {
    if (!user) { setEnrolledCourseIds([]); return; }
    const loadEnrollments = async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id');
      if (!error) {
        setEnrolledCourseIds((data || []).map((e) => e.course_id));
      }
    };
    loadEnrollments();
  }, [user]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (selectedCourseIds.length === 0) { setVideos([]); return; }
      setFetching(true);
      try {
        const { data, error } = await supabase
          .from("course_videos")
          .select("id, course_id, title, video_url, thumbnail_url")
          .in("course_id", selectedCourseIds)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setVideos(data || []);
      } catch (e) {
        console.error("Error fetching videos", e);
      } finally {
        setFetching(false);
      }
    };
    fetchVideos();
  }, [selectedCourseIds]);

  // Sync selection with auth/enrollments
  useEffect(() => {
    if (user) {
      setSelectedCourseIds(enrolledCourseIds);
    } else {
      setSelectedCourseIds(courses.map((c) => c.id));
    }
  }, [user, enrolledCourseIds, courses]);

  const toggleCourse = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectableIds = user ? enrolledCourseIds : courses.map((c) => c.id);
  const allSelected = selectedCourseIds.length === selectableIds.length && selectableIds.length > 0;
  const toggleAll = () => {
    setSelectedCourseIds(allSelected ? [] : selectableIds);
  };

  const courseTitleById = useMemo(() => Object.fromEntries(courses.map(c => [c.id, c.title])), [courses]);

  const getEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "");
      if (host.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
        // playlist or other formats fallback
        const paths = u.pathname.split("/").filter(Boolean);
        const maybeId = paths.pop();
        if (maybeId) return `https://www.youtube.com/embed/${maybeId}`;
      }
      if (host.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      if (host.includes("vimeo.com")) {
        const id = u.pathname.split("/").filter(Boolean).pop();
        if (id) return `https://player.vimeo.com/video/${id}`;
      }
      return url; // default: open as-is
    } catch {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity cursor-pointer">
                gcsewala
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {user && (
                <Button variant="ghost" onClick={handleDashboardClick} className="text-primary hover:text-black hover:bg-accent/20">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              )}
              {!user && (
                <Link to="/#subjects" className="text-foreground hover:text-primary transition-colors">Subjects</Link>
              )}
              <Link to="/pastpapers" className="text-foreground hover:text-primary transition-colors">Past Papers</Link>
              <Link to="/quizzes" className="text-foreground hover:text-primary transition-colors">Quizzes</Link>
              <Link to="/lessons" className="text-foreground hover:text-primary transition-colors">Lessons</Link>
              <Link to="/faq" className="text-foreground hover:text-primary transition-colors">FAQ</Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="mr-2" onClick={() => openAuth('signin')} disabled={loading}>
                    Log In
                  </Button>
                  <Button className="animate-pulse-glow" onClick={() => openAuth('signup')} disabled={loading}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Lessons</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Select courses on the left to see their lesson videos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Course filter */}
          <aside className="md:col-span-4 lg:col-span-3">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    {user ? "Filter by Enrolled Courses" : "Filter by Course"}
                  </h2>
                  <Button variant="outline" size="sm" onClick={toggleAll}>
                    {allSelected ? "Clear" : "Select all"}
                  </Button>
                </div>
                {user && enrolledCourseIds.length === 0 && (
                  <p className="text-sm text-muted-foreground mb-2">Please enroll to watch lessons.</p>
                )}
                <ScrollArea className="h-[360px] pr-2">
                  <div className="space-y-3">
                    {courses.map((course) => {
                      const isEnrolled = enrolledCourseIds.includes(course.id);
                      const isLocked = user ? !isEnrolled && !course.is_free : false;
                      return (
                        <label key={course.id} className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedCourseIds.includes(course.id)}
                            onCheckedChange={() => { if (!isLocked) toggleCourse(course.id); }}
                            disabled={isLocked}
                          />
                          <span className="text-sm leading-5 text-foreground flex items-center gap-2">
                            {course.title}
                            {user && !isEnrolled && !course.is_free && (
                              <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-label="Locked" />
                            )}
                          </span>
                        </label>
                      );
                    })}
                    {courses.length === 0 && (
                      <p className="text-sm text-muted-foreground">No courses available yet.</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          {/* Right: Videos grid */}
          <main className="md:col-span-8 lg:col-span-9">
            {fetching && (
              <p className="text-sm text-muted-foreground mb-4">Loading videos…</p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v) => (
                <Card key={v.id} className="group overflow-hidden border-border hover:shadow-lg transition-shadow">
                  <button
                    onClick={() => setActiveVideo(v)}
                    className="text-left w-full"
                    aria-label={`Play ${v.title}`}
                  >
                    <div className="relative aspect-video bg-muted">
                      {v.thumbnail_url ? (
                        <img
                          src={v.thumbnail_url}
                          alt={`Thumbnail for ${v.title}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Play className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-primary/80 mb-1">{courseTitleById[v.course_id] || "Course"}</p>
                      <h3 className="font-semibold text-foreground line-clamp-2">{v.title}</h3>
                    </CardContent>
                  </button>
                </Card>
              ))}
            </div>
            {videos.length === 0 && !fetching && (
              <p className="text-sm text-muted-foreground">No videos found for your selection.</p>
            )}
          </main>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activeVideo?.title}</DialogTitle>
          </DialogHeader>
          {activeVideo && (
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(activeVideo.video_url)}
                title={activeVideo.title}
                className="w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Lessons;
