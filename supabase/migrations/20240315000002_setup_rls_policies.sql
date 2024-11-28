-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Profiles are viewable by authenticated users"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Events table policies
CREATE POLICY "Users can view own events"
    ON events FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
    ON events FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
    ON events FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
    ON events FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Notification settings policies
CREATE POLICY "Users can view own notification settings"
    ON notification_settings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
    ON notification_settings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
    ON notification_settings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create admin role policies (optional)
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin'
        OR auth.uid() = id
    );

CREATE POLICY "Admins can view all events"
    ON events FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin'
        OR auth.uid() = user_id
    );

-- Function to verify admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT CASE 
            WHEN auth.jwt() ->> 'role' = 'admin' THEN TRUE
            ELSE FALSE
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify user owns the record
CREATE OR REPLACE FUNCTION auth_user_owns_record(record_user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = record_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;