import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { updatePassword } from '../../lib/api/auth';

interface SecuritySettingsForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecuritySettings() {
  const { user } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SecuritySettingsForm>();
  const newPassword = watch('newPassword');

  const onSubmit = async (data: SecuritySettingsForm) => {
    if (!user) return;
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          現在のパスワード
        </label>
        <input
          type="password"
          {...register('currentPassword', { required: '現在のパスワードは必須です' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          新しいパスワード
        </label>
        <input
          type="password"
          {...register('newPassword', {
            required: '新しいパスワードは必須です',
            minLength: {
              value: 8,
              message: 'パスワードは8文字以上である必要があります',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          新しいパスワード（確認）
        </label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'パスワードの確認は必須です',
            validate: value =>
              value === newPassword || 'パスワードが一致しません',
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          パスワードを変更
        </button>
      </div>
    </form>
  );
}