# Combined Events Calculator

A mobile application for calculating points in combined events athletics competitions, including Decathlon, Heptathlon, and Pentathlon. Built with React Native and Expo.

## Features

### Event Calculators

- **Men's Decathlon**: Calculate points for all 10 events
- **Men's Heptathlon**: Calculate points for all 7 events
- **Women's Heptathlon**: Calculate points for all 7 events
- **Women's Pentathlon**: Calculate points for all 5 events

### Key Features

- Real-time point calculation as you input results
- Input validation to prevent unrealistic performances
- Proper formatting for different event types:
  - Time events (e.g., "10.23" for 100m, "2:13.60" for 800m)
  - Field events (e.g., "7.25" for long jump)
- Day 1/Day 2 event organization
- Total score calculation
- Result score comparison with World Athletics standards

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **UI Components**: React Native core components
- **Development**: JavaScript/TypeScript
- **Package Manager**: npm/yarn

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd decathlon-calculator
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Run the app:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press 'a' to open in Android emulator
   - Press 'i' to open in iOS simulator

## Usage

1. Select the event type (Decathlon, Heptathlon, or Pentathlon)
2. Choose between Men's or Women's events
3. Enter your performance for each event
4. View your points and total score
5. Compare your result with World Athletics standards

## Input Format

### Time Events

- Short events (100m, 200m, etc.): "10.23" (seconds.milliseconds)
- Long events (800m, 1500m, etc.): "2:13.60" (minutes:seconds.milliseconds)

### Field Events

- Jumping events: "7.25" (meters)
- Throwing events: "15.54" (meters)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- World Athletics for scoring formulas and standards
- Expo team for the amazing development platform
- React Native community for the excellent documentation and support
