# 3D Brand Card Specification

## Project Overview
A 3D interactive card component built with React and Three.js that displays brand assets and allows customization through drag-and-drop interactions. The card simulates a credit card with realistic dimensions and includes gyroscope-based rotation on mobile devices.

## Technical Requirements

### Framework & Libraries
- **Next.js 14+** - React framework
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/fiber** - Core R3F library
- **Three.js** - 3D graphics library
- **React** - UI library
- **TypeScript** - Type safety

### Core Features

#### 1. 3D Card Component
- **Geometry**: Plane mesh representing a credit card
- **Dimensions**: Credit card aspect ratio (3.375" × 2.125" or 85.6mm × 53.98mm)
- **Thickness**: Thin profile mimicking real credit card (0.76mm)
- **Material**: Suitable for image/texture overlays
- **Responsive**: 90% screen width on mobile devices

#### 2. Asset System
Two types of assets will be supported:

**Static Assets** (non-movable):
- Brand logo - positioned in top left corner
- Brand balance - positioned in bottom right corner
- File formats: JPG, PNG

**Customizable Assets** (draggable):
- User stickers/decorations
- File formats: JPG, PNG, GIF
- Drag-and-drop functionality with peel animation
- Position persistence

#### 3. Edit Mode
- **Default State**: View-only mode with gyroscope rotation active
- **Edit Button**: Toggles between view and edit modes
- **Edit State**: 
  - Gyroscope rotation disabled
  - Customizable assets become draggable
  - Button text changes to "Save changes"
- **Save Action**: Solidifies asset positions and returns to view mode

#### 4. Gyroscope Integration
- **Platform**: Mobile devices only
- **Behavior**: Subtle card rotation following device tilt
- **Constraints**: Limited rotation angles for realistic effect
- **State**: Only active when not in edit mode

#### 5. Drag & Drop System
- **Target Assets**: Only customizable assets (not static brand elements)
- **Animation**: "Peel" effect when dragging begins
- **Constraints**: Movement limited to card surface
- **Feedback**: Visual indicators for drag state

## User Interface

### Layout
- **Card**: Centered on screen, taking 90% width on mobile
- **Edit Button**: Positioned below the card
- **No other UI elements**: Clean, focused interface

### Responsive Design
- **Mobile**: Card width = 90% of screen width
- **Desktop**: Appropriate scaling while maintaining aspect ratio
- **Touch**: Optimized for mobile touch interactions

## Asset Specifications

### Static Assets
1. **Brand Logo**
   - Position: Top left corner of card
   - Size: Proportional to card dimensions
   - Placeholder: Generic logo placeholder

2. **Brand Balance**
   - Position: Bottom right corner of card
   - Size: Appropriate for balance display
   - Placeholder: "$XXX.XX" text or mock balance

### Customizable Assets
- **Initial State**: Default placeholder stickers
- **Customization**: User can drag to reposition
- **Persistence**: Positions saved between edit sessions

## Technical Implementation Notes

### Performance Considerations
- Optimize Three.js rendering for mobile devices
- Efficient gyroscope polling
- Smooth animation framerates

### Browser Support
- Modern browsers with WebGL support
- Mobile safari and Chrome
- Progressive enhancement for gyroscope features

### File Structure
```
app/
├── components/
│   ├── Card3D.tsx          # Main 3D card component
│   ├── AssetLayer.tsx      # Asset management
│   ├── DraggableAsset.tsx  # Individual draggable asset
│   └── GyroscopeControl.tsx # Gyroscope integration
├── hooks/
│   ├── useGyroscope.ts     # Gyroscope data hook
│   └── useEditMode.ts      # Edit mode state management
├── types/
│   └── index.ts            # TypeScript type definitions
└── assets/
    └── placeholders/       # Placeholder images
```

## Development Phases

### Phase 1: Basic Setup
- Install dependencies
- Create basic 3D scene
- Implement credit card geometry

### Phase 2: Asset System
- Add static assets (logo, balance)
- Create placeholder images
- Implement basic asset positioning

### Phase 3: Interactivity
- Add edit mode toggle
- Implement drag-and-drop for customizable assets
- Create peel animation effects

### Phase 4: Mobile Features
- Integrate gyroscope controls
- Optimize for mobile performance
- Ensure responsive design

### Phase 5: Polish
- Refine animations
- Optimize performance
- Add visual feedback and transitions

## Success Criteria
1. Card displays correctly on all target devices
2. Static assets remain fixed in designated positions
3. Customizable assets can be dragged smoothly in edit mode
4. Gyroscope rotation works on mobile devices
5. Edit/Save workflow functions properly
6. Performance remains smooth during interactions
7. Responsive design works across screen sizes
