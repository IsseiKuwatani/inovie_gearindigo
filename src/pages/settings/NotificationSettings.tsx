import React from 'react';
import { useForm } from 'react-hook-form';
import { Switch } from '../../components/ui/Switch';

interface NotificationSettingsForm {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  mentionNotifications: boolean;
}

export default function NotificationSettings() {
  const { register, handleSubmit } = useForm<NotificationSettingsForm>({
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      mentionNotifications: true,
    },
  });

  const onSubmit = async (data: NotificationSettingsForm) => {
    try {
      // Save notification settings
      console.log(data);
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Switch
          label="メール通知"
          description="重要な更新やアクティビティについてメールで通知を受け取ります"
          {...register('emailNotifications')}
        />

        <Switch
          label="プッシュ通知"
          description="ブラウザのプッシュ通知を受け取ります"
          {...register('pushNotifications')}
        />

        <Switch
          label="週次ダイジェスト"
          description="週に1回、アクティビティのサマリーをメールで受け取ります"
          {...register('weeklyDigest')}
        />

        <Switch
          label="メンション通知"
          description="他のユーザーからメンションされた時に通知を受け取ります"
          {...register('mentionNotifications')}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          設定を保存
        </button>
      </div>
    </form>
  );
}