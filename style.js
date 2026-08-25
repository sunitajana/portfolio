 // ============================================================
        // PARTICLE NETWORK
        // ============================================================
        (function() {
            const canvas = document.getElementById('particle-canvas');
            let ctx = canvas.getContext('2d');
            let width = window.innerWidth;
            let height = window.innerHeight;
            let particles = [];
            let mouseX = null,
                mouseY = null;
            let mouseActive = false;
            const PARTICLE_COUNT = 130;
            const CONNECT_DIST = 140;
            const REPULSION_FORCE = 1.2;
            const REPULSION_RADIUS = 110;

            class Particle {
                constructor(x, y, vx, vy, size, color) {
                    this.x = x;
                    this.y = y;
                    this.vx = vx;
                    this.vy = vy;
                    this.size = size;
                    this.color = color;
                    this.originalX = x;
                }
            }

            function initParticles() {
                particles = [];
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    let x = Math.random() * width;
                    let y = Math.random() * height;
                    let vx = (Math.random() - 0.5) * 0.6;
                    let vy = (Math.random() - 0.5) * 0.6;
                    let size = Math.random() * 2.8 + 1.2;
                    let hue = (Math.random() * 60 + 200) % 360;
                    if (Math.random() > 0.7) hue = 280 + Math.random() * 30;
                    let sat = 65 + Math.random() * 30;
                    let light = 60 + Math.random() * 30;
                    let color = `hsla(${hue}, ${sat}%, ${light}%, 0.8)`;
                    particles.push(new Particle(x, y, vx, vy, size, color));
                }
            }

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                mouseActive = true;
            });
            window.addEventListener('mouseleave', () => {
                mouseActive = false;
                mouseX = null;
                mouseY = null;
            });

            function updateParticles() {
                for (let i = 0; i < particles.length; i++) {
                    let p = particles[i];
                    p.vx += (Math.random() - 0.5) * 0.08;
                    p.vy += (Math.random() - 0.5) * 0.08;
                    p.vx *= 0.99;
                    p.vy *= 0.99;
                    let maxSpeed = 1.2;
                    if (p.vx > maxSpeed) p.vx = maxSpeed;
                    if (p.vx < -maxSpeed) p.vx = -maxSpeed;
                    if (p.vy > maxSpeed) p.vy = maxSpeed;
                    if (p.vy < -maxSpeed) p.vy = -maxSpeed;

                    if (mouseActive && mouseX !== null && mouseY !== null) {
                        let dx = p.x - mouseX;
                        let dy = p.y - mouseY;
                        let dist = Math.hypot(dx, dy);
                        if (dist < REPULSION_RADIUS && dist > 0.01) {
                            let force = (1 - dist / REPULSION_RADIUS) * REPULSION_FORCE;
                            let angle = Math.atan2(dy, dx);
                            let pushX = Math.cos(angle) * force;
                            let pushY = Math.sin(angle) * force;
                            p.vx += pushX;
                            p.vy += pushY;
                        }
                    }
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 5) { p.x = 5;
                        p.vx *= -0.92; }
                    if (p.x > width - 5) { p.x = width - 5;
                        p.vx *= -0.92; }
                    if (p.y < 5) { p.y = 5;
                        p.vy *= -0.92; }
                    if (p.y > height - 5) { p.y = height - 5;
                        p.vy *= -0.92; }
                }
            }

            function drawParticlesAndLines() {
                if (!ctx) return;
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = 'rgba(3, 5, 18, 0.2)';
                ctx.fillRect(0, 0, width, height);

                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p1 = particles[i];
                        const p2 = particles[j];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distance = Math.hypot(dx, dy);
                        if (distance < CONNECT_DIST) {
                            let opacity = (1 - distance / CONNECT_DIST) * 0.45;
                            let gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                            gradient.addColorStop(0, `rgba(100, 150, 255, ${opacity * 0.9})`);
                            gradient.addColorStop(1, `rgba(170, 100, 255, ${opacity * 0.9})`);
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = gradient;
                            ctx.lineWidth = 1.2;
                            ctx.stroke();
                        }
                    }
                }
                for (let p of particles) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = "rgba(90, 120, 255, 0.6)";
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
                    ctx.fillStyle = "white";
                    ctx.fill();
                }
            }

            function animateNetwork() {
                if (!canvas || !ctx) return;
                updateParticles();
                drawParticlesAndLines();
                requestAnimationFrame(animateNetwork);
            }

            function resizeCanvas() {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                initParticles();
            }
            window.addEventListener('resize', resizeCanvas);

            function setupCanvas() {
                resizeCanvas();
                ctx = canvas.getContext('2d');
                animateNetwork();
            }
            setupCanvas();

            // Dynamic role changer
            const roles = [
                "digital alchemist",
                "interactive storyteller",
                "UX/UI architect",
                "creative developer",
                "visionary designer",
                "3D & motion crafter"
            ];
            let roleIndex = 0;
            const roleElement = document.getElementById('changingRole');
            if (roleElement) {
                setInterval(() => {
                    roleIndex = (roleIndex + 1) % roles.length;
                    roleElement.style.opacity = '0';
                    setTimeout(() => {
                        roleElement.textContent = roles[roleIndex];
                        roleElement.style.opacity = '1';
                    }, 150);
                }, 2800);
            }

            // Button glow effect
            const btns = document.querySelectorAll('.btn');
            btns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    btn.style.setProperty('--x', `${x}px`);
                    btn.style.setProperty('--y', `${y}px`);
                });
            });

            // Inject extra button styles
            const style = document.createElement('style');
            style.textContent = `
                .btn {
                  position: relative;
                  overflow: hidden;
                  transition: transform 0.25s, box-shadow 0.3s;
                }
                .btn::before {
                  content: '';
                  position: absolute;
                  top: var(--y, 50%);
                  left: var(--x, 50%);
                  width: 0px;
                  height: 0px;
                  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%);
                  transform: translate(-50%, -50%);
                  transition: width 0.3s, height 0.3s;
                  border-radius: 50%;
                  pointer-events: none;
                }
                .btn:hover::before {
                  width: 240px;
                  height: 240px;
                }
              `;
            document.head.appendChild(style);

            console.log('Uniq banner ready — interactive particle network and glitch identity');
        })();