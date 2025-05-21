import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

interface TagSelectionInputProps {
  label: string;
  placeholder?: string;
  options: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allowCustomTags?: boolean;
  voiceEnabled?: boolean;
  className?: string;
}

const TagSelectionInput: React.FC<TagSelectionInputProps> = ({
  label,
  placeholder = 'Add an item...',
  options,
  selectedTags,
  onTagsChange,
  allowCustomTags = true,
  voiceEnabled = false,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on input
  useEffect(() => {
    if (inputValue) {
      const filtered = options
        .filter(option => 
          !selectedTags.includes(option) && 
          option.toLowerCase().includes(inputValue.toLowerCase())
        );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options.filter(option => !selectedTags.includes(option)));
    }
  }, [inputValue, options, selectedTags]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!showDropdown) {
      setShowDropdown(true);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleSelectOption = (option: string) => {
    if (!selectedTags.includes(option)) {
      onTagsChange([...selectedTags, option]);
    }
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleAddCustomTag = () => {
    if (inputValue && !selectedTags.includes(inputValue)) {
      onTagsChange([...selectedTags, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      
      // If the input matches an existing option, select it
      const matchingOption = filteredOptions.find(
        option => option.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (matchingOption) {
        handleSelectOption(matchingOption);
      } else if (allowCustomTags) {
        handleAddCustomTag();
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // Remove the last tag when backspace is pressed in an empty input
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleVoiceInput = (text: string) => {
    // Try to match spoken text to options
    const lowerText = text.toLowerCase();
    const matchedOption = options.find(option => 
      option.toLowerCase().includes(lowerText)
    );
    
    if (matchedOption && !selectedTags.includes(matchedOption)) {
      handleSelectOption(matchedOption);
    } else if (allowCustomTags) {
      setInputValue(text);
      setShowDropdown(true);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
        {label}
      </label>
      
      <div className="w-full border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white">
        {/* Selected tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(tag => (
            <div 
              key={tag} 
              className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
            >
              <span>{tag}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Input field with voice button */}
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 outline-none text-sm"
          />
          {voiceEnabled && (
            <VoiceInputButton 
              onTranscriptionComplete={handleVoiceInput}
              className="ml-2"
            />
          )}
        </div>
      </div>
      
      {/* Dropdown */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10"
        >
          {filteredOptions.length > 0 ? (
            <ul>
              {filteredOptions.map(option => (
                <li 
                  key={option}
                  className="py-2 px-3 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : allowCustomTags && inputValue ? (
            <div 
              className="py-2 px-3 hover:bg-blue-50 text-blue-600 cursor-pointer text-sm border-t"
              onClick={handleAddCustomTag}
            >
              Add "{inputValue}"
            </div>
          ) : (
            <div className="py-2 px-3 text-gray-500 text-sm">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelectionInput;