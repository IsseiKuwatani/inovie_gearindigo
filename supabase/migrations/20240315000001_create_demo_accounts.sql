-- First, delete existing demo accounts if they exist
DELETE FROM auth.users WHERE email IN ('demo@example.com', 'user@example.com');

-- Create demo accounts
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
    recovery_token
) VALUES
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'demo@example.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Demo Admin", "role": "admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'user@example.com',
    crypt('user123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Demo User", "role": "user"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
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
WHERE email IN ('demo@example.com', 'user@example.com')
ON CONFLICT (id) DO UPDATE
SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role;