# Academic Platform Frontend

Modern Next.js frontend application for the Academic Platform - a comprehensive web application for searching and comparing academic institutions and careers.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation & Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## 🛠️ Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:e2e` - Run Playwright E2E tests
- `pnpm test:e2e:ui` - Run E2E tests with UI
- `pnpm analyze` - Analyze bundle size

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── institutions/   # Institutions pages
│   ├── careers/        # Careers pages
│   ├── search/         # Search pages
│   └── auth/           # Authentication pages
├── components/         # React components
│   ├── ui/             # Reusable UI components
│   ├── forms/          # Form components
│   ├── sections/       # Page sections
│   ├── layout/         # Layout components
│   └── providers.tsx   # App providers
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── utils/              # Utility functions
├── types/              # TypeScript types
├── config/             # Configuration files
└── styles/             # CSS styles
```

## 🎨 Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations

### State Management
- **TanStack Query** - Server state management
- **Zustand** - Client state management

### UI Components
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Next Themes** - Theme switching

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **Bundle Analyzer** - Bundle analysis

## 🎯 Key Features

### 🏠 Homepage
- Hero section with search functionality
- Featured institutions and careers
- Statistics and testimonials
- Responsive design

### 🔍 Search & Discovery
- Advanced search with filters
- Real-time search suggestions
- Faceted search (location, type, etc.)
- Search result pagination

### 🏛️ Institution Pages
- Detailed institution profiles
- Career listings
- Reviews and ratings
- Comparison functionality

### 📚 Career Pages
- Career information and requirements
- Institution offerings
- Salary data and job prospects
- Related careers

### 🔐 Authentication
- User registration and login
- Profile management
- Saved searches and favorites
- Comparison history

### 📊 Comparison Tool
- Side-by-side comparisons
- Custom comparison criteria
- Export comparison results
- Share comparisons

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `http://localhost:3000` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `false` |
| `NEXT_PUBLIC_MAPS_API_KEY` | Google Maps API key | - |

## 🎨 Styling

### Design System
- **Colors**: Primary, secondary, success, warning, error palettes
- **Typography**: Inter font family with responsive sizes
- **Spacing**: Consistent spacing scale
- **Shadows**: Subtle depth and elevation
- **Border Radius**: Consistent rounded corners

### Components
- All components follow the design system
- Consistent hover and focus states
- Dark mode support
- Responsive design patterns

### Animations
- Framer Motion for complex animations
- CSS transitions for simple interactions
- Loading states and skeletons
- Page transitions

## 🧪 Testing

### Unit Testing (Jest)
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test components/SearchBar

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### E2E Testing (Playwright)
```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run specific test
pnpm test:e2e tests/search.spec.ts
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large screens**: 1920px+

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## ⚡ Performance

### Optimization Techniques
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Component and route lazy loading
- **Caching**: Aggressive caching strategies

### Core Web Vitals
- **LCP**: Optimized with priority loading
- **FID**: Minimal JavaScript execution time
- **CLS**: Stable layouts with skeleton loaders

## 🚀 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Docker
```bash
docker build -t academic-platform-frontend .
docker run -p 3000:3000 academic-platform-frontend
```

## 🔧 Development

### Adding New Pages
1. Create page in `src/app/`
2. Add to navigation if needed
3. Create necessary components
4. Add tests

### Creating Components
1. Use TypeScript for all components
2. Follow naming conventions
3. Add proper props typing
4. Include JSDoc comments

### State Management
- Use TanStack Query for server state
- Use Zustand for client state
- Keep state as close as possible to where it's used

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation
4. Run linting and type checking before commits
5. Use conventional commit messages

### Code Style
- Use TypeScript for all files
- Follow ESLint and Prettier rules
- Use meaningful variable and function names
- Write self-documenting code

## 📄 License

MIT License - see LICENSE file for details
