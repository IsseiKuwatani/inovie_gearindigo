import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, AlertCircle, Play, Pause, Save } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

interface AudioRecorderProps {
  onSave: (audioBlob: Blob, duration: number) => void;
}

export default function AudioRecorder({ onSave }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveformContainerRef.current && audioUrl) {
      waveformRef.current = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#4F46E5',
        barWidth: 2,
        barGap: 1,
        height: 60,
      });

      waveformRef.current.load(audioUrl);
      
      waveformRef.current.on('finish', () => {
        setIsPlaying(false);
      });

      return () => {
        waveformRef.current?.destroy();
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start(10);
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('マイクへのアクセスが許可されていません。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const togglePlayback = () => {
    if (waveformRef.current) {
      if (isPlaying) {
        waveformRef.current.pause();
      } else {
        waveformRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSave = () => {
    if (chunksRef.current.length > 0) {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
      onSave(audioBlob, recordingTime);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="flex items-center text-red-600 text-sm">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            {formatTime(recordingTime)}
          </span>
          {isRecording && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="ml-2 text-sm text-gray-600">録音中</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Mic className="w-4 h-4 mr-1" />
              録音開始
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={stopRecording}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <Square className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {audioUrl && (
        <div className="space-y-4">
          <div ref={waveformContainerRef} className="w-full" />
          <div className="flex justify-between">
            <button
              onClick={togglePlayback}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-1" />
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}