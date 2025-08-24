# Xera - Expo Social Media App

Xera is a modern social media app built with [Expo](https://expo.dev/), [Supabase](https://supabase.com/), [NativeWind](https://www.nativewind.dev/), and [Lottie](https://lottiefiles.com/). It features user authentication, posts with images and videos, animated UI, and a real-time community experience.

## Demo-Video


https://github.com/user-attachments/assets/4c6a8431-5980-4a3d-87e4-6e3b9cc447e1



## Features

- **User Authentication:** Secure login and signup powered by Supabase.
- **Create & View Posts:** Share images, videos, and captions with the community.
- **Video Section:** Watch and interact with user-uploaded videos.
- **Animated UI:** Beautiful loading and welcome screens using Lottie animations.
- **Responsive Design:** Styled with NativeWind for a modern look.
- **Follow System:** Connect with other users, see followers and following.
- **Profile Pages:** View and share user profiles.
- **Search & Filter:** Find posts and users easily.

## Tech Stack

- **Expo:** React Native framework for fast development.
- **Supabase:** Backend for authentication, database, and storage.
- **NativeWind:** Utility-first styling for React Native.
- **Lottie:** Rich animations for loading and onboarding.

## Getting Started

1. **Clone the repo:**
   ```
   git clone https://github.com/yourusername/xera.git
   cd xera
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the app:**
   ```
   npm start
   ```
   Or for tunnel mode:
   ```
   npm start -- --tunnel
   ```

4. **Configure Supabase:**
   - Add your Supabase URL and anon key to the project config.

5. **Run on device:**
   - Scan the QR code with Expo Go or use an emulator.

## Folder Structure

- `/app` - Main app screens and components
- `/assets` - Images, Lottie animations, etc.
- `/components` - Reusable UI components

## Customization

- **Animations:** Replace Lottie JSON files in `/assets/animations` for custom loaders or onboarding.
- **Styling:** Edit NativeWind classes for your own look and feel.
- **Backend:** Update Supabase tables for more features (comments, likes, etc).

## License

MIT

---

Made with ❤️ using Expo, Supabase, NativeWind,
