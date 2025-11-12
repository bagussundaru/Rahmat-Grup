
# Rahmat Grup - POS System

A modern React-based Point of Sale (POS) system with inventory management, sales dashboard, and transaction tracking.

**Live Demo:** https://rahmat-grup.web.id

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **HTTP Client** - Axios for API requests
- **Icons** - Lucide React icon library
- **Date Utilities** - Date-fns for date manipulation
- **Class Utilities** - CVA and clsx for conditional styling
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm

## 🛠️ Installation

1. Install dependencies:

   ```bash

   npm install

   ```
2. Start the development server:

   ```bash

   npm start

   ```

## 📁 Project Structure

```

├── public/

│   ├── assets/         # Static assets and images

│   ├── manifest.json   # PWA manifest

│   └── robots.txt      # SEO robots file

├── src/

│   ├── components/     # Reusable UI components

│   │   └── ui/         # Base UI components (Button, Input, etc.)

│   ├── pages/          # Page components

│   ├── styles/         # Global styles and Tailwind configuration

│   ├── utils/          # Utility functions

│   ├── App.tsx         # Main application component

│   ├── Routes.tsx      # Application routes

│   └── index.tsx       # Application entry point

├── index.html          # HTML template

├── package.json        # Project dependencies and scripts

├── tailwind.config.js  # Tailwind CSS configuration

├── tsconfig.json       # TypeScript configuration

└── vite.config.ts      # Vite configuration

```

## 🧩 Adding Routes

To add new routes to the application, update the `src/Routes.tsx` file:

```tsx

import React from "react";

import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";

import ErrorBoundary from "components/ErrorBoundary";

// Add your page imports here

import HomePage from "pages/HomePage";

import AboutPage from "pages/AboutPage";


const Routes: React.FC = () => {

  return (

    <BrowserRouter>

      <ErrorBoundary>

        <ScrollToTop />

        <RouterRoutes>

          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />

          {/* Add more routes as needed */}

        </RouterRoutes>

      </ErrorBoundary>

    </BrowserRouter>

  );

};


export default Routes;

```

## 📜 Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm run serve` - Preview the production build locally

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 📦 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Production Deployment

For complete deployment instructions to **rahmat-grup.web.id** on **103.126.116.175**, see [DEPLOYMENT.md](./DEPLOYMENT.md).

#### Quick Deploy (Automated)

```bash
# On your server (with sudo access)
sudo curl -fsSL https://raw.githubusercontent.com/bagussundaru/Rahmat-Grup/main/scripts/deploy.sh | bash
```

#### Manual Deploy

1. **SSH to server:**
   ```bash
   ssh username@103.126.116.175
   ```

2. **Clone and build:**
   ```bash
   sudo mkdir -p /var/www/rahmat-grup
   cd /var/www/rahmat-grup
   sudo git clone https://github.com/bagussundaru/Rahmat-Grup.git source
   cd source
   npm ci && npm run build
   ```

3. **Configure Nginx & SSL:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

#### Automated CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
- Builds on every push to `main`
- Deploys automatically to your server
- Creates backups before deployment
- Verifies Nginx and SSL configuration

**Setup:**
1. Go to Settings → Secrets and variables → Actions
2. Add secrets:
   - `SERVER_HOST`: 103.126.116.175
   - `SERVER_USER`: your SSH username
   - `SERVER_SSH_KEY`: your SSH private key

## 🔐 Security

- HTTPS enforced with Let's Encrypt SSL
- HTTP → HTTPS automatic redirect
- Security headers configured
- Gzip compression enabled
- Static asset caching optimized
- Sensitive data never committed to repo

## 🛠️ Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/bagussundaru/Rahmat-Grup.git
cd Rahmat-Grup

# Install dependencies
npm ci

# Start development server (http://localhost:5173)
npm start

# Build for production
npm run build

# Preview production build
npm run serve
```

### Environment Variables

Copy `.env.example` to `.env.development` and configure:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Rahmat Grup POS
VITE_ENABLE_DEBUG=true
```

See [.env.example](./.env.example) for all options.

## 📊 Pages & Features

- **Sales Dashboard** - Real-time sales metrics and charts
- **POS Cashier** - Point of sale interface with shopping cart
- **Inventory Reports** - Stock levels, movement history, reorder recommendations
- **Product Management** - Add, edit, bulk actions for products
- **Transaction History** - Complete transaction logs with export

## 🙏 Acknowledgments

- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- UI Components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide React](https://lucide.dev)
- Charts from [Recharts](https://recharts.org)
- Data visualization with [D3.js](https://d3js.org)

Built with ❤️ on Rocket.new
