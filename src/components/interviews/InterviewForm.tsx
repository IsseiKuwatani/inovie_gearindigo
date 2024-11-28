import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Video, MapPin, Phone } from 'lucide-react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import { FormGroup } from '../ui/FormGroup';

interface InterviewFormData {
  companyName: string;
  interviewee: string;
  role: string;
  date: string;
  time: string;
  method: 'online' | 'offline' | 'phone';
  objectives: string[];
  questions: string[];
}

interface InterviewFormProps {
  onSubmit: (data: InterviewFormData) => void;
  defaultValues?: Partial<InterviewFormData>;
  isLoading?: boolean;
}

export default function InterviewForm({ onSubmit, defaultValues, isLoading }: InterviewFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<InterviewFormData>({
    defaultValues: {
      objectives: [''],
      questions: [''],
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGroup>
        <Input
          label="企業名"
          {...register('companyName', { required: '企業名は必須です' })}
          error={errors.companyName?.message}
          placeholder="例: 株式会社ABC"
        />

        <Input
          label="インタビュー対象者"
          {...register('interviewee', { required: '対象者名は必須です' })}
          error={errors.interviewee?.message}
          placeholder="例: 山田太郎"
        />

        <Input
          label="役職"
          {...register('role', { required: '役職は必須です' })}
          error={errors.role?.message}
          placeholder="例: 営業部長"
        />
      </FormGroup>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="日付"
          type="date"
          icon={<Calendar className="h-5 w-5 text-gray-400" />}
          {...register('date', { required: '日付は必須です' })}
          error={errors.date?.message}
        />

        <Input
          label="時間"
          type="time"
          icon={<Clock className="h-5 w-5 text-gray-400" />}
          {...register('time', { required: '時間は必須です' })}
          error={errors.time?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            インタビュー方法
          </label>
          <div className="relative">
            <select
              {...register('method', { required: '方法は必須です' })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="online">オンライン</option>
              <option value="offline">対面</option>
              <option value="phone">電話</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              {register('method').value === 'online' && <Video className="h-5 w-5 text-gray-400" />}
              {register('method').value === 'offline' && <MapPin className="h-5 w-5 text-gray-400" />}
              {register('method').value === 'phone' && <Phone className="h-5 w-5 text-gray-400" />}
            </div>
          </div>
        </div>
      </div>

      <FormGroup>
        <TextArea
          label="インタビューの目的"
          {...register('objectives', { required: '目的は必須です' })}
          error={errors.objectives?.message}
          placeholder="例: 現在の業務フローにおける課題の特定&#13;&#10;システム導入による改善ポイントの発見"
          rows={4}
        />

        <TextArea
          label="質問事項"
          {...register('questions', { required: '質問は必須です' })}
          error={errors.questions?.message}
          placeholder="例: 1. 現在の業務における最大の課題は何ですか？&#13;&#10;2. どのような解決策を検討されていますか？"
          rows={4}
        />
      </FormGroup>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          保存
        </Button>
      </div>
    </form>
  );
}