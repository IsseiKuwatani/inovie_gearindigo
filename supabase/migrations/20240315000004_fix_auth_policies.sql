-- Drop existing policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create more permissive policies
CREATE POLICY "Enable read access for all users"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Reset demo accounts with correct auth settings
DELETE FROM auth.users WHERE email IN ('demo@example.com', 'user@example.com');
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email IN ('demo@example.com', 'user@example.com')
);

-- Insert demo accounts with correct settings
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
) VALUES
(
    gen_random_uuid(),
    'demo@example.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin"}',
    'authenticated',
    'authenticated',
    now(),
    now()
),
(
    gen_random_uuid(),
    'user@example.com',
    crypt('user123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"user"}',
    'authenticated',
    'authenticated',
    now(),
    now()
);

-- Create profiles for demo accounts
INSERT INTO public.profiles (id, name, role)
SELECT 
    id,
    CASE 
        WHEN email = 'demo@example.com' THEN 'Demo Admin'
        ELSE 'Demo User'
    END,
    CASE 
        WHEN email = 'demo@example.com' THEN 'admin'
        ELSE 'user'
    END
FROM auth.users
WHERE email IN ('demo@example.com', 'user@example.com');