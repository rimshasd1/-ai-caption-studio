# AI Caption Studio

## Overview

AI Caption Studio is a full-stack web application that generates AI-powered social media captions from image descriptions and optional image uploads. The application uses React for the frontend, Express.js for the backend, and integrates with OpenAI's GPT-4o model to generate contextually relevant captions in multiple tones.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Use Replit's brand colors and design system.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Uploads**: Multer middleware for handling multipart form data
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Definition**: Shared schema definitions between client and server
- **Storage**: Currently using in-memory storage with interface for easy database migration
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Core Features
1. **Caption Generation**: AI-powered caption creation using OpenAI GPT-4o
2. **Image Upload**: Optional image analysis for context-aware captions
3. **Multiple Tones**: Support for witty, poetic, professional, and casual tones
4. **Character Counting**: Real-time character count for social media optimization
5. **Hashtag Suggestions**: AI-generated relevant hashtags

### UI Components
- **CaptionGenerator**: Main form component for caption requests
- **Hero**: Landing page hero section with feature highlights
- **Examples**: Showcase section demonstrating caption variations
- **Header/Footer**: Navigation and branding components

### Backend Services
- **OpenAI Integration**: Service layer for AI caption generation
- **File Upload Handler**: Multer configuration for image processing
- **Storage Interface**: Abstracted storage layer for easy database switching

## Data Flow

1. **User Input**: User provides description, selects tones, and optionally uploads image
2. **Form Validation**: Client-side validation using Zod schemas
3. **API Request**: FormData submission to `/api/captions/generate` endpoint
4. **Image Processing**: Server converts uploaded images to base64 for AI processing
5. **AI Generation**: Hugging Face DialoGPT processes description to generate captions with fallback templates
6. **Response Formatting**: Results formatted with tone, text, character count, and hashtags
7. **UI Display**: Generated captions displayed with copy/export functionality

## External Dependencies

### AI Services
- **Hugging Face API**: Microsoft DialoGPT-medium model for caption generation via free inference API
- **Fallback Generation**: Smart template-based caption generation when API is unavailable
- **No API Keys Required**: Uses Hugging Face's free public inference endpoint

### UI Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography
- **React Icons**: Additional icon sets for social media branding

### Design System
- **Color Palette**: Replit brand colors (purple, orange, blue, green, yellow)
- **Typography**: IBM Plex Sans font family for consistent branding
- **Primary Colors**: Purple (#A855F7) and Orange (#FF8A4C) gradients
- **Dark Mode**: Full support with Replit-themed color variations

### Development Tools
- **Replit Integration**: Custom plugins for development environment optimization
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with HMR for React components
- **API Development**: Express server with nodemon-like reloading via tsx
- **Environment Variables**: Separate configuration for development and production

### Production Build
- **Client Build**: Vite optimized build output to `dist/public`
- **Server Build**: ESBuild bundle for Node.js deployment
- **Static Serving**: Express serves built React app for production

### Database Migration
- **Current State**: In-memory storage for development
- **Migration Path**: Drizzle ORM configured for PostgreSQL deployment
- **Schema Management**: Version-controlled migrations via Drizzle Kit

### Environment Configuration
- **Database**: PostgreSQL with Neon Database serverless driver
- **AI Service**: Hugging Face free inference API with intelligent fallbacks
- **Build Process**: Single command build for both client and server