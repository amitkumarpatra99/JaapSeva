# JaapSeva - Digital Mala Counter 📿
> *Ocean Glass Edition v2.0*

![Version](https://img.shields.io/badge/version-2.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)

JaapSeva is a modern, spiritual companion app designed for mantra chanting. Built with a serene "Ocean Glass" aesthetic, it combines ancient tradition with cutting-edge web technology to provide a distraction-free, premium chanting experience.

## ✨ Key Features

- **📿 Digital Mala**: A precise counter that mimics the tactile experience of a physical mala.
- **🎯 Smart Target Setting**: Choose from traditional preset targets (11, 21, 54, 108) or set your own custom goal.
- **💎 Glassmorphism UI**: A stunning, "Ocean Glass" interface with animated ambient backgrounds and glass-like components.
- **🔊 Audio Feedback**: Gentle, soothing chime sounds upon completing a mala (108 beads) or reaching your target.
- **📊 Detailed Statistics**: Track your progress with real-time stats including current streak, total malas completed, and total lifetime chants.
- **📜 Session History**: Automatically logs every session with date, time, and count for your spiritual diary.
- **🔒 Focus Mode**: Lock the controls to prevent accidental resets during deep meditation.
- **📉 Visual Analytics**: Weekly progress charts to visualize your consistency.
- **💾 Persistent Storage**: automatically saves your progress to your device, so you never lose your count.

## 🛠️ Tech Stack

Built with the latest web technologies for performance and beauty:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: Tailwind Animate & CSS Transitions
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & LocalStorage

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/jaapseva.git
   cd jaapseva
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## 📂 Project Structure

```bash
src/
├── app/
│   ├── layout.tsx         # Main layout with font configurations
│   ├── page.tsx           # Main application logic and UI orchestration
│   └── globals.css        # Global styles and Tailwind v4 configurations
├── components/
│   ├── ControlPanel.tsx   # Settings and controls (Glass Capsule)
│   ├── Counter.tsx        # Main interactive counter component
│   ├── StatsDisplay.tsx   # Dashboard for streaks and counts
│   ├── HistoryModal.tsx   # Session history log
│   ├── ConfirmationModal.tsx # Reset confirmation dialog
│   └── WeeklyChart.tsx    # Visual progress chart
├── hooks/
│   ├── useSound.ts        # Audio feedback logic
│   └── useLongPress.ts    # Enhanced interaction hook
└── lib/
    └── utils.ts           # Tailwind class merging utility
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for the spiritual seeker.
</p>
