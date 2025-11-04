import clsx from 'clsx';
import { ChevronDown, Plus, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ESize } from '../Helpers/UIsize.enum';
import type { SelectOption, UISelectSearchProps } from './UISelectSearch.types';

export const UISelectSearch: React.FC<UISelectSearchProps> = ({
  placeholder = "Chọn...",
  value,
  multiple = false,
  disabled = false,
  searchable = true,
  options = [],
  loading = false,
  onSearch,
  onChange,
  onCreateNew,
  maxDisplayTags = 3,
  showCreateButton = false,
  createButtonText = "Thêm mới",
  noDataText = "Không tìm thấy dữ liệu",
  size = ESize.M,
  className = "",
  containerClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSelectOption = (option: SelectOption) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.some(v => v.value === option.value);
      const newValues = isSelected
        ? currentValues.filter(v => v.value !== option.value)
        : [...currentValues, option];
      onChange(newValues.length > 0 ? newValues : null);
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleRemoveTag = (optionToRemove: SelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter(v => v.value !== optionToRemove.value);
      onChange(newValues.length > 0 ? newValues : null);
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew && searchQuery.trim()) {
      onCreateNew(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const renderSelectedValues = () => {
    if (!value) return null;
    if (multiple && Array.isArray(value)) {
      const displayValues = value.slice(0, maxDisplayTags);
      const remainingCount = value.length - maxDisplayTags;

      return (
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {displayValues.map((option) => (
            <span key={option.value} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200">
              <span className="truncate">{option.label}</span>
              {!disabled && (
                <button onClick={(e) => handleRemoveTag(option, e)} className="hover:bg-blue-100 rounded p-0.5 transition-colors">
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-sm rounded-md">
              +{remainingCount}
            </span>
          )}
        </div>
      );
    } else {
      return <span className="truncate flex-1 text-gray-900">{(value as SelectOption)?.label || ""}</span>;
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    if (multiple && Array.isArray(value)) {
      return value.some((v) => v.value === option.value);
    }
    return (value as SelectOption)?.value === option.value;
  };

  const sizeClasses = {
    [ESize.S]: "px-[16px] py-[8px] h-[40px]",
    [ESize.M]: "px-[14px] py-[10px] h-[44px]",
    [ESize.L]: "px-[16px] py-[12px] h-[50px]",
    [ESize.XL]: "px-[18px] py-[14px] h-[56px]",
  };

  return (
    <div className={`relative ${containerClassName}`} ref={containerRef}>
      <div
        className={clsx(
          "flex items-center gap-2 border rounded-md cursor-pointer transition-all",
          sizeClasses[size],
          {
            'bg-gray-50 border-gray-200 cursor-not-allowed': disabled,
            'bg-white border-gray-300 hover:border-gray-400': !disabled && !isOpen,
            'border-blue-500 ring-2 ring-blue-200 bg-white': isOpen && !disabled,
          },
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {value ? renderSelectedValues() : <span className="text-gray-400 flex-1">{placeholder}</span>}
        <ChevronDown size={18} className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-hidden min-w-[200px] w-full">
          {searchable && (
            <div className="p-2.5 border-b border-gray-200">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500 text-sm">Đang tải...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">{noDataText}</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors text-sm
                  ${isOptionSelected(option) ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isOptionSelected(option)}
                      onChange={() => { }}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  )}
                  <span className="flex-1 truncate">{option.label}</span>
                  {isOptionSelected(option) && !multiple && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                </div>
              ))
            )}
          </div>

          {showCreateButton && onCreateNew && (
            <div className="p-2.5 border-t border-gray-200">
              <button
                onClick={handleCreateNew}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium"
              >
                <Plus size={16} />
                {createButtonText}{searchQuery.trim() ? `: "${searchQuery}"` : ""}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

