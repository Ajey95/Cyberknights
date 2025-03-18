# Event Name
# IETE CLUB AMRITA WEB-DEV
# CYBER KNIGHTS
# TypeSymphony

TypeSymphony is a culturally immersive typing application featuring Indian storytelling elements, Holi color effects, and an engaging user experience to improve typing skills.

![image](https://github.com/user-attachments/assets/31933539-52d7-4722-bbe9-4d7bdacf3b0e)
![image](https://github.com/user-attachments/assets/494e3fe4-c5f4-4ac8-a5f0-dc03724a36a1)
![image](https://github.com/user-attachments/assets/8a71df5f-97db-4082-aab6-940981535386)
![image](https://github.com/user-attachments/assets/9e2b9ddd-8fab-46d0-bfec-3d85152ea79c)
![image](https://github.com/user-attachments/assets/4763008b-9733-4e1b-8f5c-a68f57e4b749)






## Features

### Core Features
- *Interactive Typing System*: Character-by-character matching with real-time visual feedback
- *Indian Cultural Elements*: Traditional aesthetics, Holi-inspired color effects, and folk tales
- *Engaging Storytelling*: Progress through scenes as you complete typing challenges
- *Performance Metrics*: Track WPM (Words Per Minute) and accuracy
- *User Accounts*: Create profiles to save your progress and compete on leaderboards

### Visual Elements
- Particle system with Holi-inspired colors
- Animated backgrounds with parallax effects
- Ancient Indian manuscript-inspired UI
- Responsive design for all device sizes

### Technical Features
- Client-side user authentication with localStorage
- Reusable React components
- Context API for state management
- Custom hooks for sound and animations
- GitHub Pages deployment ready

## Demo

Visit [TypeSymphony Live Demo]((https://cyberknights-3oyc6rpxq-ajeyas-projects-ac1f8c11.vercel.app/)) to see the application in action.

## Installation

To run TypeSymphony locally:

bash
# Clone the repository
git clone https://github.com/yourusername/typesymphony.git
cd typesymphony

# Install dependencies
npm install

# Start the development server
npm run dev


The application will be available at http://localhost:5173/.

## Project Structure


typesymphony/
├── public/
│   ├── images/
│   │   ├── background.jpg
│   │   └── scenes/
│   │       ├── scene1.jpg
│   │       ├── scene2.jpg
│   │       └── ...
│   └── sounds/
│       ├── background-music.mp3
│       ├── key-press.mp3
│       └── success.mp3
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── game/
│   │   │   ├── StoryScene.jsx
│   │   │   ├── TypingArea.jsx
│   │   │   └── Stats.jsx
│   │   └── shared/
│   │       ├── Button.jsx
│   │       ├── HoliEffect.jsx
│   │       ├── Input.jsx
│   │       └── Navbar.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── GameContext.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useSound.js
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── GamePage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LeaderboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SignupPage.jsx
│   │   └── StorylinesPage.jsx
│   ├── styles/
│   │   └── gameAnimations.css
│   ├── utils/
│   │   ├── debugLocalStorage.js
│   │   └── storyData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vite.config.js
├── DEPLOYMENT.md
└── README.md


## Usage

1. *Create an Account*: Sign up with a name, email, and password
2. *Explore Stories*: Browse the available Indian folk tales
3. *Start Typing*: Select a story and begin typing practice
4. *Track Progress*: View your WPM, accuracy, and overall statistics
5. *Compare Rankings*: See how you stack up on the leaderboard

## Technologies Used

- *React*: UI components and state management
- *Vite*: Fast development and building
- *React Router*: Navigation and routing
- *Tailwind CSS*: Styling and responsive design
- *localStorage*: Client-side data persistence
- *Howler.js*: Sound management

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to GitHub Pages.

Basic deployment steps:

bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy


## Customization

### Adding New Stories

To add new stories, edit the src/utils/storyData.js file:

javascript
export const storyData = [
  {
    scene: 7,
    title: "Your New Scene Title",
    text: "Your new story text for typing practice...",
    image: "scene7.jpg"
  },
  // Add more scenes as needed
];


### Customizing Visual Effects

The Holi color effects can be customized in src/components/shared/HoliEffect.jsx by modifying the colors array:

javascript
const colors = [
  '#FE4365', // Pink
  '#FC9D9A', // Light Pink
  // Add or modify colors here
];


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspiration from [monkeytype.com](https://monkeytype.com/)
- Indian folk tales from "Krish Trish and Baltiboy" series
- Tailwind CSS for styling components
- React community for excellent documentation and tutorial
