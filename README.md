# AI Caption Studio

A modern, full-stack web application that generates AI-powered social media captions from image descriptions and optional image uploads. Built with React, Express.js, and Hugging Face AI models.

## Features

- **AI-Powered Caption Generation**: Uses Hugging Face DialoGPT model for intelligent caption creation
- **Multiple Tone Options**: Generate captions in witty, poetic, professional, and casual tones
- **Image Upload Support**: Optional image analysis for context-aware captions
- **Real-time Character Counting**: Optimize captions for different social media platforms
- **Smart Hashtag Suggestions**: AI-generated relevant hashtags for better reach
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Dark Mode Support**: Full theme switching with Replit brand colors
- **No API Keys Required**: Uses free Hugging Face inference API with intelligent fallbacks

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for lightweight routing
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **TanStack Query** for state management
- **React Hook Form** with Zod validation
- **Vite** for fast development

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** with PostgreSQL
- **Multer** for file uploads
- **Hugging Face API** for AI generation

### Database
- **PostgreSQL** with Neon Database
- **Drizzle Kit** for migrations
- **Shared schema** between client and server

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use Neon Database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-caption-studio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database connection:
```
DATABASE_URL=your_postgresql_connection_string
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend
│   ├── services/           # Business logic
│   ├── routes.ts           # API routes
│   └── storage.ts          # Data access layer
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and types
└── drizzle.config.ts       # Database configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files

## Features in Detail

### Caption Generation
The app generates captions using Hugging Face's DialoGPT model with intelligent fallbacks:
- **Witty**: Humorous and engaging captions with emojis
- **Poetic**: Artistic and thoughtful captions
- **Professional**: Business-appropriate content
- **Casual**: Relaxed and authentic tone

### Smart Fallbacks
When the Hugging Face API is unavailable, the app uses sophisticated template-based generation that:
- Extracts key words from descriptions
- Applies tone-appropriate language patterns
- Generates contextual hashtags
- Maintains quality and engagement

### Image Processing
- Upload images in common formats (JPEG, PNG, WebP)
- Automatic base64 conversion for AI processing
- File size optimization and validation

## Deployment

### Using Replit
1. Fork this project on Replit
2. Set up your DATABASE_URL in Secrets
3. Run `npm run db:push`
4. Click "Run" to start the application

### Using Vercel/Netlify
1. Connect your GitHub repository
2. Set environment variables in your platform
3. Deploy with automatic builds

### Using Docker
```bash
docker build -t ai-caption-studio .
docker run -p 5000:5000 -e DATABASE_URL=your_url ai-caption-studio
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Replit](https://replit.com) development environment
- AI powered by [Hugging Face](https://huggingface.co) inference API
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)