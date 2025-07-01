# z-control Landing Page

A modern, responsive landing page built with Ionic Angular, showcasing the z-control QR Code application and serving as a central hub for future applications.

## 🌟 Features

- **Modern Design**: Clean, professional interface following Ionic design principles
- **Dark Mode Support**: Automatic light/dark theme switching with proper contrast
- **Mobile Responsive**: Optimized for all devices from mobile to desktop
- **Multi-language Support**: Privacy policies available in German and English
- **Version Management**: Built-in changelog system with user-friendly updates
- **Firebase Ready**: Configured for Firebase hosting and deployment
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🚀 Live Demo

🔗 **[View Live Site](https://your-domain.web.app)** *(Update with your actual domain)*

## 📱 Showcased Applications

### z-control QR Code App
- **Web App**: Try directly in browser without installation
- **Android App**: Available on Google Play Store *(coming soon)*
- **Features**: QR code generation, offline functionality, multi-language support

## 🛠️ Tech Stack

- **Framework**: Ionic 8 with Angular 18
- **Language**: TypeScript
- **Styling**: SCSS with Ionic CSS Variables
- **Hosting**: Firebase Hosting
- **Build Tool**: Angular CLI
- **Icons**: Ionicons

## 📁 Project Structure

```
landing-page/
├── src/
│   ├── app/
│   │   ├── home/              # Main landing page
│   │   ├── privacy/           # Privacy policy system
│   │   ├── services/          # Application services
│   │   └── ui/
│   │       └── components/    # Reusable UI components
│   ├── assets/               # Static assets
│   ├── environments/         # Environment configurations
│   └── theme/               # Global styling
├── docs/                    # Technical documentation
├── firebase.json           # Firebase configuration
└── README.md               # This file
```

## 🏁 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Ionic CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/z-control-landing-page.git
   cd z-control-landing-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Ionic CLI** (if not already installed)
   ```bash
   npm install -g @ionic/cli
   ```

4. **Start development server**
   ```bash
   ionic serve
   ```

5. **Open in browser**
   ```
   http://localhost:8100
   ```

## 🔧 Development

### Available Scripts

```bash
# Development server
ionic serve

# Build for production
ionic build

# Run tests
ng test

# Lint code
ng lint

# Build and preview
ionic build && ionic serve --prod
```

### Environment Configuration

Update version information in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  version: {
    major: 1,
    minor: 1,
    date: '2025-07-01'
  }
};
```

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize project** (first time only)
   ```bash
   firebase init hosting
   ```

4. **Build and deploy**
   ```bash
   ionic build
   firebase deploy
   ```

For detailed deployment instructions, see [docs/FIREBASE_DEPLOYMENT_GUIDE.md](./docs/FIREBASE_DEPLOYMENT_GUIDE.md).

## 🎨 Customization

### Theming

The app uses Ionic CSS Variables for consistent theming. Main theme files:

- `src/theme/variables.scss` - Color definitions
- `src/global.scss` - Global styles
- Component-specific SCSS files for custom styling

### Adding New Content

1. **Update changelog**: Modify `src/services/changelog-simple.service.ts`
2. **Add new apps**: Update home page content and routing
3. **Customize styling**: Use Ionic CSS variables for theme consistency

## 📚 Documentation

Technical documentation is available in the `/docs` folder:

- **[Dark Mode Guide](./docs/IONIC_DARK_MODE_COLOR_GUIDE.md)** - Implementation details for dark mode support
- **[Firebase Security](./docs/FIREBASE_SECURITY.md)** - Security configuration and best practices
- **[Privacy Policy Architecture](./docs/PRIVACY_POLICY_ARCHITECTURE.md)** - Multi-language privacy system details

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e

# Check code coverage
ng test --code-coverage
```

## 📱 Mobile App Development

This landing page showcases the z-control QR Code mobile application. The mobile app development and Google Play Store release is planned as the next phase of this project.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hans Zöchbauer**
- Email: hans.zoechbauer@gmail.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with [Ionic Framework](https://ionicframework.com/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Hosted on [Firebase](https://firebase.google.com/)

## 📊 Project Status

- ✅ Landing Page: Complete and deployed
- ✅ Privacy Policy System: Complete
- ✅ Dark Mode Support: Complete
- ✅ Firebase Hosting: Complete
- 🔄 Mobile App: In development
- 🔄 Google Play Store: Planned

---

**Built with ❤️ using Ionic and Angular**
