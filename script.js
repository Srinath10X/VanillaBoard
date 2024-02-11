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
  curve = [
    {
      x: e.offsetX || e.touches[0].clientX,
      y: e.offsetY || e.touches[0].clientY,
    },
  ];
  e.preventDefault(); // Prevent default behavior like text selection
}

function draw(e) {
  if (!isDrawing) return;
  const x = e.offsetX || e.touches[0].clientX;
  const y = e.offsetY || e.touches[0].clientY;

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

// Touch events
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

// Prevent right-click context menu inside the canvas
canvas.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Focus on canvas when hovered over
canvas.addEventListener("mouseenter", function () {
  canvas.focus();
});
