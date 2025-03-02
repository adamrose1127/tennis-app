-- Users Table
CREATE TABLE public.users (
  id UUID NOT NULL,
  email TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  is_deleted BOOLEAN NULL DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  reactivated_at TIMESTAMP WITH TIME ZONE NULL,
  skill_level TEXT NULL, -- e.g., "Beginner", "Intermediate", "Advanced"
  location TEXT NULL, -- e.g., "New York, NY"
  availability JSONB NULL, -- e.g., { "days": ["Monday", "Wednesday"], "times": ["18:00", "20:00"] }
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id)
) TABLESPACE pg_default;

-- Matches Table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL, -- User who created the match
  location TEXT NOT NULL, -- Court location
  date TIMESTAMP WITH TIME ZONE NOT NULL, -- Match date and time
  duration INT NOT NULL, -- Duration in minutes
  skill_level TEXT NULL, -- Required skill level for the match
  status TEXT NOT NULL DEFAULT 'Pending', -- e.g., "Pending", "Confirmed", "Completed"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Match Participants Table
CREATE TABLE public.match_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL, -- Match ID
  user_id UUID NOT NULL, -- User ID
  status TEXT NOT NULL DEFAULT 'Invited', -- e.g., "Invited", "Accepted", "Declined"
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT match_participants_pkey PRIMARY KEY (id),
  CONSTRAINT match_participants_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches (id) ON DELETE CASCADE,
  CONSTRAINT match_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Notifications Table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- User ID
  message TEXT NOT NULL, -- Notification message
  read BOOLEAN NOT NULL DEFAULT false, -- Whether the notification has been read
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Subscriptions Table (Optional)
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  stripe_customer_id TEXT NULL,
  stripe_subscription_id TEXT NULL,
  status TEXT NULL,
  price_id TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  cancel_at_period_end BOOLEAN NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NULL,
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Enable Row-Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role full access to users" ON public.users
  FOR ALL TO service_role USING (true);

-- Matches Table Policies
CREATE POLICY "Users can read their own matches" ON public.matches
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can update their own matches" ON public.matches
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can insert matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Service role full access to matches" ON public.matches
  FOR ALL TO service_role USING (true);

-- Match Participants Table Policies
CREATE POLICY "Users can read their own match participations" ON public.match_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own match participations" ON public.match_participants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to match participations" ON public.match_participants
  FOR ALL TO service_role USING (true);

-- Notifications Table Policies
CREATE POLICY "Users can read their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to notifications" ON public.notifications
  FOR ALL TO service_role USING (true);

-- Subscriptions Table Policies
CREATE POLICY "Users can read their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to subscriptions" ON public.subscriptions
  FOR ALL TO service_role USING (true);