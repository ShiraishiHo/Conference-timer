# Minimalist Conference Timer

A professional, high-contrast timer designed specifically for iPad/iPhone, perfect for academic conferences, presentations, and workshops.

## ✨ Key Features

- **Minimalist Visual Design**: Pure black background with extra-large typography ensures the speaker can see the remaining time clearly from a distance.
- **Smart Chime Alerts**:
  - **3 Minutes Remaining**: 1 chime (Early warning).
  - **1 Minute Remaining**: 2 chimes (Final warning).
  - **Time's Up (00:00)**: 3 chimes (Session end).
- **Dynamic Color Warnings**:
  - **Normal State**: White text.
  - **1 Minute Remaining**: Text turns **Yellow**.
  - **10 Seconds & Overtime**: Text turns **Red**.
- **Interactive Feedback**:
  - **Haptic Feedback**: Subtle vibration on button clicks (on supported devices).
  - **Click Sounds**: Crisp, synthesized audio feedback for all interactions.
- **Always-On Screen**: Uses the Screen Wake Lock API to prevent the iPad from sleeping during an active session.
- **Offline Ready (PWA)**: Install to your home screen for a full-screen, offline-capable app experience.

## 🚀 Quick Start

### Installation on iPad/iPhone
1. Open the app link in **Safari**.
2. Tap the **Share** icon (square with an arrow pointing up).
3. Scroll down and select **"Add to Home Screen"**.
4. Launch it from your home screen for a distraction-free, full-screen experience.

## 🛠 Technical Details

- **Web Audio API**: All chimes and click sounds are synthesized in real-time. No audio files are loaded, ensuring zero latency and a tiny footprint.
- **PWA (Progressive Web App)**: Includes a Web Manifest and Service Worker for offline caching and standalone mode.
- **Wake Lock API**: Automatically requests a screen wake lock when the timer starts to keep the display active.

## 📝 Instructions

1. **Set Time**: Use the `+` and `-` buttons to adjust minutes and seconds, or use the quick presets (5m, 10m, etc.).
2. **Start**: Tap `START` to enter the timer screen.
3. **Pause/Resume**: Tap anywhere on the timer screen to toggle pause.
4. **Reset**: Tap `RESET` at the bottom to return to the setup screen.

---

*Built with AI Studio for the purest timing experience.*
