-- First, ensure the auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Drop existing demo accounts
DELETE FROM auth.users WHERE email IN ('demo@example.com', 'user@example.com');
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email IN ('demo@example.com', 'user@example.com')
);

-- Create demo accounts with proper password hashing
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change_token_current,
    email_change_token_new,
    recovery_token,
    confirmation_sent_at,
    invited_at,
    reset_token_version
) VALUES
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'demo@example.com',
    crypt('demo123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    NOW(),
    NOW(),
    0
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'user@example.com',
    crypt('user123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "user"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    NOW(),
    NOW(),
    0
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

-- Create notification settings for demo accounts
INSERT INTO public.notification_settings (user_id)
SELECT id
FROM auth.users
WHERE email IN ('demo@example.com', 'user@example.com');