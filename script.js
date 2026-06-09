// ==================== PARTICLE ANIMATION ====================
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.01;

        if (this.x > window.innerWidth) this.x = 0;
        if (this.x < 0) this.x = window.innerWidth;
        if (this.y > window.innerHeight) this.y = 0;
        if (this.y < 0) this.y = window.innerHeight;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 60;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(
                new Particle(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height
                )
            );
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==================== FALLING FLOWER LEAVES ====================
class FlowerLeafSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.leafCount = 20;
        this.createLeaves();
    }

    createLeaves() {
        for (let i = 0; i < this.leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('flower-leaf');
            
            const leafShape = document.createElement('div');
            leafShape.classList.add('leaf-shape');
            
            leaf.appendChild(leafShape);
            this.container.appendChild(leaf);

            const duration = Math.random() * 3 + 5;
            const delay = Math.random() * 5;
            const xOffset = Math.random() * window.innerWidth;
            const rotation = Math.random() * 360;
            const hue = Math.random() * 60 + 180;

            leaf.style.left = xOffset + 'px';
            leaf.style.animationDuration = duration + 's';
            leaf.style.animationDelay = delay + 's';
            leaf.style.filter = `hue-rotate(${hue}deg)`;

            leaf.addEventListener('animationend', () => {
                leaf.remove();
                const newLeaf = document.createElement('div');
                newLeaf.classList.add('flower-leaf');
                const newLeafShape = document.createElement('div');
                newLeafShape.classList.add('leaf-shape');
                newLeaf.appendChild(newLeafShape);
                this.container.appendChild(newLeaf);

                const newDuration = Math.random() * 3 + 5;
                const newXOffset = Math.random() * window.innerWidth;
                const newHue = Math.random() * 60 + 180;

                newLeaf.style.left = newXOffset + 'px';
                newLeaf.style.animationDuration = newDuration + 's';
                newLeaf.style.filter = `hue-rotate(${newHue}deg)`;
            });
        }
    }
}

// ==================== INTERACTIVE ROBOT ====================
class InteractiveRobot {
    constructor(element) {
        this.robot = element;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.currentX = window.innerWidth / 2 - 60;
        this.currentY = window.innerHeight / 2 - 70;
        this.velocityX = 0;
        this.velocityY = 0;

        this.setupEventListeners();
        this.autoMove();
        this.animate();
    }

    setupEventListeners() {
        this.robot.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());

        this.robot.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
        document.addEventListener('touchend', () => this.stopDrag());
    }

    startDrag(e) {
        this.isDragging = true;
        const rect = this.robot.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
    }

    drag(e) {
        if (!this.isDragging) return;

        this.currentX = e.clientX - this.offsetX;
        this.currentY = e.clientY - this.offsetY;

        this.currentX = Math.max(0, Math.min(this.currentX, window.innerWidth - 120));
        this.currentY = Math.max(0, Math.min(this.currentY, window.innerHeight - 140));

        this.robot.style.left = this.currentX + 'px';
        this.robot.style.top = this.currentY + 'px';
    }

    stopDrag() {
        this.isDragging = false;
    }

    autoMove() {
        if (this.isDragging) {
            setTimeout(() => this.autoMove(), 100);
            return;
        }

        const randomX = Math.random() * (window.innerWidth - 120);
        const randomY = Math.random() * (window.innerHeight - 250);

        this.smoothMove(randomX, randomY, 4000);
        setTimeout(() => this.autoMove(), Math.random() * 5000 + 4000);
    }

    smoothMove(targetX, targetY, duration) {
        const startX = this.currentX;
        const startY = this.currentY;
        const startTime = Date.now();

        const move = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.currentX = startX + (targetX - startX) * this.easeInOutQuad(progress);
            this.currentY = startY + (targetY - startY) * this.easeInOutQuad(progress);

            this.updatePosition();

            if (progress < 1 && !this.isDragging) {
                requestAnimationFrame(move);
            }
        };

        move();
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    updatePosition() {
        this.robot.style.left = this.currentX + 'px';
        this.robot.style.top = this.currentY + 'px';
    }
}

// ==================== CUTE DOG MOVEMENT ====================
class CuteDog {
    constructor(element) {
        this.dog = element;
        this.currentX = Math.random() * (window.innerWidth - 100);
        this.currentY = Math.random() * (window.innerHeight - 100);
        this.targetX = this.currentX;
        this.targetY = this.currentY;
        this.moving = false;

        this.dog.style.left = this.currentX + 'px';
        this.dog.style.top = this.currentY + 'px';
        
        this.startMovement();
    }

    startMovement() {
        setInterval(() => {
            this.targetX = Math.random() * (window.innerWidth - 100);
            this.targetY = Math.random() * (window.innerHeight - 100);
            this.moveToTarget();
        }, 3000);
    }

    moveToTarget() {
        const duration = 2000;
        const startTime = Date.now();
        const startX = this.currentX;
        const startY = this.currentY;

        const move = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.currentX = startX + (this.targetX - startX) * progress;
            this.currentY = startY + (this.targetY - startY) * progress;

            this.dog.style.left = this.currentX + 'px';
            this.dog.style.top = this.currentY + 'px';

            if (progress < 1) {
                requestAnimationFrame(move);
            }
        };

        move();
    }
}

// ==================== UPTIME COUNTER ====================
function updateUptime() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 12);
    startDate.setHours(5);
    startDate.setMinutes(18);
    startDate.setSeconds(0);

    setInterval(() => {
        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('uptime').textContent = `${days}D ${hours}H ${minutes}M`;
    }, 1000);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    new ParticleSystem(canvas);

    new FlowerLeafSystem('flowerLeavesContainer');

    const robot = document.getElementById('sentinelRobot');
    new InteractiveRobot(robot);

    const dog = document.getElementById('cuteDog');
    new CuteDog(dog);

    updateUptime();

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    document.querySelectorAll('.action-btn, .download-btn, .social-icon').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    const terminalLines = document.querySelectorAll('.terminal-line');
    terminalLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.arsenal-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.panel, .case-file').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            document.querySelector('.terminal-btn').click();
        }
    });

    console.log('🚀 SENTINEL-X System initialized successfully!');
    console.log('🤖 Drag the robot around! 🐕 Watch K9 run! 🌸 Enjoy the falling flowers!');
});
