# TRACEABILITY DB

## COVERAGE ANALYSIS

Total requirements: 146
Coverage: 39.04

The following properties are missing tasks:
- Property 3: Canvas Click Deselects Items
- Property 4: Drag Updates Position in Real-Time
- Property 11: Rotation Updates in Real-Time
- Property 13: Bring Forward Increases Z-Index
- Property 14: Send Backward Decreases Z-Index
- Property 19: Text Editor Saves on Close
- Property 21: Zoom Preserves Canvas Center
- Property 22: Keyboard Shortcuts Work Consistently

## TRACEABILITY

### Property 1: Item Addition Creates Valid Elements

*For any* element type (image, text, shape, goal, sticker) and valid content, when added to the canvas, the system should create a board item with all required properties (id, board_id, type, content, x, y, width, height, z_index).

**Validates**
- Criteria 1.2: WHEN a user selects an image from the library or uploads a custom image, THEN the System SHALL add the image to the canvas at a default position
- Criteria 1.4: WHEN a user enters text and clicks "Add Text", THEN the System SHALL create a text element on the canvas with the specified content and styling
- Criteria 1.6: WHEN a user selects a shape, THEN the System SHALL add the shape to the canvas with default size and color
- Criteria 1.8: WHEN a user selects a task to link, THEN the System SHALL create a goal element on the canvas displaying the task information
- Criteria 1.10: WHEN a user selects a sticker, THEN the System SHALL add the sticker to the canvas

**Implementation tasks**
- Task 11.1: 11.1 Write property test for item addition

**Implemented PBTs**
- No implemented PBTs found

### Property 2: Item Selection Shows Transform Controls

*For any* board item, when selected, the system should display all transform controls (8 resize handles, 1 rotation handle, delete button) and a visual selection indicator.

**Validates**
- Criteria 2.1: WHEN a user clicks on any board item, THEN the System SHALL select that item and display transform controls
- Criteria 2.2: WHEN an item is selected, THEN the System SHALL display a visual indicator (border or highlight) around the item
- Criteria 2.5: WHEN an item is selected, THEN the System SHALL display delete, duplicate, and layering controls in the toolbar
- Criteria 4.1: WHEN an item is selected, THEN the System SHALL display eight resize handles (four corners and four edges)
- Criteria 5.1: WHEN an item is selected, THEN the System SHALL display a rotation handle above the item

**Implementation tasks**
- Task 4.1: 4.1 Write property test for selection behavior

**Implemented PBTs**
- No implemented PBTs found

### Property 3: Canvas Click Deselects Items

*For any* selected item, when the canvas background is clicked, the system should deselect the item and hide all transform controls.

**Validates**
- Criteria 2.3: WHEN a user clicks on the canvas background, THEN the System SHALL deselect any currently selected item

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 4: Drag Updates Position in Real-Time

*For any* board item, when dragged, the system should continuously update the item's x and y coordinates to follow the cursor position relative to the canvas.

**Validates**
- Criteria 3.1: WHEN a user clicks and holds on a board item, THEN the System SHALL enable drag mode for that item
- Criteria 3.2: WHILE dragging an item, THEN the System SHALL update the item's position in real-time to follow the cursor
- Criteria 3.3: WHEN a user releases the mouse button, THEN the System SHALL finalize the item's position and persist the change

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 5: Drag Respects Canvas Boundaries

*For any* board item being dragged, the system should constrain the item's position so that it remains fully within the canvas boundaries (0 ≤ x ≤ canvasWidth - itemWidth, 0 ≤ y ≤ canvasHeight - itemHeight).

**Validates**
- Criteria 3.4: WHEN a user drags an item beyond the canvas boundaries, THEN the System SHALL constrain the item to remain within the canvas

**Implementation tasks**
- Task 1.1: 1.1 Write property test for drag boundary constraints

**Implemented PBTs**
- No implemented PBTs found

### Property 6: Arrow Keys Nudge Selected Items

*For any* selected item and arrow key direction, pressing the arrow key should move the item by 1 pixel in that direction, and pressing Shift + arrow key should move it by 10 pixels.

**Validates**
- Criteria 3.5: WHEN a user uses arrow keys on a selected item, THEN the System SHALL nudge the item by 1 pixel in the arrow direction
- Criteria 3.6: WHEN a user uses Shift + arrow keys on a selected item, THEN the System SHALL nudge the item by 10 pixels in the arrow direction
- Criteria 17.3: WHEN a user presses arrow keys with an item selected, THEN the System SHALL nudge the item in the arrow direction
- Criteria 17.4: WHEN a user presses Shift + arrow keys with an item selected, THEN the System SHALL nudge the item by 10 pixels

**Implementation tasks**
- Task 5.1: 5.1 Write property test for arrow key nudging

**Implemented PBTs**
- No implemented PBTs found

### Property 7: Resize Maintains Minimum Dimensions

*For any* board item being resized, the system should enforce that width ≥ 50 pixels and height ≥ 50 pixels, preventing the item from becoming too small.

**Validates**
- Criteria 4.4: WHEN resizing an item, THEN the System SHALL enforce a minimum size of 50 pixels in both dimensions

**Implementation tasks**
- Task 2.1: 2.1 Write property test for resize minimum dimensions

**Implemented PBTs**
- No implemented PBTs found

### Property 8: Corner Resize Maintains Aspect Ratio

*For any* board item, when a corner resize handle is dragged, the system should resize both width and height proportionally from the dragged corner.

**Validates**
- Criteria 4.2: WHEN a user drags a corner resize handle, THEN the System SHALL resize the item proportionally from that corner

**Implementation tasks**
- Task 2.2: 2.2 Write property test for corner resize

**Implemented PBTs**
- No implemented PBTs found

### Property 9: Edge Resize Changes One Dimension

*For any* board item, when an edge resize handle is dragged, the system should resize only the dimension perpendicular to that edge (horizontal edges change height, vertical edges change width).

**Validates**
- Criteria 4.3: WHEN a user drags an edge resize handle, THEN the System SHALL resize the item along that edge only

**Implementation tasks**
- Task 2.3: 2.3 Write property test for edge resize

**Implemented PBTs**
- No implemented PBTs found

### Property 10: Rotation Preserves Position and Size

*For any* board item, when rotated to any angle, the item's x, y, width, and height properties should remain unchanged (only the rotation property changes).

**Validates**
- Criteria 5.5: WHEN an item is rotated, THEN the System SHALL maintain the item's position and size

**Implementation tasks**
- Task 3.1: 3.1 Write property test for rotation invariants

**Implemented PBTs**
- No implemented PBTs found

### Property 11: Rotation Updates in Real-Time

*For any* board item, when the rotation handle is dragged, the system should continuously update the rotation angle based on the angle between the item's center and the cursor position.

**Validates**
- Criteria 5.2: WHEN a user drags the rotation handle, THEN the System SHALL rotate the item around its center point
- Criteria 5.3: WHILE rotating, THEN the System SHALL update the rotation angle in real-time to follow the cursor position

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 12: Z-Index Determines Render Order

*For any* set of overlapping board items, the system should render items in ascending z-index order, with higher z-index items appearing on top of lower z-index items.

**Validates**
- Criteria 6.3: WHEN items overlap, THEN the System SHALL render items with higher z-index values on top of items with lower z-index values

**Implementation tasks**
- Task 6.1: 6.1 Write property test for z-index rendering order

**Implemented PBTs**
- No implemented PBTs found

### Property 13: Bring Forward Increases Z-Index

*For any* selected item, clicking "Bring Forward" should increase the item's z-index to be greater than the current maximum z-index of all items.

**Validates**
- Criteria 6.1: WHEN a user clicks "Bring Forward" on a selected item, THEN the System SHALL increase the item's z-index to appear above other items

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 14: Send Backward Decreases Z-Index

*For any* selected item, clicking "Send Backward" should decrease the item's z-index to be less than the current minimum z-index of all items (but not below 1).

**Validates**
- Criteria 6.2: WHEN a user clicks "Send Backward" on a selected item, THEN the System SHALL decrease the item's z-index to appear below other items

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 15: New Items Have Highest Z-Index

*For any* new item added to the canvas, the system should assign it a z-index value that is greater than all existing items' z-index values.

**Validates**
- Criteria 6.4: WHEN a new item is added to the canvas, THEN the System SHALL assign it a z-index higher than all existing items

**Implementation tasks**
- Task 6.2: 6.2 Write property test for new item z-index

**Implemented PBTs**
- No implemented PBTs found

### Property 16: Delete Removes Item Completely

*For any* board item, when deleted (via button or Delete key), the system should remove the item from both the canvas UI and the database, and deselect any selection.

**Validates**
- Criteria 7.1: WHEN a user clicks the delete button on a selected item, THEN the System SHALL remove the item from the canvas and database
- Criteria 7.2: WHEN a user presses the Delete key with an item selected, THEN the System SHALL remove the item from the canvas and database
- Criteria 7.3: WHEN an item is deleted, THEN the System SHALL deselect any selection
- Criteria 7.4: WHEN an item is deleted, THEN the System SHALL update the canvas immediately without requiring a page refresh

**Implementation tasks**
- Task 7.1: 7.1 Write property test for deletion

**Implemented PBTs**
- No implemented PBTs found

### Property 17: Duplicate Creates Identical Copy with Offset

*For any* board item, when duplicated, the system should create a new item with identical properties (type, content, width, height, rotation, style) except for id (which must be unique) and position (which should be offset by +20 pixels in both x and y).

**Validates**
- Criteria 8.1: WHEN a user clicks the duplicate button on a selected item, THEN the System SHALL create a copy of the item with identical properties
- Criteria 8.2: WHEN an item is duplicated, THEN the System SHALL offset the duplicate's position by 20 pixels in both x and y directions
- Criteria 8.3: WHEN an item is duplicated, THEN the System SHALL assign the duplicate a new unique ID
- Criteria 8.5: WHEN an item is duplicated, THEN the System SHALL automatically select the new duplicate

**Implementation tasks**
- Task 8.1: 8.1 Write property test for duplication

**Implemented PBTs**
- No implemented PBTs found

### Property 18: Double-Click Opens Text Editor

*For any* text or affirmation item, when double-clicked, the system should display the inline text editor with the current content and styling.

**Validates**
- Criteria 9.1: WHEN a user double-clicks a text or affirmation element, THEN the System SHALL display an inline text editor

**Implementation tasks**
- Task 9.1: 9.1 Write property test for text editor

**Implemented PBTs**
- No implemented PBTs found

### Property 19: Text Editor Saves on Close

*For any* text editor instance, when closed (via click outside or Escape key), the system should save any changes to content or styling and persist them to the database.

**Validates**
- Criteria 9.4: WHEN a user clicks outside the text editor or presses Escape, THEN the System SHALL close the editor and save changes
- Criteria 9.5: WHEN text styling is changed, THEN the System SHALL update the element's appearance immediately and persist to the database

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 20: Zoom Scales Canvas Proportionally

*For any* zoom level between 50% and 200%, the canvas should scale proportionally, and all transform operations (drag, resize, rotate) should be adjusted by the zoom factor to maintain accurate positioning.

**Validates**
- Criteria 13.1: WHEN a user clicks the zoom in button, THEN the System SHALL increase the canvas zoom level by 10%
- Criteria 13.2: WHEN a user clicks the zoom out button, THEN the System SHALL decrease the canvas zoom level by 10%
- Criteria 13.3: WHEN a user clicks the reset zoom button, THEN the System SHALL reset the canvas zoom to 100%
- Criteria 13.5: WHEN zoomed, THEN the System SHALL scale all transform operations appropriately to match the zoom level
- Criteria 13.6: WHEN the zoom level is below 50% or above 200%, THEN the System SHALL prevent further zooming in that direction

**Implementation tasks**
- Task 10.1: 10.1 Write property test for zoom scaling

**Implemented PBTs**
- No implemented PBTs found

### Property 21: Zoom Preserves Canvas Center

*For any* zoom level change, the canvas center point should remain in the same position in the viewport (zoom should feel like it's zooming toward/away from the center).

**Validates**
- Criteria 13.4: WHEN the zoom level changes, THEN the System SHALL maintain the canvas center point

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 22: Keyboard Shortcuts Work Consistently

*For any* selected item, pressing Delete should delete it, pressing Escape should deselect it, and pressing Ctrl/Cmd + D should duplicate it.

**Validates**
- Criteria 17.1: WHEN a user presses Delete with an item selected, THEN the System SHALL delete the selected item
- Criteria 17.2: WHEN a user presses Escape, THEN the System SHALL deselect any selected item
- Criteria 17.5: WHEN a user presses Ctrl/Cmd + D with an item selected, THEN the System SHALL duplicate the selected item

**Implementation tasks**

**Implemented PBTs**
- No implemented PBTs found

### Property 23: All Changes Persist to Database

*For any* item property change (position, size, rotation, z-index, content, style), the system should persist the change to the database immediately after the operation completes.

**Validates**
- Criteria 4.5: WHEN a user releases the resize handle, THEN the System SHALL persist the new dimensions to the database
- Criteria 5.4: WHEN a user releases the rotation handle, THEN the System SHALL persist the rotation angle to the database
- Criteria 6.5: WHEN z-index changes occur, THEN the System SHALL persist the new z-index values to the database
- Criteria 8.4: WHEN an item is duplicated, THEN the System SHALL persist the duplicate to the database
- Criteria 16.1: WHEN a user makes any change to a board item, THEN the System SHALL persist the change to the database immediately
- Criteria 16.2: WHEN a user clicks the "Save" button, THEN the System SHALL save the board title and any pending changes

**Implementation tasks**
- Task 17.1: 17.1 Write property test for persistence

**Implemented PBTs**
- No implemented PBTs found

### Property 24: Goal Items Reflect Task Status

*For any* goal item linked to a task, the item's visual state (completion indicator) should match the task's completion status from the task tracker.

**Validates**
- Criteria 12.4: WHEN a linked task is completed in the task tracker, THEN the System SHALL update the goal element's visual state to show completion

**Implementation tasks**
- Task 14.1: 14.1 Write property test for goal status sync

**Implemented PBTs**
- No implemented PBTs found

### Property 25: Transform Handles Scale with Zoom

*For any* zoom level, transform handles should maintain a consistent visual size (in screen pixels) by scaling inversely with the zoom level, ensuring they remain easy to interact with.

**Validates**
- Criteria 20.5: WHEN the zoom level changes, THEN the System SHALL scale transform handles to remain consistently sized

**Implementation tasks**
- Task 20.1: 20.1 Write property test for handle scaling

**Implemented PBTs**
- No implemented PBTs found

## DATA

### ACCEPTANCE CRITERIA (146 total)
- 1.1: WHEN a user clicks the image icon in the tool sidebar, THEN the System SHALL display an image upload interface and image library (not covered)
- 1.2: WHEN a user selects an image from the library or uploads a custom image, THEN the System SHALL add the image to the canvas at a default position (covered)
- 1.3: WHEN a user clicks the text icon in the tool sidebar, THEN the System SHALL display a text input interface with formatting options (not covered)
- 1.4: WHEN a user enters text and clicks "Add Text", THEN the System SHALL create a text element on the canvas with the specified content and styling (covered)
- 1.5: WHEN a user clicks the shape icon in the tool sidebar, THEN the System SHALL display a palette of shape options (rectangles, circles, rounded rectangles) (not covered)
- 1.6: WHEN a user selects a shape, THEN the System SHALL add the shape to the canvas with default size and color (covered)
- 1.7: WHEN a user clicks the goal icon in the tool sidebar, THEN the System SHALL display a list of tasks from the user's task tracker (not covered)
- 1.8: WHEN a user selects a task to link, THEN the System SHALL create a goal element on the canvas displaying the task information (covered)
- 1.9: WHEN a user clicks the sticker icon in the tool sidebar, THEN the System SHALL display a library of emoji stickers (not covered)
- 1.10: WHEN a user selects a sticker, THEN the System SHALL add the sticker to the canvas (covered)
- 2.1: WHEN a user clicks on any board item, THEN the System SHALL select that item and display transform controls (covered)
- 2.2: WHEN an item is selected, THEN the System SHALL display a visual indicator (border or highlight) around the item (covered)
- 2.3: WHEN a user clicks on the canvas background, THEN the System SHALL deselect any currently selected item (covered)
- 2.4: WHEN a user presses the Escape key, THEN the System SHALL deselect any currently selected item (not covered)
- 2.5: WHEN an item is selected, THEN the System SHALL display delete, duplicate, and layering controls in the toolbar (covered)
- 3.1: WHEN a user clicks and holds on a board item, THEN the System SHALL enable drag mode for that item (covered)
- 3.2: WHILE dragging an item, THEN the System SHALL update the item's position in real-time to follow the cursor (covered)
- 3.3: WHEN a user releases the mouse button, THEN the System SHALL finalize the item's position and persist the change (covered)
- 3.4: WHEN a user drags an item beyond the canvas boundaries, THEN the System SHALL constrain the item to remain within the canvas (covered)
- 3.5: WHEN a user uses arrow keys on a selected item, THEN the System SHALL nudge the item by 1 pixel in the arrow direction (covered)
- 3.6: WHEN a user uses Shift + arrow keys on a selected item, THEN the System SHALL nudge the item by 10 pixels in the arrow direction (covered)
- 4.1: WHEN an item is selected, THEN the System SHALL display eight resize handles (four corners and four edges) (covered)
- 4.2: WHEN a user drags a corner resize handle, THEN the System SHALL resize the item proportionally from that corner (covered)
- 4.3: WHEN a user drags an edge resize handle, THEN the System SHALL resize the item along that edge only (covered)
- 4.4: WHEN resizing an item, THEN the System SHALL enforce a minimum size of 50 pixels in both dimensions (covered)
- 4.5: WHEN a user releases the resize handle, THEN the System SHALL persist the new dimensions to the database (covered)
- 5.1: WHEN an item is selected, THEN the System SHALL display a rotation handle above the item (covered)
- 5.2: WHEN a user drags the rotation handle, THEN the System SHALL rotate the item around its center point (covered)
- 5.3: WHILE rotating, THEN the System SHALL update the rotation angle in real-time to follow the cursor position (covered)
- 5.4: WHEN a user releases the rotation handle, THEN the System SHALL persist the rotation angle to the database (covered)
- 5.5: WHEN an item is rotated, THEN the System SHALL maintain the item's position and size (covered)
- 6.1: WHEN a user clicks "Bring Forward" on a selected item, THEN the System SHALL increase the item's z-index to appear above other items (covered)
- 6.2: WHEN a user clicks "Send Backward" on a selected item, THEN the System SHALL decrease the item's z-index to appear below other items (covered)
- 6.3: WHEN items overlap, THEN the System SHALL render items with higher z-index values on top of items with lower z-index values (covered)
- 6.4: WHEN a new item is added to the canvas, THEN the System SHALL assign it a z-index higher than all existing items (covered)
- 6.5: WHEN z-index changes occur, THEN the System SHALL persist the new z-index values to the database (covered)
- 7.1: WHEN a user clicks the delete button on a selected item, THEN the System SHALL remove the item from the canvas and database (covered)
- 7.2: WHEN a user presses the Delete key with an item selected, THEN the System SHALL remove the item from the canvas and database (covered)
- 7.3: WHEN an item is deleted, THEN the System SHALL deselect any selection (covered)
- 7.4: WHEN an item is deleted, THEN the System SHALL update the canvas immediately without requiring a page refresh (covered)
- 8.1: WHEN a user clicks the duplicate button on a selected item, THEN the System SHALL create a copy of the item with identical properties (covered)
- 8.2: WHEN an item is duplicated, THEN the System SHALL offset the duplicate's position by 20 pixels in both x and y directions (covered)
- 8.3: WHEN an item is duplicated, THEN the System SHALL assign the duplicate a new unique ID (covered)
- 8.4: WHEN an item is duplicated, THEN the System SHALL persist the duplicate to the database (covered)
- 8.5: WHEN an item is duplicated, THEN the System SHALL automatically select the new duplicate (covered)
- 9.1: WHEN a user double-clicks a text or affirmation element, THEN the System SHALL display an inline text editor (covered)
- 9.2: WHEN the text editor is open, THEN the System SHALL allow the user to modify the text content (not covered)
- 9.3: WHEN the text editor is open, THEN the System SHALL provide controls for font size, bold, italic, and color (not covered)
- 9.4: WHEN a user clicks outside the text editor or presses Escape, THEN the System SHALL close the editor and save changes (covered)
- 9.5: WHEN text styling is changed, THEN the System SHALL update the element's appearance immediately and persist to the database (covered)
- 10.1: WHEN a user clicks "Random Affirmation" in the text tool, THEN the System SHALL select and display a random affirmation from the library (not covered)
- 10.2: WHEN a user searches the affirmation library, THEN the System SHALL filter affirmations by the search query (not covered)
- 10.3: WHEN a user clicks an affirmation category, THEN the System SHALL display affirmations from that category (not covered)
- 10.4: WHEN a user selects an affirmation, THEN the System SHALL add it to the canvas as a text element (not covered)
- 10.5: WHEN an affirmation is added, THEN the System SHALL apply default styling appropriate for affirmations (not covered)
- 11.1: WHEN a user opens the image tool, THEN the System SHALL display categorized stock images (not covered)
- 11.2: WHEN a user searches the image library, THEN the System SHALL filter images by the search query (not covered)
- 11.3: WHEN a user clicks "Upload Image", THEN the System SHALL open a file picker for image selection (not covered)
- 11.4: WHEN a user selects an image file, THEN the System SHALL upload the image and add it to the canvas (not covered)
- 11.5: WHEN an image is added, THEN the System SHALL maintain the image's aspect ratio by default (not covered)
- 12.1: WHEN a user opens the goal tool, THEN the System SHALL fetch and display the user's tasks from the task tracker (not covered)
- 12.2: WHEN a user selects a task, THEN the System SHALL create a goal element displaying the task title and priority (not covered)
- 12.3: WHEN a goal element is created, THEN the System SHALL store the task ID as a reference (not covered)
- 12.4: WHEN a linked task is completed in the task tracker, THEN the System SHALL update the goal element's visual state to show completion (covered)
- 12.5: WHEN a user clicks on a goal element, THEN the System SHALL display the task's completion status (not covered)
- 13.1: WHEN a user clicks the zoom in button, THEN the System SHALL increase the canvas zoom level by 10% (covered)
- 13.2: WHEN a user clicks the zoom out button, THEN the System SHALL decrease the canvas zoom level by 10% (covered)
- 13.3: WHEN a user clicks the reset zoom button, THEN the System SHALL reset the canvas zoom to 100% (covered)
- 13.4: WHEN the zoom level changes, THEN the System SHALL maintain the canvas center point (covered)
- 13.5: WHEN zoomed, THEN the System SHALL scale all transform operations appropriately to match the zoom level (covered)
- 13.6: WHEN the zoom level is below 50% or above 200%, THEN the System SHALL prevent further zooming in that direction (covered)
- 14.1: WHEN a user toggles the grid button, THEN the System SHALL display or hide a visual grid overlay on the canvas (not covered)
- 14.2: WHEN the grid is visible, THEN the System SHALL render grid lines at 20-pixel intervals (not covered)
- 14.3: WHEN the grid is visible, THEN the System SHALL render grid lines with subtle opacity to avoid visual clutter (not covered)
- 14.4: WHEN the grid state changes, THEN the System SHALL not affect item positions or behavior (not covered)
- 14.5: WHEN the board is saved, THEN the System SHALL not persist the grid visibility state (it resets each session) (not covered)
- 15.1: WHEN a user clicks the "Present" button, THEN the System SHALL enter presentation mode (not covered)
- 15.2: WHEN in presentation mode, THEN the System SHALL hide all editing controls and toolbars (not covered)
- 15.3: WHEN in presentation mode, THEN the System SHALL display the canvas at full screen or maximized size (not covered)
- 15.4: WHEN in presentation mode, THEN the System SHALL prevent all editing operations (not covered)
- 15.5: WHEN a user exits presentation mode, THEN the System SHALL return to the normal editing view (not covered)
- 16.1: WHEN a user makes any change to a board item, THEN the System SHALL persist the change to the database immediately (covered)
- 16.2: WHEN a user clicks the "Save" button, THEN the System SHALL save the board title and any pending changes (covered)
- 16.3: WHEN a save operation completes, THEN the System SHALL update the "Last saved" timestamp in the UI (not covered)
- 16.4: WHEN a save operation is in progress, THEN the System SHALL display a loading indicator on the save button (not covered)
- 16.5: WHEN a save operation fails, THEN the System SHALL display an error message to the user (not covered)
- 17.1: WHEN a user presses Delete with an item selected, THEN the System SHALL delete the selected item (covered)
- 17.2: WHEN a user presses Escape, THEN the System SHALL deselect any selected item (covered)
- 17.3: WHEN a user presses arrow keys with an item selected, THEN the System SHALL nudge the item in the arrow direction (covered)
- 17.4: WHEN a user presses Shift + arrow keys with an item selected, THEN the System SHALL nudge the item by 10 pixels (covered)
- 17.5: WHEN a user presses Ctrl/Cmd + D with an item selected, THEN the System SHALL duplicate the selected item (covered)
- 18.1: WHEN a user clicks "Export" and selects "Download as PNG", THEN the System SHALL generate a PNG image of the canvas (not covered)
- 18.2: WHEN exporting, THEN the System SHALL capture the canvas at high resolution (2x scale) (not covered)
- 18.3: WHEN exporting, THEN the System SHALL exclude editing controls from the exported image (not covered)
- 18.4: WHEN the export is complete, THEN the System SHALL trigger a download with the board title as the filename (not covered)
- 18.5: WHEN export fails, THEN the System SHALL display an error message to the user (not covered)
- 19.1: WHEN a user selects a background color, THEN the System SHALL apply the color to the entire canvas (not covered)
- 19.2: WHEN a user uploads a background image, THEN the System SHALL apply the image to the canvas with cover sizing (not covered)
- 19.3: WHEN a background is changed, THEN the System SHALL persist the change to the database (not covered)
- 19.4: WHEN a board is loaded, THEN the System SHALL apply the saved background color or image (not covered)
- 19.5: WHEN a background image is set, THEN the System SHALL ensure text elements remain readable (not covered)
- 20.1: WHEN an item is selected, THEN the System SHALL display all transform handles with clear visual indicators (not covered)
- 20.2: WHEN the cursor hovers over a resize handle, THEN the System SHALL display the appropriate resize cursor (not covered)
- 20.3: WHEN the cursor hovers over the rotation handle, THEN the System SHALL display a rotation cursor (not covered)
- 20.4: WHEN transform handles are displayed, THEN the System SHALL ensure they are visible against any background (not covered)
- 20.5: WHEN the zoom level changes, THEN the System SHALL scale transform handles to remain consistently sized (covered)
- 21.1: WHEN a user touches a board item on a mobile device, THEN the System SHALL select that item and display touch-optimized controls (not covered)
- 21.2: WHEN a user drags a finger on a selected item, THEN the System SHALL move the item following the touch position (not covered)
- 21.3: WHEN a user uses a pinch gesture on an item, THEN the System SHALL resize the item proportionally (not covered)
- 21.4: WHEN a user uses a two-finger rotation gesture on an item, THEN the System SHALL rotate the item around its center (not covered)
- 21.5: WHEN a user taps outside selected items, THEN the System SHALL deselect all items (not covered)
- 22.1: WHEN the application is viewed on a mobile device, THEN the System SHALL display a responsive layout optimized for the screen size (not covered)
- 22.2: WHEN a user opens the tool sidebar on mobile, THEN the System SHALL display it as a bottom sheet or modal overlay (not covered)
- 22.3: WHEN transform handles are displayed on mobile, THEN the System SHALL increase their touch target size to at least 44x44 pixels (not covered)
- 22.4: WHEN a user interacts with the canvas on mobile, THEN the System SHALL prevent default browser gestures (zoom, scroll) from interfering (not covered)
- 22.5: WHEN the device orientation changes, THEN the System SHALL adapt the layout appropriately (not covered)
- 23.1: WHEN the application is viewed on a tablet, THEN the System SHALL display the tool sidebar alongside the canvas (not covered)
- 23.2: WHEN a user uses a stylus on a tablet, THEN the System SHALL provide precise control for all interactions (not covered)
- 23.3: WHEN a user uses touch on a tablet, THEN the System SHALL support both single-touch and multi-touch gestures (not covered)
- 23.4: WHEN the tablet is in landscape mode, THEN the System SHALL maximize the canvas area while keeping tools accessible (not covered)
- 23.5: WHEN the tablet is in portrait mode, THEN the System SHALL adjust the layout to prioritize vertical space (not covered)
- 24.1: WHEN a user performs a single tap on an item, THEN the System SHALL select that item (not covered)
- 24.2: WHEN a user performs a double tap on a text item, THEN the System SHALL open the text editor (not covered)
- 24.3: WHEN a user performs a long press on an item, THEN the System SHALL display a context menu with item actions (not covered)
- 24.4: WHEN a user performs a two-finger pinch on the canvas, THEN the System SHALL zoom the canvas in or out (not covered)
- 24.5: WHEN a user performs a two-finger pan on the canvas, THEN the System SHALL pan the canvas view (not covered)
- 25.1: WHEN the viewport width is less than 768 pixels, THEN the System SHALL scale the canvas to fit the screen width (not covered)
- 25.2: WHEN the viewport height is less than the canvas height, THEN the System SHALL enable vertical scrolling (not covered)
- 25.3: WHEN a user zooms on mobile, THEN the System SHALL maintain touch interaction accuracy (not covered)
- 25.4: WHEN the screen size changes, THEN the System SHALL recalculate canvas scaling and positioning (not covered)
- 25.5: WHEN in mobile view, THEN the System SHALL provide a fit-to-screen button for quick canvas adjustment (not covered)
- 26.1: WHEN an item is selected on mobile, THEN the System SHALL display a floating action button toolbar with common actions (not covered)
- 26.2: WHEN a user taps the delete action on mobile, THEN the System SHALL show a confirmation dialog before deleting (not covered)
- 26.3: WHEN a user wants to duplicate an item on mobile, THEN the System SHALL provide a clear duplicate button in the action toolbar (not covered)
- 26.4: WHEN a user wants to change layering on mobile, THEN the System SHALL provide layer controls in the action toolbar (not covered)
- 26.5: WHEN a user opens the main menu on mobile, THEN the System SHALL display it as a slide-out drawer (not covered)
- 27.1: WHEN a user drags an item on mobile, THEN the System SHALL maintain 60 FPS frame rate (not covered)
- 27.2: WHEN a user performs a pinch gesture, THEN the System SHALL respond with less than 16ms latency (not covered)
- 27.3: WHEN multiple items are on the canvas, THEN the System SHALL optimize rendering to prevent lag on mobile devices (not covered)
- 27.4: WHEN touch events occur, THEN the System SHALL use passive event listeners where appropriate to improve scroll performance (not covered)
- 27.5: WHEN the device has limited resources, THEN the System SHALL reduce visual effects to maintain performance (not covered)
- 28.1: WHEN a board is created on desktop, THEN the System SHALL render it identically on mobile and tablet (not covered)
- 28.2: WHEN a user edits a board on mobile, THEN the System SHALL sync changes immediately to other devices (not covered)
- 28.3: WHEN switching between devices, THEN the System SHALL preserve the board state including item positions and properties (not covered)
- 28.4: WHEN a feature is available on desktop, THEN the System SHALL provide an equivalent interaction method on mobile (not covered)
- 28.5: WHEN a user saves on any device, THEN the System SHALL ensure the board is accessible and editable on all other devices (not covered)

### IMPORTANT ACCEPTANCE CRITERIA (0 total)

### CORRECTNESS PROPERTIES (25 total)
- Property 1: Item Addition Creates Valid Elements
- Property 2: Item Selection Shows Transform Controls
- Property 3: Canvas Click Deselects Items
- Property 4: Drag Updates Position in Real-Time
- Property 5: Drag Respects Canvas Boundaries
- Property 6: Arrow Keys Nudge Selected Items
- Property 7: Resize Maintains Minimum Dimensions
- Property 8: Corner Resize Maintains Aspect Ratio
- Property 9: Edge Resize Changes One Dimension
- Property 10: Rotation Preserves Position and Size
- Property 11: Rotation Updates in Real-Time
- Property 12: Z-Index Determines Render Order
- Property 13: Bring Forward Increases Z-Index
- Property 14: Send Backward Decreases Z-Index
- Property 15: New Items Have Highest Z-Index
- Property 16: Delete Removes Item Completely
- Property 17: Duplicate Creates Identical Copy with Offset
- Property 18: Double-Click Opens Text Editor
- Property 19: Text Editor Saves on Close
- Property 20: Zoom Scales Canvas Proportionally
- Property 21: Zoom Preserves Canvas Center
- Property 22: Keyboard Shortcuts Work Consistently
- Property 23: All Changes Persist to Database
- Property 24: Goal Items Reflect Task Status
- Property 25: Transform Handles Scale with Zoom

### IMPLEMENTATION TASKS (57 total)
1. Fix core drag and drop functionality
1.1 Write property test for drag boundary constraints
2. Fix resize functionality
2.1 Write property test for resize minimum dimensions
2.2 Write property test for corner resize
2.3 Write property test for edge resize
3. Fix rotation functionality
3.1 Write property test for rotation invariants
4. Fix item selection and deselection
4.1 Write property test for selection behavior
5. Implement keyboard shortcuts
5.1 Write property test for arrow key nudging
6. Fix z-index and layering controls
6.1 Write property test for z-index rendering order
6.2 Write property test for new item z-index
7. Fix item deletion
7.1 Write property test for deletion
8. Fix item duplication
8.1 Write property test for duplication
9. Fix text editing functionality
9.1 Write property test for text editor
10. Fix zoom functionality
10.1 Write property test for zoom scaling
11. Fix element addition from tool sidebar
11.1 Write property test for item addition
12. Fix image library functionality
13. Fix affirmation library functionality
14. Fix goal linking functionality
14.1 Write property test for goal status sync
15. Fix grid display
16. Fix presentation mode
17. Fix save functionality
17.1 Write property test for persistence
18. Fix export functionality
19. Fix background customization
20. Fix transform handle visibility and scaling
20.1 Write property test for handle scaling
21. Optimize performance
21.1 Write performance tests
22. Add error handling
23. Checkpoint - Ensure all tests pass
24. Add accessibility features
25. Implement mobile touch support
25.1 Write property test for touch drag
25.2 Write property test for pinch resize
26. Implement responsive mobile UI
26.1 Write property test for touch target sizes
27. Implement responsive canvas scaling
27.1 Write property test for canvas scaling
28. Implement tablet-optimized layout
29. Optimize mobile performance
29.1 Write property test for touch performance
30. Implement gesture recognition system
31. Add mobile-specific controls
32. Test cross-device consistency
33. Mobile testing and polish
34. Final cross-platform testing

### IMPLEMENTED PBTS (0 total)