import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';

interface InterviewFiltersProps {
  filter: string;
  searchQuery: string;
  onFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function InterviewFilters({
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: InterviewFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="w-5 h-5 text-gray-400 mr-2" />
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">全て</option>
          <option value="scheduled">予定</option>
          <option value="completed">完了</option>
        </select>
      </div>
      <Input
        label=""
        type="text"
        placeholder="インタビューを検索..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<Search className="h-5 w-5 text-gray-400" />}
        className="flex-1"
      />
    </div>
  );
}