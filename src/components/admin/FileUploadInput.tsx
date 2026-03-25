import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadInputProps {
  label: string;
  name: string;
  accept: string; // "audio/*" or "image/*"
  onChange: (file: File | null) => void;
  defaultValue?: string;
  maxSize?: number; // bytes
  preview?: boolean; // for images
  required?: boolean;
}

export default function FileUploadInput({
  label,
  name,
  accept,
  onChange,
  defaultValue,
  maxSize = 50 * 1024 * 1024, // 50MB default
  preview = false,
  required = false,
}: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    // Check file type
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type === 'audio/*') return file.type.startsWith('audio/');
      if (type === 'image/*') return file.type.startsWith('image/');
      return file.type === type;
    });

    if (!isValidType) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`File too large. Maximum size: ${maxSizeMB}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      setSelectedFile(null);
      onChange(null);
      return;
    }

    setSelectedFile(file);
    onChange(file);

    // Preview image
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-2">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {!selectedFile && !previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-red-500 bg-red-500/10'
              : 'border-white/[0.2] bg-white/[0.02] hover:border-white/[0.4] hover:bg-white/[0.05]'
          }`}
        >
          <Upload className="mx-auto mb-3 text-white/40" size={32} />
          <p className="text-white font-medium">Click to upload or drag and drop</p>
          <p className="text-white/40 text-sm mt-1">
            {accept === 'audio/*'
              ? 'MP3, WAV, OGG (max 50MB)'
              : 'PNG, JPG, GIF (max 10MB)'}
          </p>
        </div>
      ) : (
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-4">
          {previewUrl && preview && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                <p className="text-white font-medium truncate">
                  {selectedFile?.name || 'File selected'}
                </p>
              </div>
              <p className="text-white/40 text-sm">
                {selectedFile ? formatFileSize(selectedFile.size) : 'Ready for upload'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 hover:bg-white/[0.08] rounded transition text-red-400 hover:text-red-300 flex-shrink-0 ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
