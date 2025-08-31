# 🎬 YouTube Caption Extractor

A modern, responsive TypeScript application for extracting and navigating YouTube video captions with clickable timestamps and dark theme support.

Demo: [https://captions.botly.app/](https://captions.botly.app/)

<img width="1032" height="731" alt="preview" src="https://github.com/user-attachments/assets/482bbcbe-d159-4ad7-bb48-2f7e8b67f77c" />

![YouTube Caption Extractor](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🎯 **Extract captions** from YouTube videos using URLs or video IDs
- 🎮 **Clickable timestamps** - click any caption to seek to that moment in the video
- 🌓 **Dark/Light theme** toggle with system preference detection
- 📱 **Mobile responsive** design that works on all devices
- 🎨 **Cool gradient SVG logo** with modern design
- 🌍 **Multi-language support** (English, Russian, Spanish, French, German)
- ⚡ **Real-time video embedding** with YouTube IFrame API
- 📊 **Caption counter** and enhanced styling
- 💾 **Theme persistence** across sessions

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/youtube-caption-extractor.git
   cd youtube-caption-extractor
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build TypeScript project |
| `pnpm start` | Start production server |
| `pnpm test` | Run Playwright tests |

## 🏗️ Project Structure

```
youtube-caption-extractor/
├── src/
│   └── server.ts              # Express server with API endpoints
├── public/
│   ├── index.html             # Frontend interface
│   └── script.js              # Frontend JavaScript logic
├── tests/
│   ├── enhanced-features.spec.ts    # Feature tests
│   ├── mobile-test.spec.ts          # Mobile responsiveness tests
│   └── timestamp-seek.spec.ts       # Timestamp functionality tests
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── playwright.config.ts      # Test configuration
└── README.md                 # This file
```

## 🔧 API Endpoints

### POST `/api/captions`

Extract captions from a YouTube video.

**Request Body:**
```json
{
  "videoInput": "T7M3PpjBZzw",
  "lang": "ru"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Video Title",
    "description": "Video Description",
    "subtitles": [
      {
        "start": "0.24",
        "dur": "5.96",
        "text": "Caption text"
      }
    ],
    "videoId": "T7M3PpjBZzw"
  }
}
```

## 🎮 Usage

1. **Enter a YouTube URL or Video ID**
   - Full URL: `https://www.youtube.com/watch?v=T7M3PpjBZzw`
   - Short URL: `https://youtu.be/T7M3PpjBZzw`
   - Video ID: `T7M3PpjBZzw`

2. **Select Caption Language**
   - Choose from available languages in the dropdown

3. **Extract Captions**
   - Click "Extract Captions" to fetch and display captions

4. **Navigate Video**
   - Click any caption timestamp to seek to that moment
   - Video will automatically start playing at the selected time

5. **Toggle Theme**
   - Use the theme button in the header to switch between light/dark modes

## 🧪 Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

**Install Playwright browsers:**
```bash
npx playwright install
```

**Run all tests:**
```bash
pnpm test
```

**Run specific test suites:**
```bash
# Enhanced features
npx playwright test tests/enhanced-features.spec.ts

# Mobile responsiveness
npx playwright test tests/mobile-test.spec.ts

# Timestamp seeking
npx playwright test tests/timestamp-seek.spec.ts
```

**Run tests with visible browser:**
```bash
npx playwright test --headed
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started

1. **Fork the repository**
   
   Click the "Fork" button on GitHub to create your copy.

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/youtube-caption-extractor.git
   cd youtube-caption-extractor
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

### Development Workflow

1. **Make your changes**
   - Follow the existing code style and patterns
   - Add tests for new functionality
   - Ensure TypeScript types are properly defined

2. **Test your changes**
   ```bash
   # Run all tests
   pnpm test
   
   # Build the project
   pnpm run build
   
   # Test locally
   pnpm run dev
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **JavaScript**: Use modern ES6+ features
- **CSS**: Use Tailwind CSS classes, follow mobile-first approach
- **Tests**: Write comprehensive Playwright tests for new features
- **Commits**: Use conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)

### What to Contribute

- 🐛 **Bug fixes** - Fix issues and edge cases
- ✨ **New features** - Caption export, more languages, video download
- 🎨 **UI/UX improvements** - Better animations, accessibility
- 📱 **Mobile enhancements** - Better touch interactions
- 🧪 **Tests** - Increase test coverage
- 📚 **Documentation** - Improve README, add code comments
- 🔧 **Performance** - Optimize loading times, reduce bundle size

### Reporting Issues

When reporting bugs, please include:
- Operating system and browser version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Console errors (if any)

## 📦 Dependencies

### Main Dependencies
- **express** - Web server framework
- **cors** - Cross-origin resource sharing
- **youtube-caption-extractor** - Caption extraction library

### Development Dependencies
- **typescript** - TypeScript compiler
- **ts-node** - TypeScript execution for Node.js
- **@playwright/test** - End-to-end testing framework
- **@types/** - TypeScript type definitions

## 🔒 Security

- Input validation for YouTube URLs and video IDs
- CORS configuration for API endpoints
- No sensitive data stored or transmitted
- Client-side only theme preferences in localStorage

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

Mobile browsers are fully supported with responsive design.

## 🚀 Deployment

### Production Build

```bash
pnpm run build
pnpm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install pnpm -g && pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](#license) file for details.

### MIT License

```
MIT License

Copyright (c) 2024 YouTube Caption Extractor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- [youtube-caption-extractor](https://www.npmjs.com/package/youtube-caption-extractor) - Caption extraction library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Playwright](https://playwright.dev/) - Testing framework
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) - Video embedding

## 📞 Support

If you encounter any issues or have questions:

1. **Check existing issues** on GitHub
2. **Create a new issue** with detailed information
3. **Join discussions** in the repository

---

Made with ❤️ by the YouTube Caption Extractor team

⭐ **Star this repository** if you find it helpful!