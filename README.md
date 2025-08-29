# 🏥 LifeTrack - Personal Health Records Management System

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://lifetrackbackend-production.up.railway.app)
[![Mobile](https://img.shields.io/badge/mobile-android%20apk-blue)](#mobile-app)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

## 🌟 Overview

LifeTrack is a comprehensive Personal Health Records (PHR) management system that helps users track their health data, manage doctor visits, monitor treatments, and maintain a complete health history. Built with modern web technologies and available as both web and mobile applications.

## ✨ Features

### 🔐 **User Management**
- Secure user registration and authentication
- Personal profile management
- Data privacy and security

### 👨‍⚕️ **Doctor Management**
- Add and manage healthcare providers
- Track doctor specialties and contact information
- Visit history and appointment tracking

### 📋 **Health Records**
- Comprehensive health record creation and management
- Medical history tracking
- Symptoms and diagnosis recording
- File attachments and notes

### 💊 **Treatment Tracking**
- Medication management
- Treatment plans and protocols
- Progress monitoring
- Dosage and schedule tracking

### 📊 **Analytics Dashboard**
- Health trends and insights
- Visual data representations
- Advanced data structures for analytics
- Personalized health recommendations

### 📱 **Cross-Platform Availability**
- Responsive web application
- Native Android APK
- Progressive Web App (PWA) capabilities

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite with advanced data structures
- **Deployment**: Railway Cloud Platform
- **API**: RESTful APIs with CORS support
- **Data Structures**: Hash tables, trees, graphs for analytics

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM
- **Styling**: Custom CSS with responsive design
- **HTTP Client**: Axios
- **Mobile**: Capacitor for native app conversion

### Mobile
- **Platform**: Android APK
- **Framework**: Capacitor 7.4.3
- **Features**: Native mobile experience
- **Distribution**: Direct APK installation

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 14+ (for frontend)
- Android Studio (for mobile development)

### 🔧 Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize the database:
   ```bash
   python app.py
   ```

4. The backend will be available at `http://localhost:5000`

### 💻 Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser

### 📱 Mobile App Setup
1. Build the React app:
   ```bash
   npm run build:mobile
   ```

2. Open Android project:
   ```bash
   npm run android:build
   ```

3. Build APK in Android Studio or use:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

## 🌐 Live Demo

- **Backend API**: [https://lifetrackbackend-production.up.railway.app](https://lifetrackbackend-production.up.railway.app)
- **Web Application**: Deploy the frontend to your preferred hosting service
- **Mobile App**: Install the APK from `frontend/android/app/build/outputs/apk/debug/`

## 📁 Project Structure

```
lifetrack/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── data_structures.py     # Advanced data structures for analytics
│   ├── requirements.txt       # Python dependencies
│   ├── phr_database.sql      # Database schema
│   ├── Procfile              # Railway deployment config
│   └── railway.json          # Railway settings
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── android/             # Capacitor Android project
│   ├── capacitor.config.ts  # Mobile app configuration
│   └── package.json         # Node.js dependencies
├── README.md                # Project documentation
└── LICENSE                 # MIT License
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add doctor
- `PUT /api/doctors/<id>` - Update doctor
- `DELETE /api/doctors/<id>` - Delete doctor

### Health Records
- `GET /api/health-records` - Get all records
- `POST /api/health-records` - Create record
- `PUT /api/health-records/<id>` - Update record
- `DELETE /api/health-records/<id>` - Delete record

### Treatments
- `GET /api/treatments` - Get all treatments
- `POST /api/treatments` - Create treatment
- `PUT /api/treatments/<id>` - Update treatment
- `DELETE /api/treatments/<id>` - Delete treatment

## 📱 Mobile App Features

- **Responsive Design**: Optimized for all screen sizes (320px to tablets)
- **Touch-Friendly**: 44px+ touch targets, smooth scrolling
- **Native Feel**: Status bar styling, splash screen, keyboard handling
- **Offline Ready**: Local storage and caching capabilities
- **Performance Optimized**: Hardware acceleration, reduced animations

## 🚀 Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables if needed
3. Deploy automatically from the main branch

### Frontend (Netlify/Vercel)
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure API URLs for production

### Mobile App
1. Build release APK: `./gradlew assembleRelease`
2. Sign the APK for distribution
3. Distribute via APK file or publish to Google Play Store

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest  # If tests are added
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the provided test scripts or tools like Postman to test API endpoints.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Achievements

- ✅ **Full-Stack Development**: Complete web application with backend and frontend
- ✅ **Cloud Deployment**: Live backend on Railway cloud platform
- ✅ **Mobile App**: Native Android APK with responsive design
- ✅ **Advanced Features**: Data structures, analytics, and health insights
- ✅ **Production Ready**: Optimized, tested, and deployment-ready

## 🔮 Future Enhancements

- [ ] iOS app development
- [ ] Advanced analytics and AI insights
- [ ] Integration with wearable devices
- [ ] Telemedicine features
- [ ] Multi-language support
- [ ] Advanced security features

## 📞 Support

For support, questions, or contributions, please:
- Create an issue in this repository
- Contact the development team
- Check the documentation

---

**Made with ❤️ for better health management**

*LifeTrack - Your Personal Health Companion*
