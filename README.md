# 🔑 KeyNest - API Key Management Platform

A modern, secure platform for managing API keys, projects, and team collaboration built with Next.js 15, Firebase, and Tailwind CSS. KeyNest helps developers and teams securely store, organize, and manage their API credentials while providing powerful collaboration tools and analytics insights.

## ✨ Features

- 🔐 **Secure Authentication** - Google OAuth integration with Firebase Auth
- 🏢 **Workspace Management** - Organize projects and teams in isolated workspaces
- 🔑 **API Key Management** - Secure storage and organization of API credentials
- 👥 **Team Collaboration** - Invite team members and manage permissions
- 📊 **Analytics Dashboard** - Monitor API usage and performance metrics
- 🎨 **Modern UI** - Beautiful, responsive design with Radix UI components
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🌙 **Dark/Light Mode** - Theme switching with next-themes
- 🔒 **Security First** - User isolation and Firestore security rules

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) - Latest React framework with server-side rendering
- **Language**: TypeScript - Type-safe development with enhanced IDE support
- **Styling**: Tailwind CSS 4 - Utility-first CSS framework for rapid UI development
- **UI Components**: Radix UI + shadcn/ui - Accessible, customizable component library
- **Backend**: Firebase (Firestore, Auth) - Scalable cloud infrastructure
- **Authentication**: Google OAuth - Secure, one-click authentication
- **Forms**: React Hook Form + Zod validation - Performant forms with schema validation
- **State Management**: React Context + Hooks - Modern React state management
- **Charts**: Recharts - Beautiful, responsive chart components
- **Icons**: Lucide React - Consistent, customizable icon library

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase project
- Google OAuth credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd new-api-main
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp env-template.txt .env.local
   
   # Edit .env.local with your Firebase credentials
   ```

4. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google sign-in)
   - Create a Firestore database
   - Copy your Firebase config to `.env.local`

5. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

## 🎯 **What Can You Do With KeyNest?**

### **For Individual Developers:**
- 🔑 **Secure API Key Storage** - Store all your API keys in one secure location
- 📁 **Project Organization** - Group related API keys by project or service
- 🔍 **Quick Access** - Find any API key instantly with search and filtering
- 📊 **Usage Tracking** - Monitor API usage and performance metrics
- 🔒 **Encrypted Storage** - Your keys are encrypted and isolated from other users

### **For Teams & Organizations:**
- 👥 **Team Collaboration** - Invite team members to shared workspaces
- 🏢 **Workspace Management** - Organize projects and teams in isolated environments
- 🔐 **Permission Control** - Manage who can access which API keys
- 📈 **Team Analytics** - Track team-wide API usage and costs
- 🔄 **Key Rotation** - Schedule and manage API key updates

### **For DevOps & Security Teams:**
- 🚨 **Security Monitoring** - Track API key usage and detect anomalies
- 📋 **Audit Logs** - Complete history of all key access and changes
- 🔒 **Compliance** - Meet security requirements with proper key management
- 🚀 **Automation** - Integrate with CI/CD pipelines for key management

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id


```

## 🏗️ Project Structure

```
new-api-main/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── auth-wrapper.tsx  # Authentication wrapper
│   └── theme-provider.tsx # Theme management
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── auth.ts           # Authentication utilities
│   └── firestore.ts      # Firestore operations
├── hooks/                # Custom React hooks
└── styles/               # Global styles
```

## 🔐 Security Features

- **User Isolation**: Each user's data is completely isolated and encrypted
- **Workspace Boundaries**: Projects and teams are contained within secure, isolated environments
- **Firestore Rules**: Comprehensive security rules prevent unauthorized access and data leakage
- **Environment Variables**: Sensitive data stored securely in environment configuration
- **Authentication Required**: All data access requires valid Google OAuth authentication
- **Data Encryption**: API keys are encrypted at rest and in transit
- **Audit Logging**: Complete tracking of all access and modification attempts
- **Rate Limiting**: Protection against brute force and abuse attempts

## 📱 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm dev:fast        # Start with turbo mode

# Production
pnpm build           # Build for production
pnpm start           # Start production server

# Code Quality
pnpm lint            # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
4. Enjoy global CDN and automatic HTTPS

### Other Platforms
- **Netlify**: Add environment variables in site settings, great for static sites
- **Railway**: Configure environment variables in dashboard, excellent for full-stack apps
- **Self-hosted**: Set environment variables on your server for complete control
- **Docker**: Containerize the application for consistent deployment across environments

## 🌐 **Production Considerations**

### **Environment Setup:**
- Use production Firebase project (separate from development)
- Configure custom domain and SSL certificates
- Set up monitoring and error tracking (e.g., Sentry)
- Enable Firebase Analytics for usage insights

### **Performance Optimization:**
- Enable Next.js Image Optimization
- Configure Firebase CDN for global performance
- Implement proper caching strategies
- Monitor Core Web Vitals and performance metrics

## 🔒 Security Best Practices

- ✅ Never commit `.env.local` files
- ✅ Use environment variables for all sensitive data
- ✅ Keep Firebase API keys secure
- ✅ Regularly review Firestore security rules
- ✅ Monitor Firebase usage for suspicious activity

## 📚 Documentation

- [Firebase Setup Guide](README_FIREBASE_SETUP.md) - Complete Firebase configuration walkthrough
- [Security Guide](SECURITY_GUIDE.md) - Security best practices and implementation details
- [API Key Isolation](API_KEY_ISOLATION_ENHANCEMENT.md) - How API keys are isolated and secured
- [User Isolation Implementation](USER_ISOLATION_IMPLEMENTATION.md) - User data isolation architecture

- [Firestore Rules](firestore.rules) - Database security rules and permissions

## 🚀 **Getting Started Guide**

### **1. First Time Setup**
1. Sign in with your Google account
2. Create your first workspace
3. Add your first project
4. Store your first API key

### **2. Daily Usage**
- Access your dashboard to view all projects
- Use the search function to find specific API keys
- Monitor usage analytics and costs
- Invite team members to collaborate

### **3. Advanced Features**
- Set up automated key rotation schedules
- Configure webhook notifications
- Integrate with your development workflow
- Export data for compliance reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Documentation**: Check the guides in the project root for detailed setup instructions
- **Firebase Help**: [Firebase Documentation](https://firebase.google.com/docs) for backend configuration
- **Next.js Help**: [Next.js Documentation](https://nextjs.org/docs) for framework-specific questions
- **Community**: Join our community discussions for tips and best practices

## 🔧 **Troubleshooting Common Issues**

### **Authentication Problems:**
- Ensure Google OAuth is enabled in Firebase Console
- Check that your domain is authorized in Firebase settings
- Verify environment variables are correctly set

### **Database Issues:**
- Confirm Firestore rules are properly configured
- Check Firebase project permissions and billing status
- Verify database indexes are created for complex queries

### **Build/Deployment Issues:**
- Ensure all environment variables are set in deployment platform
- Check Node.js version compatibility (18+ required)
- Verify Firebase project ID matches across environments

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

**⭐ Star this repository if you find it helpful!**
