import express from 'express';
import axios from 'axios';

const router = express.Router();

const HF_API_URL = 'https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const token = process.env.HF_API_TOKEN;
  console.log('AI Request received. Token present:', !!token);

  if (!token) {
    console.error('Missing HF API Token');
    return res.status(500).json({ error: 'Hugging Face API token not configured on server' });
  }

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    console.log('HF API response shape:', Array.isArray(response.data) ? 'array' : typeof response.data);
    res.json(response.data);
  } catch (error) {
    console.error('AI Generation Error Full:', error);
    console.error('AI Response Data:', error.response?.data);
    res.status(500).json({
      error: 'Failed to generate content',
      details: error.response?.data || error.message
    });
  }
});

export default router;
