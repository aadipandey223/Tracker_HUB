# Design Document

## Overview

This design document outlines the architecture and implementation approach for fixing and enhancing the Vision Board interactive features. The current implementation has basic UI components but lacks fully functional drag-and-drop, resize, rotate, and layering capabilities. This design focuses on making all interactive features work seamlessly while maintaining good performance and user experience.

The system consists of three main layers:
1. **Canvas Layer**: Handles rendering, zoom, and grid display
2. **Item Layer**: Manages individual board items with transform controls
3. **Tool Layer**: Provides interfaces for adding and configuring elements

## Architecture

### Component Hierarchy

```
BoardEditor (Main Container)
├── Header (Title, Save, Present, Export)
├── BoardCanvas (Canvas Management)
│   ├── Canvas Background
│   ├── Grid Overlay (optional)
│   └── CanvasItem[] (Multiple Items)
│       ├── Item Content (Image/Text/Shape/Goal/Sticker)
│       ├── Transform Controls (when selected)
│       │   ├── Resize Handles (8 handles)
│       │   ├── Rotation Handle
│       │   └── Delete Button
│       └── TextEditor (for text items)
└── ToolSidebar (Element Addition)
    ├── ImageLibrary
    ├── TextEditor
    ├── AffirmationLibrary
    ├── Goal Linker
    ├── Shape Palette
    └── Sticker Library
```

### Data Flow

```
User Action → Event Handler → State Update → Database Mutation → UI Update
```

1. User interacts with canvas or item
2. Event handler captures interaction (drag, resize, rotate)
3. Local state updates immediately for responsiveness
4. Mutation persists change to database
5. React Query invalidates and refetches if needed

### State Management

The application uses React Query for server state and local React state for UI interactions:

- **Server State** (React Query):
  - Vision boards list
  - Board items list
  - Tasks list (for goal linking)

- **Local State** (React useState):
  - Selected item
  - Zoom level
  - Grid visibility
  - Drag/resize/rotate in-progress state
  - View mode (edit/present)

## Components and Interfaces

### BoardCanvas Component

**Purpose**: Main canvas area where items are rendered and manipulated

**Props**:
```typescript
interface BoardCanvasProps {
  board: VisionBoard;
  items: VisionBoardItem[];
  selectedItem: VisionBoardItem | null;
  onSelectItem: (item: VisionBoardItem | null) => void;
  onUpdateItem: (itemId: string, updates: Partial<VisionBoardItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onDuplicateItem: (item: VisionBoardItem) => void;
  viewMode: 'edit' | 'present';
}
```

**Key Features**:
- Fixed canvas size (1200x800) with zoom scaling
- Click-to-deselect on background
- Zoom controls (in/out/reset)
- Grid toggle
- Layering controls (bring forward/send backward)

### CanvasItem Component

**Purpose**: Individual draggable, resizable, rotatable item on canvas

**Props**:
```typescript
interface CanvasItemProps {
  item: VisionBoardItem;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: MouseEvent) => void;
  onDrag: (e: MouseEvent) => void;
  onDragEnd: () => void;
  onUpdate: (updates: Partial<VisionBoardItem>) => void;
  onDelete: () => void;
  viewMode: 'edit' | 'present';
  zoom: number;
}
```

**Transform Operations**:
1. **Drag**: Track mouse position relative to canvas, update x/y
2. **Resize**: Calculate delta from handle drag, update width/height
3. **Rotate**: Calculate angle from center to cursor, update rotation

**Item Types**:
- `image`: Displays image with object-cover
- `text`: Displays styled text content
- `affirmation`: Text with special styling
- `goal`: Task card with completion status
- `shape`: Colored rectangle or circle
- `sticker`: Emoji character

### ToolSidebar Component

**Purpose**: Provides tools for adding elements to the board

**Tabs**:
1. **Images**: Upload or select from library
2. **Text**: Text input with formatting
3. **Goals**: Link tasks from task tracker
4. **Shapes**: Predefined shape palette
5. **Stickers**: Emoji library

**Interface**:
```typescript
interface ToolSidebarProps {
  onAddItem: (itemData: Partial<VisionBoardItem>) => void;
  selectedItem: VisionBoardItem | null;
  onUpdateItem: (itemId: string, updates: Partial<VisionBoardItem>) => void;
  tasks: Task[];
}
```

### TextEditor Component

**Purpose**: Inline editor for text styling

**Features**:
- Font family selection
- Font size slider
- Bold, italic, underline toggles
- Text alignment (left/center/right)
- Text color picker
- Background color picker

**Behavior**:
- Opens on double-click of text item
- Closes on click outside or Escape key
- Auto-saves changes on close

### ImageLibrary Component

**Purpose**: Browse and select images

**Features**:
- Upload custom images
- Search functionality
- Categorized stock images (success, nature, travel, business, wellness, wealth, love, career)
- Favorites system (localStorage)
- Drag-and-drop support

### AffirmationLibrary Component

**Purpose**: Browse and select affirmations

**Features**:
- 200+ pre-written affirmations
- 10 categories (success, wealth, health, love, confidence, career, gratitude, growth, peace, creativity)
- Random affirmation button
- Search functionality
- Drag-and-drop support

## Data Models

### VisionBoard

```typescript
interface VisionBoard {
  id: string;
  title: string;
  category: string;
  description?: string;
  background_color?: string;
  background_image?: string;
  tags?: string[];
  theme?: string;
  created_date: string;
  is_archived: boolean;
  is_starred: boolean;
}
```

### VisionBoardItem

```typescript
interface VisionBoardItem {
  id: string;
  board_id: string;
  type: 'image' | 'text' | 'affirmation' | 'goal' | 'shape' | 'sticker';
  content: string; // URL for images, text for text/affirmation, emoji for sticker
  x: number; // Position in pixels
  y: number;
  width: number; // Size in pixels
  height: number;
  rotation: number; // Degrees
  z_index: number; // Layering order
  style?: ItemStyle; // Type-specific styling
  linked_goal_id?: string; // For goal type
  is_completed?: boolean; // For goal type
}
```

### ItemStyle

```typescript
interface ItemStyle {
  // Text styles
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  textShadow?: string;
  
  // Shape styles
  fill?: string;
  shape?: 'square' | 'circle';
  borderRadius?: string;
  opacity?: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Item Addition Creates Valid Elements

*For any* element type (image, text, shape, goal, sticker) and valid content, when added to the canvas, the system should create a board item with all required properties (id, board_id, type, content, x, y, width, height, z_index).

**Validates: Requirements 1.2, 1.4, 1.6, 1.8, 1.10**

### Property 2: Item Selection Shows Transform Controls

*For any* board item, when selected, the system should display all transform controls (8 resize handles, 1 rotation handle, delete button) and a visual selection indicator.

**Validates: Requirements 2.1, 2.2, 2.5, 4.1, 5.1**

### Property 3: Canvas Click Deselects Items

*For any* selected item, when the canvas background is clicked, the system should deselect the item and hide all transform controls.

**Validates: Requirements 2.3**

### Property 4: Drag Updates Position in Real-Time

*For any* board item, when dragged, the system should continuously update the item's x and y coordinates to follow the cursor position relative to the canvas.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Drag Respects Canvas Boundaries

*For any* board item being dragged, the system should constrain the item's position so that it remains fully within the canvas boundaries (0 ≤ x ≤ canvasWidth - itemWidth, 0 ≤ y ≤ canvasHeight - itemHeight).

**Validates: Requirements 3.4**

### Property 6: Arrow Keys Nudge Selected Items

*For any* selected item and arrow key direction, pressing the arrow key should move the item by 1 pixel in that direction, and pressing Shift + arrow key should move it by 10 pixels.

**Validates: Requirements 3.5, 3.6, 17.3, 17.4**

### Property 7: Resize Maintains Minimum Dimensions

*For any* board item being resized, the system should enforce that width ≥ 50 pixels and height ≥ 50 pixels, preventing the item from becoming too small.

**Validates: Requirements 4.4**

### Property 8: Corner Resize Maintains Aspect Ratio

*For any* board item, when a corner resize handle is dragged, the system should resize both width and height proportionally from the dragged corner.

**Validates: Requirements 4.2**

### Property 9: Edge Resize Changes One Dimension

*For any* board item, when an edge resize handle is dragged, the system should resize only the dimension perpendicular to that edge (horizontal edges change height, vertical edges change width).

**Validates: Requirements 4.3**

### Property 10: Rotation Preserves Position and Size

*For any* board item, when rotated to any angle, the item's x, y, width, and height properties should remain unchanged (only the rotation property changes).

**Validates: Requirements 5.5**

### Property 11: Rotation Updates in Real-Time

*For any* board item, when the rotation handle is dragged, the system should continuously update the rotation angle based on the angle between the item's center and the cursor position.

**Validates: Requirements 5.2, 5.3**

### Property 12: Z-Index Determines Render Order

*For any* set of overlapping board items, the system should render items in ascending z-index order, with higher z-index items appearing on top of lower z-index items.

**Validates: Requirements 6.3**

### Property 13: Bring Forward Increases Z-Index

*For any* selected item, clicking "Bring Forward" should increase the item's z-index to be greater than the current maximum z-index of all items.

**Validates: Requirements 6.1**

### Property 14: Send Backward Decreases Z-Index

*For any* selected item, clicking "Send Backward" should decrease the item's z-index to be less than the current minimum z-index of all items (but not below 1).

**Validates: Requirements 6.2**

### Property 15: New Items Have Highest Z-Index

*For any* new item added to the canvas, the system should assign it a z-index value that is greater than all existing items' z-index values.

**Validates: Requirements 6.4**

### Property 16: Delete Removes Item Completely

*For any* board item, when deleted (via button or Delete key), the system should remove the item from both the canvas UI and the database, and deselect any selection.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 17: Duplicate Creates Identical Copy with Offset

*For any* board item, when duplicated, the system should create a new item with identical properties (type, content, width, height, rotation, style) except for id (which must be unique) and position (which should be offset by +20 pixels in both x and y).

**Validates: Requirements 8.1, 8.2, 8.3, 8.5**

### Property 18: Double-Click Opens Text Editor

*For any* text or affirmation item, when double-clicked, the system should display the inline text editor with the current content and styling.

**Validates: Requirements 9.1**

### Property 19: Text Editor Saves on Close

*For any* text editor instance, when closed (via click outside or Escape key), the system should save any changes to content or styling and persist them to the database.

**Validates: Requirements 9.4, 9.5**

### Property 20: Zoom Scales Canvas Proportionally

*For any* zoom level between 50% and 200%, the canvas should scale proportionally, and all transform operations (drag, resize, rotate) should be adjusted by the zoom factor to maintain accurate positioning.

**Validates: Requirements 13.1, 13.2, 13.3, 13.5, 13.6**

### Property 21: Zoom Preserves Canvas Center

*For any* zoom level change, the canvas center point should remain in the same position in the viewport (zoom should feel like it's zooming toward/away from the center).

**Validates: Requirements 13.4**

### Property 22: Keyboard Shortcuts Work Consistently

*For any* selected item, pressing Delete should delete it, pressing Escape should deselect it, and pressing Ctrl/Cmd + D should duplicate it.

**Validates: Requirements 17.1, 17.2, 17.5**

### Property 23: All Changes Persist to Database

*For any* item property change (position, size, rotation, z-index, content, style), the system should persist the change to the database immediately after the operation completes.

**Validates: Requirements 4.5, 5.4, 6.5, 8.4, 16.1, 16.2**

### Property 24: Goal Items Reflect Task Status

*For any* goal item linked to a task, the item's visual state (completion indicator) should match the task's completion status from the task tracker.

**Validates: Requirements 12.4**

### Property 25: Transform Handles Scale with Zoom

*For any* zoom level, transform handles should maintain a consistent visual size (in screen pixels) by scaling inversely with the zoom level, ensuring they remain easy to interact with.

**Validates: Requirements 20.5**

## Error Handling

### User Input Validation

1. **Empty Text**: Prevent adding text elements with empty or whitespace-only content
2. **Invalid Positions**: Constrain item positions to canvas boundaries
3. **Invalid Dimensions**: Enforce minimum size constraints during resize
4. **Invalid Zoom**: Clamp zoom level between 50% and 200%

### Network Errors

1. **Save Failures**: Display error message and retry mechanism
2. **Upload Failures**: Show error toast and allow retry
3. **Load Failures**: Display error state with reload option

### State Consistency

1. **Concurrent Edits**: Use optimistic updates with rollback on failure
2. **Stale Data**: Invalidate queries after mutations
3. **Missing References**: Handle deleted tasks for goal items gracefully

### Edge Cases

1. **Rapid Interactions**: Debounce database updates during continuous operations (drag, resize, rotate)
2. **Large Boards**: Implement virtual rendering if item count exceeds 100
3. **Browser Compatibility**: Provide fallbacks for unsupported features

## Testing Strategy

### Unit Testing

**Framework**: Vitest with React Testing Library

**Test Coverage**:
1. Component rendering for all item types
2. Event handler logic (drag, resize, rotate calculations)
3. Boundary constraint functions
4. Z-index calculation logic
5. Keyboard shortcut handlers
6. Zoom calculation functions

**Example Unit Tests**:
```javascript
describe('CanvasItem', () => {
  it('should render image items with correct src', () => {
    // Test image rendering
  });
  
  it('should calculate correct position during drag', () => {
    // Test drag position calculation
  });
  
  it('should enforce minimum size during resize', () => {
    // Test resize constraints
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations

**Property Tests**:

Each correctness property listed above should be implemented as a property-based test. The tests should generate random valid inputs and verify the property holds.

**Example Property Test**:
```javascript
import fc from 'fast-check';

// Feature: vision-board-interactive-features, Property 5: Drag Respects Canvas Boundaries
test('dragging items keeps them within canvas boundaries', () => {
  fc.assert(
    fc.property(
      fc.record({
        x: fc.integer({ min: 0, max: 1200 }),
        y: fc.integer({ min: 0, max: 800 }),
        width: fc.integer({ min: 50, max: 400 }),
        height: fc.integer({ min: 50, max: 400 }),
      }),
      fc.integer({ min: -500, max: 1500 }), // target x
      fc.integer({ min: -500, max: 1000 }), // target y
      (item, targetX, targetY) => {
        const constrained = constrainToCanvas(item, targetX, targetY, 1200, 800);
        
        // Item should be fully within canvas
        expect(constrained.x).toBeGreaterThanOrEqual(0);
        expect(constrained.y).toBeGreaterThanOrEqual(0);
        expect(constrained.x + item.width).toBeLessThanOrEqual(1200);
        expect(constrained.y + item.height).toBeLessThanOrEqual(800);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Scenarios**:
1. Complete workflow: Add item → Drag → Resize → Rotate → Delete
2. Multi-item interactions: Layering, selection switching
3. Tool sidebar: Add items from each tab
4. Text editing: Open editor → Modify → Save
5. Zoom and pan: Zoom in/out → Drag items → Verify accuracy

### Manual Testing Checklist

- [ ] All item types render correctly
- [ ] Drag works smoothly without lag
- [ ] Resize handles are easy to grab
- [ ] Rotation feels natural
- [ ] Keyboard shortcuts work
- [ ] Zoom doesn't break interactions
- [ ] Grid displays correctly
- [ ] Presentation mode hides controls
- [ ] Export generates correct image
- [ ] Save indicator updates properly

## Performance Considerations

### Critical Performance Issues in Current Code

**🔴 MAJOR ISSUES:**

1. **No Debouncing on Drag/Resize/Rotate** - Every mouse move triggers database update
2. **No Memoization** - CanvasItem re-renders on every parent update
3. **Event Listeners Not Cleaned Up** - Memory leaks from document event listeners
4. **No RequestAnimationFrame** - Updates not synced with browser paint cycle
5. **Inline Styles Recalculated** - Every render recalculates all inline styles
6. **No Virtual Rendering** - All items render even if off-screen

### Optimization Strategies

#### 1. **Debounced Database Updates** ⚡ CRITICAL
```javascript
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

// In BoardEditor component
const debouncedUpdate = useMemo(
  () => debounce((itemId, updates) => {
    updateItemMutation.mutate({ id: itemId, data: updates });
  }, 300), // Wait 300ms after last change
  []
);

// Use optimistic update + debounced persist
const handleUpdateItem = useCallback((itemId, updates) => {
  // Update UI immediately (optimistic)
  setItems(prev => prev.map(item => 
    item.id === itemId ? { ...item, ...updates } : item
  ));
  
  // Persist to DB after debounce
  debouncedUpdate(itemId, updates);
}, [debouncedUpdate]);
```

#### 2. **Memoization** ⚡ CRITICAL
```javascript
import React, { memo } from 'react';

// Memoize CanvasItem to prevent unnecessary re-renders
const CanvasItem = memo(({ item, isSelected, ...props }) => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if these change
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.x === nextProps.item.x &&
    prevProps.item.y === nextProps.item.y &&
    prevProps.item.width === nextProps.item.width &&
    prevProps.item.height === nextProps.item.height &&
    prevProps.item.rotation === nextProps.item.rotation &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.zoom === nextProps.zoom
  );
});
```

#### 3. **RequestAnimationFrame for Smooth Updates** ⚡ CRITICAL
```javascript
const handleItemDrag = useCallback((e, item) => {
  if (!isDragging || viewMode === 'present') return;
  
  // Use RAF to sync with browser paint cycle
  requestAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const newX = (e.clientX - canvasRect.left - dragOffset.x) / zoom;
    const newY = (e.clientY - canvasRect.top - dragOffset.y) / zoom;
    
    onUpdateItem(item.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
  });
}, [isDragging, viewMode, zoom, dragOffset, onUpdateItem]);
```

#### 4. **CSS Transform Instead of Top/Left** ⚡ HIGH PRIORITY
```javascript
// SLOW - triggers layout recalculation
style={{
  left: item.x || 0,
  top: item.y || 0,
}}

// FAST - uses GPU acceleration
style={{
  transform: `translate(${item.x || 0}px, ${item.y || 0}px) rotate(${item.rotation || 0}deg)`,
  willChange: isDragging ? 'transform' : 'auto',
}}
```

#### 5. **Virtual Rendering for Large Boards** ⚡ MEDIUM PRIORITY
```javascript
import { useVirtualizer } from '@tanstack/react-virtual';

// Only render items visible in viewport
const visibleItems = useMemo(() => {
  if (items.length < 50) return items; // Skip for small boards
  
  const viewportRect = canvasRef.current?.getBoundingClientRect();
  if (!viewportRect) return items;
  
  return items.filter(item => {
    const itemRect = {
      left: item.x,
      top: item.y,
      right: item.x + item.width,
      bottom: item.y + item.height,
    };
    
    // Check if item intersects viewport
    return !(
      itemRect.right < 0 ||
      itemRect.bottom < 0 ||
      itemRect.left > viewportRect.width ||
      itemRect.top > viewportRect.height
    );
  });
}, [items, zoom]);
```

#### 6. **Passive Event Listeners** ⚡ HIGH PRIORITY
```javascript
// For touch events - improves scroll performance
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const handleTouchMove = (e) => {
    // Handle touch
  };
  
  // Use passive: true for better scroll performance
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  
  return () => {
    canvas.removeEventListener('touchmove', handleTouchMove);
  };
}, []);
```

#### 7. **Image Lazy Loading** ⚡ MEDIUM PRIORITY
```javascript
// In CanvasItem for image type
<img 
  src={item.content} 
  alt="" 
  loading="lazy" // Browser native lazy loading
  decoding="async" // Async image decoding
  className="w-full h-full object-cover rounded-lg"
  draggable={false}
/>
```

#### 8. **Throttle Resize/Rotate Updates** ⚡ HIGH PRIORITY
```javascript
import { throttle } from 'lodash';

// Throttle updates during continuous operations
const throttledUpdate = useMemo(
  () => throttle((updates) => {
    onUpdate(updates);
  }, 16), // 60 FPS = ~16ms per frame
  [onUpdate]
);
```

#### 9. **Batch State Updates** ⚡ MEDIUM PRIORITY
```javascript
import { unstable_batchedUpdates } from 'react-dom';

// Batch multiple state updates into single render
const handleComplexOperation = () => {
  unstable_batchedUpdates(() => {
    setSelectedItem(newItem);
    setZoom(newZoom);
    setShowGrid(true);
  });
};
```

#### 10. **Web Workers for Heavy Computations** ⚡ LOW PRIORITY
```javascript
// For export/image processing
const exportWorker = new Worker('/workers/export.worker.js');

exportWorker.postMessage({ canvas: canvasData });
exportWorker.onmessage = (e) => {
  const imageBlob = e.data;
  // Download image
};
```

### Performance Targets

- **Drag Latency**: < 16ms (60 FPS) ✅
- **Resize Latency**: < 16ms (60 FPS) ✅
- **Rotation Latency**: < 16ms (60 FPS) ✅
- **Touch Latency**: < 16ms (60 FPS) ✅
- **Save Time**: < 500ms for single item update ✅
- **Load Time**: < 2s for board with 50 items ✅
- **Memory Usage**: < 100MB for 100 items ✅
- **First Contentful Paint**: < 1.5s ✅

### Performance Monitoring

```javascript
// Add performance monitoring
const measurePerformance = (operation, fn) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 16) {
    console.warn(`${operation} took ${duration}ms (target: 16ms)`);
  }
  
  return duration;
};

// Usage
measurePerformance('drag', () => handleDrag(e));
```

### Bundle Size Optimization

1. **Code Splitting**: Lazy load presentation mode
2. **Tree Shaking**: Remove unused lodash functions
3. **Image Optimization**: Use WebP format with fallbacks
4. **Minification**: Enable production build optimizations

### Mobile-Specific Optimizations

1. **Reduce Animation Complexity**: Disable shadows on low-end devices
2. **Lower Resolution**: Scale canvas down on mobile
3. **Simplified Rendering**: Reduce visual effects
4. **Touch Debouncing**: Prevent accidental double-taps
5. **Passive Listeners**: Improve scroll performance

## Accessibility

### Keyboard Navigation

- Tab through items
- Arrow keys for nudging
- Delete key for deletion
- Escape for deselection
- Ctrl/Cmd + D for duplication

### Screen Reader Support

- ARIA labels for all interactive elements
- Announce selection changes
- Announce item additions/deletions
- Describe transform operations

### Visual Accessibility

- High contrast selection indicators
- Sufficient color contrast for text
- Visible focus indicators
- Scalable UI elements

## Security Considerations

1. **File Upload Validation**: Validate image file types and sizes
2. **XSS Prevention**: Sanitize user-entered text content
3. **Authorization**: Verify user owns board before allowing edits
4. **Rate Limiting**: Prevent abuse of save operations
5. **Content Moderation**: Consider filtering inappropriate content in affirmations

## Mobile and Tablet Support

### Touch Interaction Architecture

**Touch Event Handling**:
```typescript
interface TouchInteraction {
  type: 'tap' | 'double-tap' | 'long-press' | 'drag' | 'pinch' | 'rotate' | 'pan';
  target: VisionBoardItem | 'canvas';
  touches: TouchPoint[];
  gesture?: GestureData;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface GestureData {
  scale?: number; // For pinch gestures
  rotation?: number; // For rotation gestures
  velocity?: { x: number; y: number }; // For drag/pan
}
```

### Responsive Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: 0,      // 0-767px
  tablet: 768,    // 768-1023px
  desktop: 1024   // 1024px+
};
```

### Touch-Optimized Components

**MobileToolbar Component**:
- Bottom sheet for tool selection
- Floating action button for quick actions
- Swipeable panels for categories

**TouchControls Component**:
- Larger touch targets (44x44px minimum)
- Visual feedback on touch
- Context menu on long press

**ResponsiveCanvas Component**:
- Auto-scaling based on viewport
- Touch gesture recognition
- Prevent default browser behaviors

### Gesture Recognition

**Single Touch**:
- Tap: Select item
- Double-tap: Open editor
- Long-press: Context menu
- Drag: Move item

**Multi-Touch**:
- Two-finger pinch: Resize item or zoom canvas
- Two-finger rotate: Rotate item
- Two-finger pan: Pan canvas view

### Mobile-Specific Optimizations

1. **Lazy Loading**: Load images progressively on mobile
2. **Reduced Animations**: Simplify animations on low-end devices
3. **Touch Debouncing**: Prevent accidental double-taps
4. **Viewport Management**: Disable browser zoom, manage viewport meta tag
5. **Offline Support**: Cache boards for offline editing

### Tablet-Specific Features

1. **Split View**: Tool sidebar + canvas side-by-side
2. **Stylus Support**: Pressure sensitivity for drawing
3. **Keyboard Shortcuts**: Support external keyboards
4. **Hover States**: Support for mouse/trackpad on tablets

### Correctness Properties for Mobile

### Property 26: Touch Drag Updates Position

*For any* board item on a touch device, when dragged with a finger, the system should update the item's position to follow the touch point in real-time.

**Validates: Requirements 21.2**

### Property 27: Pinch Gesture Resizes Items

*For any* board item, when a pinch gesture is performed, the system should resize the item proportionally based on the pinch scale factor.

**Validates: Requirements 21.3**

### Property 28: Touch Targets Meet Minimum Size

*For any* interactive element on mobile, the touch target size should be at least 44x44 pixels to ensure easy tapping.

**Validates: Requirements 22.3**

### Property 29: Canvas Scales to Viewport

*For any* viewport width less than 768 pixels, the canvas should scale to fit within the screen width while maintaining aspect ratio.

**Validates: Requirements 25.1**

### Property 30: Touch Performance Maintains 60 FPS

*For any* touch interaction (drag, pinch, rotate), the system should maintain at least 60 frames per second during the interaction.

**Validates: Requirements 27.1**

## Future Enhancements

1. **Undo/Redo**: Implement command pattern for operation history
2. **Multi-Select**: Allow selecting and manipulating multiple items
3. **Alignment Guides**: Show snap-to guides when dragging
4. **Templates**: Pre-designed board templates
5. **Collaboration**: Real-time multi-user editing
6. **Animation**: Animate item additions and deletions
7. **Voice Input**: Add items via voice commands on mobile
8. **Keyboard-Only Mode**: Full functionality without mouse
9. **AR Preview**: View boards in augmented reality on mobile
10. **Haptic Feedback**: Vibration feedback for touch interactions
