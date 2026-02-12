import { useState, useCallback } from 'react';
import { queryHuggingFace } from '../lib/hf/client';
import { buildStudyPlanPrompt } from '../lib/hf/prompts';
import { parseStudyPlanResponse, generateFallbackPlan } from '../lib/hf/parser';

/**
 * Custom hook for interacting with Hugging Face API
 * Manages loading, error, and data states with retry logic
 */
export function useHuggingFace() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const generatePlan = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const prompt = buildStudyPlanPrompt(formData);
      const rawResponse = await queryHuggingFace(prompt);
      const parsedPlan = parseStudyPlanResponse(rawResponse);
      setData(parsedPlan);
      return parsedPlan;
    } catch (err) {
      console.warn('AI generation failed, using fallback plan:', err.message);
      // Use fallback plan instead of failing completely
      const fallback = generateFallbackPlan(formData);
      setData(fallback);
      setError('AI generation encountered an issue. Generated a structured plan based on your inputs.');
      return fallback;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { generatePlan, isLoading, error, data, reset };
}
