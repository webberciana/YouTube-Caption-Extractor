import express from 'express';
import cors from 'cors';
import path from 'path';
import { getVideoDetails } from 'youtube-caption-extractor';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Extract video ID helper function
function extractVideoId(input: string): string {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = input.match(youtubeRegex);

  if (match && match[1]) {
    return match[1];
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  throw new Error('Invalid YouTube URL or video ID');
}

// API endpoint for captions
app.post('/api/captions', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    
    const { videoInput, lang = 'en' } = req.body;

    if (!videoInput) {
      return res.status(400).json({
        success: false,
        error: 'Video URL or ID is required'
      });
    }

    const videoId = extractVideoId(videoInput);
    console.log(`Fetching captions for video: ${videoId}, language: ${lang}`);

    const videoDetails = await getVideoDetails({ videoID: videoId, lang });
    console.log('Video details fetched successfully');

    res.json({
      success: true,
      data: {
        ...videoDetails,
        videoId
      }
    });

  } catch (error) {
    console.error('Error fetching captions:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch video captions';
    
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve main page for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/captions`);
});