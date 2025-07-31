# Route Optimization Request Retriever

A Single Page Application (SPA) built with Next.js for retrieving route optimization request inputs from the NextBillion route optimization service stored in Google Cloud Storage.

## 🚀 Features

- **Request ID Input**: Simple form to enter route optimization request IDs
- **Google Cloud Storage Integration**: Retrieves input JSON files from GCS bucket
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Real-time Status**: Shows loading states and error handling
- **JSON Export Options**: Copy to clipboard or download as file
- **Secure Authentication**: Uses Google Service Account with minimal permissions

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Cloud Storage**: Google Cloud Storage
- **Authentication**: Google Service Account

## 📋 Prerequisites

- Node.js 18.18.0 or higher
- Google Cloud Project with access to the `nb-optimization-sgp` bucket
- Google Service Account with Storage Object Viewer permissions

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ro-retriever.git
cd ro-retriever
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project-id",...}
```

**See [SETUP.md](./SETUP.md) for detailed environment configuration instructions.**

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Enter a Request ID** in the input field
2. **Click "Retrieve Request Data"** to fetch from Google Cloud Storage
3. **View the JSON data** in a formatted display
4. **Copy to clipboard** or **Download as file** using the action buttons

## 🏗️ Project Structure

```
ro-retriever/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── retrieve-request/
│   │   │       └── route.ts          # Google Cloud Storage API endpoint
│   │   ├── components/
│   │   │   ├── ErrorBoundary.tsx     # Error handling component
│   │   │   └── LoadingSpinner.tsx    # Loading component
│   │   ├── page.tsx                  # Main SPA component
│   │   ├── layout.tsx                # App layout
│   │   └── globals.css               # Global styles
│   └── ...
├── SETUP.md                          # Detailed setup instructions
├── README.md                         # This file
└── package.json                      # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Environment Validation (if scripts exist)
npm run validate-env # Validate Google Cloud credentials
npm run debug-env    # Debug environment variables
npm run fix-env      # Fix environment file format
npm run check-permissions # Check GCS permissions
```

## 🔒 Security

- Environment variables for sensitive credentials
- Service account with minimal required permissions (Storage Object Viewer)
- `.env.local` excluded from version control
- No hardcoded secrets in the codebase

## 🌐 Google Cloud Storage

The application retrieves files from the `nb-optimization-sgp` bucket with the path pattern:
```
gs://nb-optimization-sgp/api-auto-sgp/internal/{requestId}-input.json
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- Check the [SETUP.md](./SETUP.md) for configuration issues
- Review the [Issues](../../issues) page for known problems
- Create a new issue for bugs or feature requests

## 🔄 Version History

- **v1.0.0** - Initial release with Google Cloud Storage integration
- **v1.1.0** - Added JSON download functionality
- **v1.2.0** - Improved UI visibility and error handling
