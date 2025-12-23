# Memory Capsule App

A modern mobile application built with React Native and Expo that allows users to securely store and manage their photos in the cloud. Create your personal digital memory capsule by uploading photos to your private gallery.

## Features

- **User Authentication**: Secure signup and login system powered by Supabase
- **Photo Upload**: Upload photos from your device with progress tracking
- **Gallery View**: Browse all your uploaded photos in a responsive grid layout
- **Dark Mode**: Automatic theme switching based on device settings
- **Cloud Storage**: Secure photo storage using Supabase Storage
- **User Profile**: Personalized home screen with user information

## Tech Stack

- **Frontend Framework**: React Native 0.81.5
- **Runtime**: Expo ~54.0.30
- **Routing**: Expo Router ~6.0.21
- **Backend/Database**: Supabase
- **Language**: TypeScript 5.9.2
- **UI Components**: React Native core components with custom styling

## Key Dependencies

- `@supabase/supabase-js` - Backend integration and authentication
- `expo-image-picker` - Photo selection from device
- `expo-file-system` - File handling and base64 conversion
- `expo-router` - File-based routing system
- `react-native-gesture-handler` - Touch interactions
- `react-native-reanimated` - Smooth animations

## Prerequisites

Before running the app, ensure you have:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Supabase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd memory-capsule-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Configure Supabase:

You'll need to set up the following in your Supabase project:

**Storage Bucket:**
- Create a bucket named `user-uploads`
- Configure appropriate RLS policies

**Database Tables:**
- Create a `photos` table with columns:
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `file_path` (text)
  - `created_at` (timestamp)

## Running the App

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
memory-capsule-app/
├── app/                    # App screens (file-based routing)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Landing/entry screen
│   ├── login.tsx          # Login screen
│   ├── signup.tsx         # Signup screen
│   ├── home.tsx           # Home/dashboard screen
│   ├── upload.tsx         # Photo upload screen
│   ├── gallery.tsx        # Photo gallery screen
│   └── photo/[id].tsx     # Individual photo detail
├── src/
│   └── lib/
│       └── supabase.ts    # Supabase client configuration
├── assets/                # Images, fonts, icons
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project to initial state

## Features in Detail

### Authentication
- Email/password authentication via Supabase Auth
- Session persistence across app restarts
- Protected routes requiring authentication
- User metadata storage (name, email)

### Photo Upload
- Select photos from device library
- Image preview before upload
- Progress indicator during upload
- Base64 encoding for React Native compatibility
- Automatic file path generation
- Error handling with user feedback

### Gallery
- Grid layout with 2 columns
- Lazy loading of images
- Public URL generation for stored images
- Error states for failed image loads
- Empty state when no photos exist

### User Experience
- Dark mode support
- Loading states and spinners
- User-friendly error messages
- Confirmation dialogs for destructive actions
- Keyboard handling and dismissal

## Environment Configuration

The app uses Expo Constants for environment variable management. Configure your Supabase credentials in:

1. `.env` file for local development
2. `app.json` extra field for production builds

## Security Considerations

- Environment variables for sensitive credentials
- Row Level Security (RLS) policies on Supabase
- Authenticated user validation before operations
- Secure file path generation with user ID prefix
- Input validation on authentication forms

## Future Enhancements

- Photo detail view with zoom capability
- Delete photos functionality
- Photo sharing features
- Album organization
- Search and filter capabilities
- Photo metadata (captions, dates, locations)
- Offline support with local caching
- Push notifications
- Social features (comments, likes)

## Troubleshooting

**Image upload fails:**
- Check Supabase storage bucket permissions
- Verify RLS policies allow authenticated uploads
- Ensure environment variables are set correctly

**Authentication issues:**
- Verify Supabase project URL and anon key
- Check email confirmation settings
- Review auth error messages in logs

**App won't start:**
- Clear Metro bundler cache: `npx expo start -c`
- Delete `node_modules` and reinstall
- Verify all peer dependencies are installed

## Contributing

This project is currently in development. Contributions, issues, and feature requests are welcome.

## License

This project is private and proprietary.

## Support

For questions or issues, please open an issue in the repository.

---

Built with React Native, Expo, and Supabase
