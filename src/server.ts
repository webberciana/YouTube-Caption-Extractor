import express from 'express';
import cors from 'cors';
import path from 'path';
import { getVideoDetails } from 'youtube-caption-extractor';

interface VideoDetails {
  title: string;
  description: string;
  subtitles: Array<{
    start: string;
    dur: string;
    text: string;
  }>;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const extractVideoId = (input: string): string => {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = input.match(youtubeRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }
  
  throw new Error('Invalid YouTube URL or video ID');
};

const fetchVideoDetails = async (
  videoID: string,
  lang = 'en'
): Promise<VideoDetails> => {
  try {
    const details: VideoDetails = await getVideoDetails({ videoID, lang });
    console.log('Video details fetched:', { title: details.title, subtitlesCount: details.subtitles.length });
    return details;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

app.post('/api/captions', async (req, res) => {
  try {
    const { videoInput, lang = 'en' } = req.body;
    
    if (!videoInput) {
      return res.status(400).json({ error: 'Video URL or ID is required' });
    }

    const videoId = extractVideoId(videoInput);
    const videoDetails = await fetchVideoDetails(videoId, lang);
    
    res.json({
      success: true,
      data: {
        ...videoDetails,
        videoId
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch video captions' 
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});