const canvas = document.getElementById("signal-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const targetCount = Math.round(Math.min(105, Math.max(46, width / 16)));
  particles = Array.from({ length: targetCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    r: Math.random() * 1.4 + 0.45,
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    if (p.y < -20) p.y = height + 20;
    if (p.y > height + 20) p.y = -20;

    if (pointer.active) {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist > 1) {
        p.x += (dx / dist) * 0.34;
        p.y += (dy / dist) * 0.34;
      }
    }
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 136) {
        const alpha = (1 - dist / 136) * 0.2;
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const p of particles) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
draw();
