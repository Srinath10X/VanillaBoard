const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let isDrawing = false;
let strokeSize = 5; // Change this value to increase the stroke size
let curve = [];
let drawings = []; // Array to store previous drawings
let undoActions = []; // Array to store actions for undo

// Set initial stroke size and smooth stroke
ctx.lineWidth = strokeSize;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.strokeStyle = "#cdd6f4"; // Initial stroke color

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

// Function to undo the last drawing action
function undo() {
  if (drawings.length > 0) {
    // Remove the last drawing from the drawings array and store it in undoActions
    undoActions.push(drawings.pop());
    // Redraw the canvas
    redraw();
  }
}

// Function to redo the last undone drawing action
function redo() {
  if (undoActions.length > 0) {
    // Retrieve the last undone drawing from the undoActions array and add it back to drawings
    drawings.push(undoActions.pop());
    // Redraw the canvas
    redraw();
  }
}

function clearCanvas() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawings = []; // clearing the drawings array
  undoActions = []; // clearing the undoActions array
}

// Function to update canvas dimensions
function updateCanvasSize() {
  // Preserve current stroke color and width
  const currentStrokeColor = ctx.strokeStyle;
  const currentStrokeWidth = ctx.lineWidth;

  // Resize canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Restore preserved stroke color and width
  ctx.strokeStyle = currentStrokeColor;
  ctx.lineWidth = currentStrokeWidth;

  redraw(); // Redraw after resizing
}

// Add event listener for window resize
window.addEventListener("resize", updateCanvasSize);
