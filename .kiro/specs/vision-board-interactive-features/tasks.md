# Implementation Plan

- [ ] 1. Fix core drag and drop functionality
  - Fix the drag event handlers in BoardCanvas and CanvasItem to properly track mouse position
  - Implement proper drag offset calculation to prevent items from jumping
  - Add boundary constraints to keep items within canvas
  - Ensure drag works correctly at different zoom levels
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 13.5_

- [ ] 1.1 Write property test for drag boundary constraints
  - **Property 5: Drag Respects Canvas Boundaries**
  - **Validates: Requirements 3.4**

- [ ] 2. Fix resize functionality
  - Implement proper resize calculations for all 8 handles (4 corners + 4 edges)
  - Add minimum size constraint (50x50 pixels)
  - Fix resize behavior at different zoom levels
  - Ensure resize handles are properly positioned and visible
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 2.1 Write property test for resize minimum dimensions
  - **Property 7: Resize Maintains Minimum Dimensions**
  - **Validates: Requirements 4.4**

- [ ] 2.2 Write property test for corner resize
  - **Property 8: Corner Resize Maintains Aspect Ratio**
  - **Validates: Requirements 4.2**

- [ ] 2.3 Write property test for edge resize
  - **Property 9: Edge Resize Changes One Dimension**
  - **Validates: Requirements 4.3**

- [ ] 3. Fix rotation functionality
  - Implement proper rotation angle calculation based on cursor position
  - Ensure rotation works smoothly at different zoom levels
  - Fix rotation handle positioning
  - Verify rotation doesn't affect item position or size
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 3.1 Write property test for rotation invariants
  - **Property 10: Rotation Preserves Position and Size**
  - **Validates: Requirements 5.5**

- [ ] 4. Fix item selection and deselection
  - Implement proper click detection on items
  - Add visual selection indicator (border/highlight)
  - Implement canvas background click to deselect
  - Add Escape key handler for deselection
  - Show/hide transform controls based on selection state
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4.1 Write property test for selection behavior
  - **Property 2: Item Selection Shows Transform Controls**
  - **Validates: Requirements 2.1, 2.2, 2.5**

- [ ] 5. Implement keyboard shortcuts
  - Add Delete key handler for item deletion
  - Add Escape key handler for deselection
  - Implement arrow key nudging (1 pixel)
  - Implement Shift + arrow key nudging (10 pixels)
  - Add Ctrl/Cmd + D for duplication
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 3.5, 3.6_

- [ ] 5.1 Write property test for arrow key nudging
  - **Property 6: Arrow Keys Nudge Selected Items**
  - **Validates: Requirements 3.5, 3.6**

- [ ] 6. Fix z-index and layering controls
  - Implement "Bring Forward" functionality
  - Implement "Send Backward" functionality
  - Ensure new items get highest z-index
  - Fix rendering order based on z-index
  - Persist z-index changes to database
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 6.1 Write property test for z-index rendering order
  - **Property 12: Z-Index Determines Render Order**
  - **Validates: Requirements 6.3**

- [ ] 6.2 Write property test for new item z-index
  - **Property 15: New Items Have Highest Z-Index**
  - **Validates: Requirements 6.4**

- [ ] 7. Fix item deletion
  - Implement delete button functionality
  - Add Delete key handler
  - Ensure deletion removes from UI and database
  - Deselect after deletion
  - Update canvas immediately
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7.1 Write property test for deletion
  - **Property 16: Delete Removes Item Completely**
  - **Validates: Requirements 7.1, 7.2, 7.3**

- [ ] 8. Fix item duplication
  - Implement duplicate button functionality
  - Create copy with identical properties
  - Offset duplicate position by 20 pixels
  - Assign new unique ID
  - Persist to database
  - Auto-select the duplicate
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8.1 Write property test for duplication
  - **Property 17: Duplicate Creates Identical Copy with Offset**
  - **Validates: Requirements 8.1, 8.2, 8.3**

- [ ] 9. Fix text editing functionality
  - Implement double-click handler for text items
  - Show/hide text editor properly
  - Ensure text editor saves on close
  - Fix click-outside detection
  - Persist style changes to database
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 9.1 Write property test for text editor
  - **Property 18: Double-Click Opens Text Editor**
  - **Property 19: Text Editor Saves on Close**
  - **Validates: Requirements 9.1, 9.4, 9.5**

- [ ] 10. Fix zoom functionality
  - Implement zoom in/out with proper scaling
  - Add zoom reset functionality
  - Ensure zoom respects min/max bounds (50%-200%)
  - Scale all transform operations by zoom factor
  - Maintain canvas center during zoom
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [ ] 10.1 Write property test for zoom scaling
  - **Property 20: Zoom Scales Canvas Proportionally**
  - **Property 21: Zoom Preserves Canvas Center**
  - **Validates: Requirements 13.1, 13.2, 13.3, 13.5**

- [ ] 11. Fix element addition from tool sidebar
  - Ensure images are added correctly from library and upload
  - Fix text element creation with styling
  - Ensure shapes are added with correct styling
  - Fix goal linking from task tracker
  - Ensure stickers are added correctly
  - Add items at appropriate default positions
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_

- [ ] 11.1 Write property test for item addition
  - **Property 1: Item Addition Creates Valid Elements**
  - **Validates: Requirements 1.2, 1.4, 1.6, 1.8, 1.10**

- [ ] 12. Fix image library functionality
  - Ensure image upload works correctly
  - Fix image selection from categories
  - Implement search functionality
  - Fix favorites system (localStorage)
  - Ensure drag-and-drop from library works
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 13. Fix affirmation library functionality
  - Implement random affirmation selection
  - Fix category filtering
  - Implement search functionality
  - Ensure affirmations are added with proper styling
  - Fix drag-and-drop from library
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 14. Fix goal linking functionality
  - Fetch tasks from task tracker
  - Display tasks in goal tool
  - Create goal items with task reference
  - Update goal visual state based on task completion
  - Handle deleted tasks gracefully
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 14.1 Write property test for goal status sync
  - **Property 24: Goal Items Reflect Task Status**
  - **Validates: Requirements 12.4**

- [ ] 15. Fix grid display
  - Implement grid toggle functionality
  - Render grid lines at 20px intervals
  - Ensure grid has subtle opacity
  - Grid should not affect item behavior
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 16. Fix presentation mode
  - Implement mode switching
  - Hide all editing controls in presentation mode
  - Maximize canvas display
  - Prevent editing operations
  - Add exit functionality
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 17. Fix save functionality
  - Implement immediate persistence for all changes
  - Add manual save button functionality
  - Update "Last saved" timestamp
  - Show loading indicator during save
  - Display error messages on save failure
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 17.1 Write property test for persistence
  - **Property 23: All Changes Persist to Database**
  - **Validates: Requirements 4.5, 5.4, 6.5, 8.4, 16.1**

- [ ] 18. Fix export functionality
  - Implement PNG export using html2canvas
  - Capture canvas at 2x resolution
  - Exclude editing controls from export
  - Trigger download with board title as filename
  - Handle export errors gracefully
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 19. Fix background customization
  - Implement background color selection
  - Implement background image upload
  - Persist background changes to database
  - Apply saved background on board load
  - _Requirements: 19.1, 19.2, 19.3, 19.4_

- [ ] 20. Fix transform handle visibility and scaling
  - Ensure all handles are visible against any background
  - Implement proper cursor styles for each handle
  - Scale handles inversely with zoom to maintain consistent size
  - Ensure handles are easy to grab
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 20.1 Write property test for handle scaling
  - **Property 25: Transform Handles Scale with Zoom**
  - **Validates: Requirements 20.5**

- [ ] 21. Optimize performance
  - Implement debounced database updates for continuous operations
  - Add optimistic UI updates
  - Memoize CanvasItem components
  - Use CSS transforms for positioning
  - Test performance with 50+ items
  - _Design: Performance Considerations_

- [ ] 21.1 Write performance tests
  - Test drag latency < 16ms
  - Test resize latency < 16ms
  - Test rotation latency < 16ms

- [ ] 22. Add error handling
  - Validate empty text input
  - Handle network errors with retry
  - Handle missing task references for goals
  - Add error boundaries for component failures
  - Display user-friendly error messages
  - _Design: Error Handling_

- [ ] 23. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 24. Add accessibility features
  - Add ARIA labels to all interactive elements
  - Implement keyboard navigation
  - Add screen reader announcements
  - Ensure high contrast selection indicators
  - Test with keyboard-only navigation
  - _Design: Accessibility_

- [ ] 25. Implement mobile touch support
  - Add touch event handlers for tap, double-tap, long-press
  - Implement touch drag for moving items
  - Add pinch gesture for resizing items
  - Implement two-finger rotation gesture
  - Add two-finger pan for canvas navigation
  - Prevent default browser touch behaviors (zoom, scroll)
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ] 25.1 Write property test for touch drag
  - **Property 26: Touch Drag Updates Position**
  - **Validates: Requirements 21.2**

- [ ] 25.2 Write property test for pinch resize
  - **Property 27: Pinch Gesture Resizes Items**
  - **Validates: Requirements 21.3**

- [ ] 26. Implement responsive mobile UI
  - Create responsive breakpoints (mobile: 0-767px, tablet: 768-1023px, desktop: 1024px+)
  - Implement bottom sheet tool sidebar for mobile
  - Create floating action button toolbar for selected items
  - Increase touch target sizes to 44x44px minimum
  - Add mobile-specific confirmation dialogs
  - Implement slide-out drawer for main menu
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ] 26.1 Write property test for touch target sizes
  - **Property 28: Touch Targets Meet Minimum Size**
  - **Validates: Requirements 22.3**

- [ ] 27. Implement responsive canvas scaling
  - Add viewport meta tag configuration
  - Implement auto-scaling for mobile viewports
  - Add fit-to-screen button for mobile
  - Handle orientation changes (portrait/landscape)
  - Recalculate canvas positioning on resize
  - Enable vertical scrolling when needed
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5_

- [ ] 27.1 Write property test for canvas scaling
  - **Property 29: Canvas Scales to Viewport**
  - **Validates: Requirements 25.1**

- [ ] 28. Implement tablet-optimized layout
  - Create tablet-specific layout with sidebar + canvas
  - Add stylus support with pressure sensitivity
  - Support both touch and mouse/trackpad input
  - Optimize layout for landscape orientation
  - Adjust layout for portrait orientation
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 29. Optimize mobile performance
  - Implement passive event listeners for scroll performance
  - Add touch event debouncing
  - Optimize rendering for 60 FPS on mobile
  - Reduce visual effects on low-end devices
  - Implement lazy loading for images on mobile
  - Add performance monitoring for touch interactions
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [ ] 29.1 Write property test for touch performance
  - **Property 30: Touch Performance Maintains 60 FPS**
  - **Validates: Requirements 27.1**

- [ ] 30. Implement gesture recognition system
  - Create gesture detector utility
  - Implement tap detection (single and double)
  - Implement long-press detection
  - Implement pinch gesture recognition
  - Implement rotation gesture recognition
  - Implement pan gesture recognition
  - Add gesture conflict resolution
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ] 31. Add mobile-specific controls
  - Create floating action button component
  - Implement context menu on long-press
  - Add mobile-friendly delete confirmation
  - Create mobile toolbar with common actions
  - Add touch-optimized color pickers
  - Implement swipeable tool panels
  - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [ ] 32. Test cross-device consistency
  - Verify boards render identically across devices
  - Test real-time sync between devices
  - Verify board state preservation when switching devices
  - Test all features have equivalent mobile interactions
  - Ensure saves work consistently across all devices
  - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

- [ ] 33. Mobile testing and polish
  - Test on iOS devices (iPhone, iPad)
  - Test on Android devices (phones, tablets)
  - Test with different screen sizes
  - Test touch interactions feel natural
  - Test performance on low-end devices
  - Verify no browser gesture conflicts
  - Test orientation changes
  - Test with stylus on supported devices

- [ ] 34. Final cross-platform testing
  - Run through manual testing checklist on desktop
  - Run through manual testing checklist on mobile
  - Run through manual testing checklist on tablet
  - Test all item types on all devices
  - Test all interactions at different zoom levels
  - Test keyboard shortcuts on desktop/tablet
  - Test touch gestures on mobile/tablet
  - Fix any remaining bugs
  - _Design: Manual Testing Checklist_
