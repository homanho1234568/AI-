require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Constants
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// 政治关键词列表（新增“白纸运动”）
const politicalKeywords = [
  '政治', '政府', '选举', '民主', '共产主义', '资本主义', '总统', '首相',
  '法律', '政策', '党派', '国家', '战争', '外交', '政权', '自由', '人权',
  '文革', '共产', '资本', '毛泽东', '毛主席', '邓小平', '习近平', '白纸运动'
];

// 检查是否为政治问题
function isPoliticalQuestion(input) {
  const lowerInput = input.toLowerCase();
  return politicalKeywords.some(keyword => lowerInput.includes(keyword));
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, input, r1, search } = req.body;
  
  // 检查是否为政治问题
  if (isPoliticalQuestion(input)) {
    return res.json({
      content: '你好，这个问题我暂时无法回答，让我们换个话题再聊聊吧。'
    });
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set in .env');
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    const requestBody = {
      model: 'deepseek/deepseek-chat:free',
      messages: messages.concat({ role: 'user', content: input }),
      max_tokens: 1000,
      reasoning: r1 ? { effort: 'high' } : undefined
    };

    if (search) {
      requestBody.plugins = [{
        id: 'web',
        max_results: 3,
        search_prompt: '以下是有關此問題的網絡搜索結果：'
      }];
    }

    const response = await axios.post(OPENROUTER_API_URL, requestBody, { headers });
    console.log('OpenRouter Response:', response.data);
    const content = response.data.choices[0].message.content || 'No content returned';
    res.json({ content });
  } catch (error) {
    console.error('API Error:', error.message, error.response?.data);
    res.status(500).json({
      error: 'API调用失败',
      details: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 6505;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});