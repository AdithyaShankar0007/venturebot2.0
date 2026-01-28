# VentureBot - AI Startup Ideas Chatbot

An interactive chatbot powered by AI to help entrepreneurs explore startup ideas and validate their concepts.

## Features

- 💬 Real-time AI chat interface
- 🚀 Startup idea generation and refinement
- 💾 Save and manage your ideas
- 🔐 User authentication with Supabase
- 🎨 Modern UI with shadcn/ui components
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **State Management**: React Query + React Router
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v16+) or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/venturebot.git

# Navigate to project directory
cd venturebot

# Install dependencies
npm install
# or with bun
bun install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
npm run preview
```

## Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/       # React components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── integrations/    # External service integrations
└── styles/          # Global styles

supabase/
├── migrations/      # Database migrations
└── functions/       # Edge functions
```

## License

MIT
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
