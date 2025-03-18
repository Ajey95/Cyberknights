# TypeSymphony

A culturally immersive typing application with Indian storytelling elements and Holi color effects.

## Project Structure

This project is a React application built with Vite and includes:

- Typing game with real-time feedback
- Indian folklore storytelling
- Holi-inspired color effects
- User authentication (client-side)
- Progress tracking and leaderboard

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Required Resources

Before running the application, you need to add the following resources:

### Images

Create the following directories and add the necessary images:

```
public/
├── images/
│   ├── background.jpg       # Indian manuscript texture
│   └── scenes/              # Story scenes
│       ├── scene1.jpg
│       ├── scene2.jpg
│       ├── scene3.jpg
│       ├── scene4.jpg
│       ├── scene5.jpg
│       └── scene6.jpg
```

### Sounds

Create the following directory and add the necessary sound files:

```
public/
├── sounds/
│   ├── background-music.mp3  # Traditional Indian background music
│   ├── key-press.mp3         # Sound for key press
│   └── success.mp3           # Sound for completing a paragraph
```

You can find free sound resources at:
- [Freesound](https://freesound.org/)
- [Pixabay](https://pixabay.com/sound-effects/)

And free image resources at:
- [Unsplash](https://unsplash.com/)
- [Pexels](https://www.pexels.com/)

## Deployment

To deploy to GitHub Pages:

1. Update the `base` property in `vite.config.js` with your repository name
2. Run `npm run deploy`
3. Configure GitHub Pages to use the `gh-pages` branch

## License

MIT