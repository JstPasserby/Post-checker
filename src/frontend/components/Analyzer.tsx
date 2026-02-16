// src/frontend/components/Analyzer.tsx
'use client';

import { useState } from 'react';
import { analyzePost } from '@/lib/api';

export default function PostAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await analyzePost({
        text,
        platform: 'instagram',
        language: 'en'
      });

      setResult(response);

      // Send to feedback system if user is logged in
      if (userId) {
        await sendToFeedback({
          text,
          prediction: response.blocked,
          actual: null, // Will be updated if user reports
          confidence: response.confidence
        });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your Instagram post here..."
        className="w-full h-40 p-3 border rounded-lg"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Check Post'}
      </button>

      {result && (
        <ResultDisplay
          result={result}
          originalText={text}
          onSuggestionApply={(suggestion) => setText(suggestion)}
        />
      )}
    </div>
  );
}
