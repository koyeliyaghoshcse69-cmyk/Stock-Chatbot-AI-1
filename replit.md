# StockAI - Finance Chat Application

## Overview

StockAI is a conversational AI application focused on stocks, finance, and market analysis. It provides a chat interface where users can ask questions about Indian stock markets, market conditions, and financial news. The application uses Groq's LLM API for AI responses and stores conversation history in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme (finance-themed with emerald accents)
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express.js (v5) running on Node.js with TypeScript
- **API Design**: REST API with typed route definitions in `shared/routes.ts` using Zod schemas
- **AI Integration**: Groq API via OpenAI-compatible client for LLM responses
- **Build**: esbuild for production server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines database tables
- **Migrations**: Managed via `drizzle-kit push` command
- **Connection**: Uses `DATABASE_URL` environment variable

### Key Design Patterns
- **Shared Types**: Database schemas and API route definitions are shared between client and server via the `shared/` directory
- **Type-safe API**: Zod schemas validate both request inputs and response outputs
- **Optimistic Updates**: React Query mutations update cache optimistically for better UX

## External Dependencies

### AI/LLM Service
- **Groq API**: Used for chat completions via OpenAI-compatible endpoint
- **Environment Variable**: `GROQ_API_KEY` required
- **Note**: The model `llama3-8b-8192` shown in logs is deprecated; update to a current Groq model

### Database
- **PostgreSQL**: Required for message persistence
- **Environment Variable**: `DATABASE_URL` required
- **Session Storage**: connect-pg-simple available for session management

### Third-Party Libraries
- **react-markdown**: Renders AI responses with markdown formatting
- **date-fns**: Formats timestamps in chat messages
- **Radix UI**: Provides accessible UI primitives for all components