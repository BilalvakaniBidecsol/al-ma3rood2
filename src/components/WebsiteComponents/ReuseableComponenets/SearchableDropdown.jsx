import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const SearchableDropdown = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  className = '',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = (e) => {
    if (disabled || loading) return;
    if (e.target.closest('button[type="button"]')) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleOptionSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const displayValue = options.find(option => option === value) || '';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <div
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md 
          focus-within:ring-2 focus-within:ring-green-500
          flex items-center justify-between
          ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-green-500 border-green-500' : ''}
        `}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e);
          }
          if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
          }
        }}
        tabIndex={disabled || loading ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
        {...props}
      >
        <span className={`${!displayValue ? 'text-gray-500' : 'text-gray-900'}`}>
          {loading ? 'Loading...' : displayValue || placeholder}
        </span>
        <div className="flex items-center space-x-1">
          {displayValue && !disabled && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden"
          role="listbox"
          aria-label={`${placeholder} options`}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                aria-label={`Search ${placeholder.toLowerCase()}`}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`
                    w-full px-3 py-2 text-left hover:bg-green-50 hover:text-green-700
                    transition-colors text-sm
                    ${option === value ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-900'}
                  `}
                  role="option"
                  aria-selected={option === value}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center" role="status">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;