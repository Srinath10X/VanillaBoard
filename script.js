const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let strokeSize = 5; // Change this value to increase the stroke size
let curve = [];
let drawings = []; // Array to store previous drawings

// Set initial stroke size and smooth stroke
ctx.lineWidth = strokeSize;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.strokeStyle = "#000"; // Initial stroke color

function startDrawing(e) {
  isDrawing = true;
  curve = [{ x: e.offsetX, y: e.offsetY }];
  e.preventDefault(); // Prevent default behavior like text selection
}

function draw(e) {
  if (!isDrawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  curve.push({ x, y });
  redraw();
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    drawings.push(curve);
    curve = [];
  }
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw previous drawings
  for (const drawing of drawings) {
    ctx.beginPath();
    ctx.moveTo(drawing[0].x, drawing[0].y);
    for (let i = 1; i < drawing.length - 2; i++) {
      const cX = (drawing[i].x + drawing[i + 1].x) / 2;
      const cY = (drawing[i].y + drawing[i + 1].y) / 2;
      ctx.quadraticCurveTo(drawing[i].x, drawing[i].y, cX, cY);
    }
    // For the last two points
    ctx.quadraticCurveTo(
      drawing[drawing.length - 2].x,
      drawing[drawing.length - 2].y,
      drawing[drawing.length - 1].x,
      drawing[drawing.length - 1].y,
    );
    ctx.stroke();
  }

  // Draw current drawing
  ctx.beginPath();
  ctx.moveTo(curve[0].x, curve[0].y);
  for (let i = 1; i < curve.length - 2; i++) {
    const cX = (curve[i].x + curve[i + 1].x) / 2;
    const cY = (curve[i].y + curve[i + 1].y) / 2;
    ctx.quadraticCurveTo(curve[i].x, curve[i].y, cX, cY);
  }
  // For the last two points
  ctx.quadraticCurveTo(
    curve[curve.length - 2].x,
    curve[curve.length - 2].y,
    curve[curve.length - 1].x,
    curve[curve.length - 1].y,
  );
  ctx.stroke();
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Function to save canvas as image
function saveAsImage() {
  const dataURL = canvas.toDataURL("image/png"); // Change "image/png" to "image/jpeg" for JPG format
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "drawing.png"; // Change "drawing.png" to "drawing.jpg" for JPG format
  link.click();
}

// Example usage: Add a button to trigger the saveAsImage function
const saveButton = document.createElement("button");
saveButton.textContent = "Save as Image";
saveButton.addEventListener("click", saveAsImage);
document.body.appendChild(saveButton);

let undoActions = [];

// Function to undo the last drawing action
function undo() {
  if (drawings.length > 0) {
    // Remove the last drawing from the drawings array and store it in redoDrawings
    redoDrawings.push(drawings.pop());
    // Redraw the canvas
    redraw();
  }
  if (rectangles.length > 0) {
    undoActions.push(rectangles.pop()); // Store the removed rectangle for redo
    redrawRectangles();
  }
}

// Function to redo the last undone drawing action
function redo() {
  if (redoDrawings.length > 0) {
    // Retrieve the last undone drawing from the redoDrawings array and add it back to drawings
    drawings.push(redoDrawings.pop());
    // Redraw the canvas
    redraw();
  }
  if (undoActions.length > 0) {
    rectangles.push(undoActions.pop()); // Restore the last removed rectangle
    redrawRectangles();
  }
}

// Example usage: Create Undo button
const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
undoButton.addEventListener("click", undo);
document.body.appendChild(undoButton);

// Example usage: Create Redo button
const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
redoButton.addEventListener("click", redo);
document.body.appendChild(redoButton);

// Initialize redoDrawings array
let redoDrawings = [];

// Variables to store the starting point of the rectangle
let startX, startY;

// Function to handle mousedown event for starting the rectangle drawing
function startDrawingRectangle(e) {
  startX = e.offsetX;
  startY = e.offsetY;
}

// Function to handle mouseup event for finalizing the rectangle
function stopDrawingRectangle(e) {
  const endX = e.offsetX;
  const endY = e.offsetY;

  // Calculate the top-left corner coordinates and dimensions of the rectangle
  const rectX = Math.min(startX, endX);
  const rectY = Math.min(startY, endY);
  const rectWidth = Math.abs(endX - startX);
  const rectHeight = Math.abs(endY - startY);

  // Draw the final rectangle
  ctx.beginPath();
  ctx.rect(rectX, rectY, rectWidth, rectHeight);
  ctx.stroke();

  // Store the rectangle in the drawings array
  drawings.push([
    { x: rectX, y: rectY },
    { x: rectX + rectWidth, y: rectY + rectHeight },
  ]);
}

// Add event listeners for mousedown and mouseup events to control rectangle drawing
canvas.addEventListener("mousedown", startDrawingRectangle);
canvas.addEventListener("mouseup", stopDrawingRectangle);

// Array to store all rectangles
let rectangles = [];

// Function to draw all rectangles on the canvas
function drawRectangles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  rectangles.forEach((rect) => {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
  });
}

// Function to handle mouseup event for finalizing the rectangle
function stopDrawingRectangle(e) {
  const endX = e.offsetX;
  const endY = e.offsetY;

  // Calculate the top-left corner coordinates and dimensions of the rectangle
  const rectX = Math.min(startX, endX);
  const rectY = Math.min(startY, endY);
  const rectWidth = Math.abs(endX - startX);
  const rectHeight = Math.abs(endY - startY);

  // Add the rectangle to the rectangles array
  rectangles.push({ x: rectX, y: rectY, width: rectWidth, height: rectHeight });

  // Redraw all rectangles
  drawRectangles();
}

// Add event listeners for mousedown and mouseup events to control rectangle drawing
canvas.addEventListener("mousedown", startDrawingRectangle);
canvas.addEventListener("mouseup", stopDrawingRectangle);

// Function to draw a rectangle preview on the canvas
function drawRectanglePreview(startX, startY, currentX, currentY) {
  const rectWidth = currentX - startX;
  const rectHeight = currentY - startY;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the preview rectangle
  ctx.beginPath();
  ctx.rect(startX, startY, rectWidth, rectHeight);
  ctx.stroke();
}

// Function to handle mousemove event for drawing the rectangle preview
function drawRectanglePreviewOnMove(e) {
  if (!isDrawing) return;

  const currentX = e.offsetX;
  const currentY = e.offsetY;

  // Draw the rectangle preview
  drawRectanglePreview(startX, startY, currentX, currentY);
}

// Add event listener for mousemove to draw rectangle preview
canvas.addEventListener("mousemove", drawRectanglePreviewOnMove);

// Function to draw all rectangles (including the preview) on the canvas
function drawRectangles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw the preview rectangle if drawing is in progress
  if (isDrawing) {
    const rectWidth = currentX - startX;
    const rectHeight = currentY - startY;

    ctx.beginPath();
    ctx.rect(startX, startY, rectWidth, rectHeight);
    ctx.stroke();
  }

  // Draw all existing rectangles
  rectangles.forEach((rect) => {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
  });
}

// Function to handle mousemove event for drawing the rectangle preview
function drawRectanglePreviewOnMove(e) {
  if (!isDrawing) return;

  currentX = e.offsetX;
  currentY = e.offsetY;

  // Redraw all rectangles (including the preview)
  drawRectangles();
}

function redrawRectangles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  rectangles.forEach((rectangle) => {
    // Draw each rectangle from the rectangles array
    ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  });
}

// Variable to store the stroke color
let strokeColor = "#000000"; // Initial stroke color

// Function to toggle the stroke pen color between black and red
function toggleStrokePen() {
  strokeColor = strokeColor === "#000000" ? "#ff0000" : "#000000";
}

// Function to handle mouse movement for drawing strokes
function draw(e) {
  if (!isDrawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  ctx.strokeStyle = strokeColor; // Set the stroke color
  ctx.beginPath();
  ctx.moveTo(prevX, prevY); // Start from the previous point
  ctx.lineTo(x, y); // Draw a line to the current point
  ctx.stroke();

  // Update the previous point
  prevX = x;
  prevY = y;

  // Store the current point in the curve array
  curve.push({ x, y });
}

// Add event listener to the toggleStrokeButton
toggleStrokeButton.addEventListener("click", toggleStrokePen);

// Update the startDrawing function to initialize the previous point
function startDrawing(e) {
  isDrawing = true;
  prevX = e.offsetX;
  prevY = e.offsetY;
  curve = [{ x: prevX, y: prevY }]; // Initialize the curve array with the starting point
  e.preventDefault(); // Prevent default behavior like text selection
}

// Update the stopDrawing function to handle storing the drawing and resetting the stroke color
function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    drawings.push(curve); // Store the drawing in the drawings array
    curve = []; // Reset the curve array
    ctx.strokeStyle = strokeColor; // Reset the stroke color
  }
}

// Update the redraw function to use the stroke color
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw previous drawings
  for (const drawing of drawings) {
    ctx.strokeStyle = strokeColor; // Set the stroke color
    ctx.beginPath();
    ctx.moveTo(drawing[0].x, drawing[0].y);
    for (let i = 1; i < drawing.length - 2; i++) {
      const cX = (drawing[i].x + drawing[i + 1].x) / 2;
      const cY = (drawing[i].y + drawing[i + 1].y) / 2;
      ctx.quadraticCurveTo(drawing[i].x, drawing[i].y, cX, cY);
    }
    // For the last two points
    ctx.quadraticCurveTo(
      drawing[drawing.length - 2].x,
      drawing[drawing.length - 2].y,
      drawing[drawing.length - 1].x,
      drawing[drawing.length - 1].y,
    );
    ctx.stroke();
  }

  // Draw current drawing
  ctx.strokeStyle = strokeColor; // Set the stroke color
  ctx.beginPath();
  ctx.moveTo(curve[0].x, curve[0].y);
  for (let i = 1; i < curve.length - 2; i++) {
    const cX = (curve[i].x + curve[i + 1].x) / 2;
    const cY = (curve[i].y + curve[i + 1].y) / 2;
    ctx.quadraticCurveTo(curve[i].x, curve[i].y, cX, cY);
  }
  // For the last two points
  ctx.quadraticCurveTo(
    curve[curve.length - 2].x,
    curve[curve.length - 2].y,
    curve[curve.length - 1].x,
    curve[curve.length - 1].y,
  );
  ctx.stroke();
}
