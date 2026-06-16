const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Render will automatically set the correct port here

app.use(express.json());

app.get('/api/ask', (req, res) => {
    const question = req.query.q ? req.query.q.toLowerCase() : '';
    
    // Check if the user is asking to create an image
    const imageKeywords = ['make an image', 'draw', 'picture', 'generate image', 'create a photo'];
    const isImageRequest = imageKeywords.some(keyword => question.includes(keyword));

    // Set headers for real-time streaming data over the cloud
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (isImageRequest) {
        // FAST PATH: Only use ChatGPT for images. Skip Gemini and DeepSeek completely.
        setTimeout(() => {
            const mockImageResponse = {
                ai: 'ChatGPT_Image',
                url: 'https://unsplash.com' 
            };
            res.write(`data: ${JSON.stringify(mockImageResponse)}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
        }, 500); 
    } else {
        // TEXT PATH: Run all 3 AIs at the exact same time
        setTimeout(() => {
            res.write(`data: ${JSON.stringify({ ai: 'ChatGPT', text: 'Short ChatGPT answer.' })}\n\n`);
        }, 200);

        setTimeout(() => {
            res.write(`data: ${JSON.stringify({ ai: 'Gemini', text: 'Fast Gemini response.' })}\n\n`);
        }, 400);

        setTimeout(() => {
            res.write(`data: ${JSON.stringify({ ai: 'DeepSeek', text: 'Low-data DeepSeek reply.' })}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
        }, 600);
    }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
