# PointMe Platform

A comprehensive service booking platform that connects customers with local service providers across South Africa.

## 🚀 Features

### For Customers
- Browse and search for local services
- Book appointments with service providers
- Real-time booking management
- Secure payment processing
- Service reviews and ratings

### For Service Providers
- Business profile management
- Service offering creation
- Booking management dashboard
- Revenue tracking
- Customer communication tools

### For Administrators
- Business approval system
- Platform analytics
- User management
- Service category management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with Supabase
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pointme-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PointMe Platform
```

### 4. Database Setup
Run the SQL schema in your Supabase project:
```sql
-- See SUPABASE_SCHEMA.sql for complete database schema
```

### 5. Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
pointme-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── business/          # Business dashboard
│   ├── dashboard/         # Customer dashboard
│   ├── services/          # Service pages
│   └── ...
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── public/                # Static assets
└── ...
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## 🔐 Authentication

The platform uses a custom authentication system with Supabase:

- **Registration**: User registration with role selection
- **Login**: Email/password authentication
- **Password Reset**: Forgot password functionality
- **Session Management**: Local storage with middleware protection

## 📊 Database Schema

The application uses the following main tables:

- `users` - User accounts and profiles
- `businesses` - Service provider information
- `services` - Service offerings
- `bookings` - Customer bookings
- `commissions` - Platform commission tracking

## 🎨 UI Components

Built with:
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Custom Components** - Platform-specific UI elements

## 🔒 Security Features

- Environment variable protection
- API route authentication
- Middleware-based route protection
- Input validation and sanitization
- Secure password handling

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@pointme.com
- Phone: +27 11 123 4567

## 🚀 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Advanced search filters

---

**PointMe Platform** - Connecting customers with trusted local service professionals across South Africa.
