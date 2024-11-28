import React, { forwardRef } from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, ...props }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            ref={ref}
            {...props}
          />
        </div>
        <div className="ml-3">
          <label className="text-sm font-medium text-gray-900">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';