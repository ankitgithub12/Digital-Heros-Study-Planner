import api from '../api';

export async function queryHuggingFace(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Use our backend proxy instead of direct call
      const response = await api.post('/ai/generate', { prompt });

      if (response.data && response.data[0]?.generated_text) {
        return response.data[0].generated_text;
      }

      throw new Error('No generated text in response');
    } catch (error) {
      console.error('AI Query Error:', error);

      if (error.response?.status === 503 && attempt < retries) {
        // Model is loading, wait and retry
        const waitTime = error.response.data?.estimated_time || 20;
        await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
        continue;
      }

      if (attempt === retries) {
        throw new Error(
          error.response?.data?.error ||
          error.message ||
          'Failed to generate study plan'
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
}
