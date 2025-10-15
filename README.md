# NSUT Club Connect App

**Enactus Tech Project Round 2: [Your Name], [Your Roll Number]**

## 📱 Project Overview

NSUT Club Connect is a mobile application designed to help students discover and engage with various clubs and societies at Netaji Subhas University of Technology (NSUT). The app provides a centralized platform for students to explore clubs, view upcoming events, register for activities, and stay connected with campus life.

## 🚀 Features

### Core Features
- **🔐 User Authentication** - Secure login/signup with Firebase Authentication
- **🏛️ Club Directory** - Browse all NSUT clubs with logos and descriptions
- **📋 Club Details** - View detailed information, events, and contact details for each club
- **📅 Event Calendar** - Day-wise view of upcoming events from all clubs
- **🎫 Event Registration** - Register for events via in-app forms or external links
- **⭐ Saved Events** - Bookmark events for quick access
- **ℹ️ About Section** - App information and NSUT social links

### Optional Features
- **🔍 Search & Filtering** - Find clubs by name or category
- **💬 Real-time Chat** - Communication between club members
- **📱 Push Notifications** - Event reminders and updates

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native (Expo) |
| **Backend** | Firebase (Authentication + Firestore + Storage) |
| **Navigation** | React Navigation |
| **UI Library** | React Native Paper |
| **Local Storage** | Async Storage |
| **State Management** | React Context API |

## 📁 Project Structure

```
nsut-club-connect/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   │   ├── Auth/           # Authentication screens
│   │   └── Main/           # Main app screens
│   ├── navigation/         # Navigation configuration
│   ├── config/             # Firebase configuration
│   ├── context/            # React Context for state management
│   ├── services/           # Firebase service functions
│   ├── utils/              # Helper functions and constants
│   └── assets/             # Images, icons, and other assets
├── App.js                  # Main app component
└── app.json               # Expo configuration
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (LTS version)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nsut-club-connect.git
   cd nsut-club-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage (optional, for club logos)
   - Copy your Firebase config and update `src/config/firebaseConfig.js`

4. **Run the app**
   ```bash
   npx expo start
   ```
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Ensure your phone and computer are on the same network

## 🔧 Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add Project" and name it "nsut-club-connect"
   - Follow the setup wizard

2. **Enable Services**
   - **Authentication**: Enable "Email/Password" sign-in method
   - **Firestore Database**: Create database in test mode
   - **Storage**: Create storage bucket (optional)

3. **Update Configuration**
   Replace the placeholder values in `src/config/firebaseConfig.js`:

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

## 📱 Building APK

### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   npx eas login
   ```

3. **Configure Build**
   ```bash
   npx eas build:configure
   ```

4. **Build APK**
   ```bash
   npx eas build -p android --profile preview
   ```

### Using Expo Build (Legacy)
```bash
npx expo build:android
```

## 📦 Deliverables

- ✅ **Working Mobile App** with all core features
- ✅ **GitHub Repository** with complete source code
- ✅ **APK File** for Android installation
- ✅ **Demo Video/Screenshots** showcasing functionality
- ✅ **Firebase Integration** for authentication and data storage


## 👨‍💻 Development Phases

### Phase 1: Setup & Authentication
- Project initialization and dependency installation
- Firebase configuration and setup
- Login/Register screens with Firebase Auth

### Phase 2: Club Directory & Details
- Firestore database structure for clubs and events
- Club listing with search and filtering
- Club detail pages with event information

### Phase 3: Event Management
- Event calendar with day-wise organization
- Event registration system
- Saved events with local storage

### Phase 4: Polish & Deployment
- UI/UX improvements and theming
- Testing and bug fixes
- APK generation and deployment

## 🤝 Contributing

This project was developed as part of Enactus NSUT Tech Round 2. For contributions or suggestions, please contact the developer.

## 📄 License

This project is developed for educational purposes as part of the Enactus NSUT technical evaluation.

## 🙏 Acknowledgments

- **Enactus NSUT** for the project opportunity
- **NSUT** for supporting student innovation
- **Firebase** for providing the backend infrastructure
- **Expo** for simplifying React Native development

---

**Built with ❤️ for NSUT Students**