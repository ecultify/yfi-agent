# YFI Voice Agent

A secure Next.js application with AI voice agent integration using Vapi WebRTC.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🎤 Real-time voice communication with Vapi WebRTC
- 🔒 Built with security best practices (protected against React2Shell vulnerability)
- 🧩 shadcn/ui component library
- ⚡ Next.js 15 with App Router
- 📱 Mobile-friendly design

## Security Measures

This application is built with the following security measures to protect against the React2Shell vulnerability (CVE-2025-55182):

1. **Updated Dependencies**: Uses React 19.0.0+ and Next.js 15.1.0+ which include patches for the vulnerability
2. **Input Sanitization**: All user inputs are sanitized to prevent injection attacks
3. **Type Safety**: TypeScript is used throughout for type-safe code
4. **Environment Variables**: Sensitive data is stored in environment variables
5. **CSP Ready**: Content Security Policy can be easily implemented in next.config.ts

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Vapi account (sign up at https://vapi.ai)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Add your Vapi credentials to `.env.local`:

```env
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
yfi-agent/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page with voice agent trigger
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   └── dialog.tsx
│   │   └── VoiceAgentModal.tsx # Voice agent modal component
│   ├── hooks/
│   │   └── useVapi.ts          # Vapi WebRTC hook
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── .env.local.example          # Environment variables template
└── package.json
```

## Vapi Integration

The application uses the `@vapi-ai/web` SDK for WebRTC voice communication. The main integration is in:

- `src/hooks/useVapi.ts`: Custom React hook for managing Vapi sessions
- `src/components/VoiceAgentModal.tsx`: Modal UI for voice interactions

### Key Features

- **Session Management**: Start and end voice calls
- **Mute Control**: Toggle microphone on/off
- **Status Updates**: Real-time call status and AI speech indicators
- **Error Handling**: Graceful error handling with user feedback

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
