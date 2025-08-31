import { getVideoDetails } from 'youtube-caption-extractor';
import { CaptionsRequestBody, HandlerResult, VideoDetails } from './config';

export const captionsHandler = async (
  body: CaptionsRequestBody
): Promise<HandlerResult> => {
  try {
    const { videoInput, lang = 'en' } = body;

    if (!videoInput) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Video URL or ID is required'
        }),
      }
    }

    const videoId = extractVideoId(videoInput);
    const videoDetails = await fetchVideoDetails(videoId, lang);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true, data: {
          ...videoDetails,
          videoId
        }
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch video captions',
      }),
    };
  }
};

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
