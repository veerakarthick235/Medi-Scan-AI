'use client';

import React from "react"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Mic, Upload, X } from 'lucide-react';

interface TriageFormProps {
  onSubmit: (data: {
    symptoms: string;
    image?: File;
    audio?: File;
  }) => void;
  isLoading: boolean;
}

export function TriageForm({ onSubmit, isLoading }: TriageFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedAudio(file);
    }
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'cough_recording.wav', {
          type: 'audio/wav',
        });
        setSelectedAudio(file);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.log('[v0] Microphone error:', error);
      const errorMessage = 
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Microphone access denied. Please use the upload option instead.'
          : 'Unable to access microphone. Please try uploading an audio file instead.';
      setMicError(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => {
        track.stop();
      });
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      alert('Please enter patient symptoms');
      return;
    }
    onSubmit({
      symptoms,
      image: selectedImage || undefined,
      audio: selectedAudio || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Symptoms Input */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Patient Symptoms
        </h2>
        <label className="block text-sm font-medium text-foreground mb-2">
          Describe patient symptoms and medical history
        </label>
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter symptoms, duration, severity, and relevant medical history. e.g., 'Patient presents with persistent cough for 3 weeks, slight fever, fatigue...'"
          className="min-h-32"
          disabled={isLoading}
        />
      </Card>

      {/* Image Upload */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Medical Images (Optional)
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Upload images of wounds, rashes, or other visible symptoms
        </p>

        {selectedImage ? (
          <div className="rounded-lg border border-border bg-muted p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {selectedImage.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedImage.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => imageInputRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center hover:bg-muted"
          >
            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-foreground">Click to upload image</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP up to 10MB
            </p>
          </div>
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
          className="hidden"
        />
      </Card>

      {/* Audio Input */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Audio Recording (Optional)
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Record cough or other respiratory sounds for analysis
        </p>

        {micError && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3">
            <p className="text-sm text-amber-900">{micError}</p>
          </div>
        )}

        <div className="space-y-3">
          {selectedAudio ? (
            <div className="rounded-lg border border-border bg-muted p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      {selectedAudio.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedAudio.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAudio(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex gap-2">
            {isRecording ? (
              <Button
                type="button"
                onClick={stopRecording}
                variant="destructive"
                className="flex-1"
              >
                Stop Recording
              </Button>
            ) : (
              <Button
                type="button"
                onClick={startRecording}
                variant="secondary"
                disabled={isLoading}
                className="flex-1"
              >
                <Mic className="mr-2 h-4 w-4" />
                Record Audio
              </Button>
            )}

            <Button
              type="button"
              onClick={() => audioInputRef.current?.click()}
              variant="secondary"
              disabled={isLoading}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Audio
            </Button>
          </div>
        </div>

        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioFileChange}
          disabled={isLoading}
          className="hidden"
        />
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !symptoms.trim()}
        className="w-full bg-primary py-6 text-lg font-semibold"
      >
        {isLoading ? 'Analyzing...' : 'Perform Triage Assessment'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        All data is processed locally and never transmitted externally
      </p>
    </form>
  );
}
