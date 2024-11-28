import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Video, MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface Interview {
  id: number;
  companyName: string;
  interviewee: string;
  role: string;
  date: string;
  time: string;
  method: 'online' | 'offline' | 'phone';
  status: 'scheduled' | 'completed';
  objectives: string[];
  questions: string[];
  insights?: string[];
  recordingUrl?: string;
  transcript?: string;
}

interface InterviewCardProps {
  interview: Interview;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStartRecording?: (id: number) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function InterviewCard({
  interview,
  onEdit,
  onDelete,
  onStartRecording,
  expanded,
  onToggleExpand,
}: InterviewCardProps) {
  const getMethodIcon = () => {
    switch (interview.method) {
      case 'online':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'offline':
        return <MapPin className="h-5 w-5 text-green-500" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {interview.companyName}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span className="mr-4">{interview.interviewee}</span>
              <span>{interview.role}</span>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              interview.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {interview.status === 'completed' ? '完了' : '予定'}
          </span>
        </div>

        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(interview.date), 'yyyy/MM/dd')}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {interview.time}
          </div>
          <div className="flex items-center">
            {getMethodIcon()}
            <span className="ml-1">
              {interview.method === 'online'
                ? 'オンライン'
                : interview.method === 'offline'
                ? '対面'
                : '電話'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onToggleExpand}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                詳細を閉じる
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                詳細を表示
              </>
            )}
          </button>
          <div className="flex space-x-2">
            {interview.status === 'scheduled' && onStartRecording && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStartRecording(interview.id)}
              >
                録音を開始
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(interview.id)}
              >
                編集
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(interview.id)}
              >
                削除
              </Button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  インタビューの目的
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {interview.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>

                <h4 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                  質問事項
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {interview.questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>

              {interview.status === 'completed' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    インサイト
                  </h4>
                  {interview.insights && (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {interview.insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  )}

                  {interview.recordingUrl && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        録音データ
                      </h4>
                      <audio controls className="w-full">
                        <source src={interview.recordingUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}