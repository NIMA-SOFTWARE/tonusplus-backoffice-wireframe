import React, { useState, useRef } from 'react';
import VoiceInputButton from './VoiceInputButton';

interface VoiceEnabledInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  isTextarea?: boolean;
  rows?: number;
  id?: string;
  disabled?: boolean;
}

const VoiceEnabledInput: React.FC<VoiceEnabledInputProps> = ({
  value,
  onChange,
  placeholder = '',
  label,
  className = '',
  isTextarea = false,
  rows = 3,
  id,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleTranscription = (text: string) => {
    // If the current value is empty, just set it to the transcription
    // Otherwise, append the transcription with a space
    const newValue = value ? `${value} ${text}` : text;
    onChange(newValue);
    
    // Focus the input after transcription is complete
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const inputClasses = `w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`;
  
  const renderInput = () => {
    if (isTextarea) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
          rows={rows}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
      />
    );
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-500 uppercase mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        {renderInput()}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <VoiceInputButton
            onTranscriptionComplete={handleTranscription}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceEnabledInput;