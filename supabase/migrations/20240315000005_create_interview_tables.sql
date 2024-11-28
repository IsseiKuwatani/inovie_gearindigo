-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create interviews table
CREATE TABLE interviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    company_name TEXT NOT NULL,
    interviewee TEXT NOT NULL,
    role TEXT NOT NULL,
    interview_date DATE NOT NULL,
    interview_time TIME NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('online', 'offline', 'phone')),
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed')),
    objectives TEXT[] NOT NULL,
    questions TEXT[] NOT NULL,
    insights TEXT[],
    recording_url TEXT,
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create interview_notes table
CREATE TABLE interview_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create interview_tags table
CREATE TABLE interview_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create interview_tag_relations table
CREATE TABLE interview_tag_relations (
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES interview_tags(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (interview_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_tag_relations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for interviews table
CREATE POLICY "Users can view own interviews"
    ON interviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews"
    ON interviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews"
    ON interviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews"
    ON interviews FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for interview_notes table
CREATE POLICY "Users can view own interview notes"
    ON interview_notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview notes"
    ON interview_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interview notes"
    ON interview_notes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interview notes"
    ON interview_notes FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for interview_tags table
CREATE POLICY "Users can view own tags"
    ON interview_tags FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags"
    ON interview_tags FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
    ON interview_tags FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
    ON interview_tags FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for interview_tag_relations table
CREATE POLICY "Users can view own tag relations"
    ON interview_tag_relations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM interviews
            WHERE interviews.id = interview_tag_relations.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own tag relations"
    ON interview_tag_relations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM interviews
            WHERE interviews.id = interview_tag_relations.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own tag relations"
    ON interview_tag_relations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM interviews
            WHERE interviews.id = interview_tag_relations.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_interviews_updated_at
    BEFORE UPDATE ON interviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_notes_updated_at
    BEFORE UPDATE ON interview_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interview_notes_interview_id ON interview_notes(interview_id);
CREATE INDEX idx_interview_notes_user_id ON interview_notes(user_id);
CREATE INDEX idx_interview_tags_user_id ON interview_tags(user_id);