-- Create table for course videos
create table if not exists public.course_videos (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.course_videos enable row level security;

-- Policy: Videos viewable for free courses
create policy if not exists "Videos viewable for free courses"
  on public.course_videos
  for select
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_videos.course_id and c.is_free = true
    )
  );

-- Policy: Users can view videos for enrolled courses
create policy if not exists "Users can view videos for enrolled courses"
  on public.course_videos
  for select
  using (
    exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid() and e.course_id = course_videos.course_id
    )
  );

-- Helpful index
create index if not exists idx_course_videos_course_id on public.course_videos(course_id);