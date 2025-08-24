let currentVideoId = null;
let youtubePlayer = null;

// Dark theme functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        html.classList.remove('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
    
    themeToggle.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// Load YouTube IFrame API
function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    
    return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
            resolve();
            return;
        }
        
        // Set up the callback
        window.onYouTubeIframeAPIReady = () => {
            console.log('YouTube IFrame API loaded');
            resolve();
        };
        
        // Check if script already exists
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.onload = () => console.log('YouTube API script loaded');
            script.onerror = () => console.error('Failed to load YouTube API script');
            document.head.appendChild(script);
        }
    });
}

function extractVideoId(input) {
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

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function createYouTubePlayer(videoId) {
    try {
        await loadYouTubeAPI();
        
        const playerDiv = document.getElementById('videoPlayer');
        playerDiv.innerHTML = '<div id="youtube-player"></div>';
        
        return new Promise((resolve, reject) => {
            youtubePlayer = new YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    enablejsapi: 1,
                    origin: window.location.origin
                },
                events: {
                    onReady: function(event) {
                        console.log('YouTube player ready');
                        // Make player available globally for tests
                        window.youtubePlayer = youtubePlayer;
                        resolve(youtubePlayer);
                    },
                    onError: function(event) {
                        console.error('YouTube player error:', event.data);
                        reject(new Error(`YouTube player error: ${event.data}`));
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error creating YouTube player:', error);
        throw error;
    }
}

function seekToTime(startTime) {
    if (!youtubePlayer || !youtubePlayer.seekTo) {
        console.warn('YouTube player not ready yet');
        return;
    }
    
    const seconds = parseFloat(startTime);
    youtubePlayer.seekTo(seconds, true);
    youtubePlayer.playVideo();
}

function displayCaptions(subtitles) {
    const captionsList = document.getElementById('captionsList');
    const captionCount = document.getElementById('captionCount');
    captionsList.innerHTML = '';
    
    // Update caption count
    captionCount.textContent = `${subtitles.length} captions`;
    
    subtitles.forEach((subtitle, index) => {
        const captionElement = document.createElement('div');
        captionElement.className = 'caption-item p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:shadow-md';
        
        const startTime = parseFloat(subtitle.start);
        const formattedTime = formatTime(startTime);
        
        captionElement.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-primary-600 dark:text-primary-400 font-mono text-sm font-medium min-w-[50px] flex-shrink-0">${formattedTime}</span>
                <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex-1">${subtitle.text}</p>
            </div>
        `;
        
        captionElement.addEventListener('click', () => {
            seekToTime(subtitle.start);
            
            // Highlight clicked caption
            document.querySelectorAll('.caption-item').forEach(item => {
                item.classList.remove('bg-primary-100', 'dark:bg-primary-900/30', 'border-primary-300', 'dark:border-primary-600', 'ring-2', 'ring-primary-500/20');
                item.classList.add('border-gray-200', 'dark:border-gray-600');
            });
            captionElement.classList.add('bg-primary-100', 'dark:bg-primary-900/30', 'border-primary-300', 'dark:border-primary-600', 'ring-2', 'ring-primary-500/20');
            captionElement.classList.remove('border-gray-200', 'dark:border-gray-600');
            
            // Smooth scroll to clicked caption
            captionElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        });
        
        captionsList.appendChild(captionElement);
    });
}

function displayVideoInfo(title, description) {
    document.getElementById('videoTitle').textContent = title;
    
    // Format description with proper line breaks and clean up
    const descriptionElement = document.getElementById('videoDescription');
    const formattedDescription = description
        .replace(/\\n/g, '\n')  // Replace literal \n with actual newlines
        .split('\n')            // Split into lines
        .map(line => line.trim()) // Trim whitespace from each line
        .join('\n')             // Join back with newlines
        .trim();                // Remove leading/trailing whitespace
    
    descriptionElement.textContent = formattedDescription;
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    hideLoading();
}

function showResults() {
    document.getElementById('results').classList.remove('hidden');
    hideLoading();
}

document.getElementById('videoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const videoInput = document.getElementById('videoInput').value.trim();
    const lang = document.getElementById('langSelect').value;
    
    if (!videoInput) {
        showError('Please enter a YouTube URL or video ID');
        return;
    }
    
    try {
        showLoading();
        
        // Extract video ID for the player
        currentVideoId = extractVideoId(videoInput);
        
        const response = await fetch('/api/captions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoInput, lang }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch captions');
        }
        
        if (result.success) {
            const { title, description, subtitles } = result.data;
            
            // Create YouTube player
            await createYouTubePlayer(currentVideoId);
            
            // Display video info
            displayVideoInfo(title, description);
            
            // Display captions
            displayCaptions(subtitles);
            
            showResults();
        } else {
            throw new Error('Failed to extract captions');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred while fetching captions');
    }
});