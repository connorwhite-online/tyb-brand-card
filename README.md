# TYB Brand Card

A TYB Brand Card - an interactive 3D brand card built with Next.js and React Three Fiber. Features draggable assets, gyroscope-based rotation on mobile devices, and a credit card-like design.

## Features

- **3D Credit Card**: Realistic credit card dimensions and thickness
- **Static Assets**: Brand logo (top left) and balance display (bottom right)
- **Draggable Stickers**: Customizable assets with peel animation effects
- **Gyroscope Integration**: Mobile device tilt controls for 3D rotation
- **Edit Mode**: Toggle between view and edit modes
- **Responsive Design**: 90% width on mobile, responsive across screen sizes

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **View Mode** (Default): 
   - On mobile devices, tilt your phone to see the card rotate in 3D space
   - Static brand elements (logo, balance) are displayed
   - Customizable stickers are visible but not interactive

2. **Edit Mode**:
   - Click the "Edit" button to enter edit mode
   - Drag the colored stickers around the card surface
   - Gyroscope rotation is disabled during editing
   - Click "Save Changes" to confirm positions and return to view mode

## Technical Stack

- **Next.js 14+** - React framework with App Router
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Three.js** - 3D graphics library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
