# VisaMate UI

A modern Next.js application for visa consultation and document management.

## Features

- 🎯 **Student Portal**: Visa application wizard, document upload, status tracking
- 👨‍💼 **Consultant Dashboard**: Case management, client communication
- 🌐 **Multi-language Support**: English, Punjabi, Gujarati, Hindi
- 🔒 **Magic Link Authentication**: Secure 1-click login
- 📱 **Responsive Design**: Mobile-first approach
- 🔌 **Chrome Extension**: Integration with visa portal websites
- ⚡ **Real-time Updates**: WebSocket integration
- 📄 **Document Processing**: PDF handling and verification

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Internationalization**: next-i18next
- **File Upload**: React Dropzone
- **WebSocket**: Reconnecting WebSocket
- **HTTP Client**: Axios

## Project Structure

```
src/
├── app/                     # Next.js App Router
├── features/                # Feature-based modules
├── components/              # Reusable UI components
├── libs/                    # Core libraries (API, WS, i18n)
├── stores/                  # Zustand state stores
├── hooks/                   # Custom React hooks
├── localization/            # Translation files
├── types/                   # TypeScript definitions
└── utils/                   # Utility functions
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Antimatters-Technology/VisaMate-ui.git
   cd VisaMate-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Chrome Extension

The project includes a Chrome extension for enhanced integration:

```bash
cd chrome-extension
npm install
npm run build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary software owned by Antimatters Technology. 