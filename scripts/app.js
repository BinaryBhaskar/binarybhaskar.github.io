// This file contains the main JavaScript code for the portfolio website.
// It handles interactivity, such as animations and event listeners for user interactions.

document.addEventListener('DOMContentLoaded', () => {
    // === Sticky Header Shrink on Scroll ===
    const stickyHeader = document.querySelector('.sticky-header');
    const mainName = document.getElementById('mainName');
    
    function handleStickyHeader() {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            stickyHeader?.classList.add('shrunk');
        } else {
            stickyHeader?.classList.remove('shrunk');
        }
    }
    
    window.addEventListener('scroll', handleStickyHeader);
    setTimeout(handleStickyHeader, 100);

    // === Fade-in on scroll ===
    function fadeInOnScroll() {
        const fadeEls = document.querySelectorAll('.fade-in');
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', fadeInOnScroll);
    window.addEventListener('resize', fadeInOnScroll);
    setTimeout(fadeInOnScroll, 100);

    // === Animated Scientific/Computational References ===
    const references = [
        "print('Hello World!')",
        "e = mc²",
        "for(i=0;i<n;i++)",
        "def binary_search(arr, x):",
        "Σx_i",
        "f(x) = x² + 2x + 1",
        "P = NP?",
        "λx.x^2",
        "∫_a^b f(x)dx",
        "if (android) { ... }",
        "Kotlin",
        "AI/ML",
        "π ≈ 3.14159",
        "x = (-b ± √(b²-4ac)) / 2a",
        "System.out.println('Hi!')"
    ];

    function createReference(shape) {
        return {
            text: references[Math.floor(Math.random() * references.length)],
            x: shape.x,
            y: shape.y,
            alpha: 0,
            fadeIn: true,
            fadeOut: false,
            life: 0,
            maxLife: shape.maxLife,
            fontSize: 18 + Math.random() * 16,
            color: 'rgba(255,255,255,0.18)',
            shapeRef: shape
        };
    }

    let refTexts = [];

    function updateReferences() {
        // Attach/detach references to shapes
        if (refTexts.length < shapes.length) {
            for (let i = refTexts.length; i < shapes.length; i++) {
                refTexts.push(createReference(shapes[i]));
            }
        }
        refTexts.forEach((ref, idx) => {
            const s = ref.shapeRef;
            // Smooth reference movement by interpolating position
            if (!ref.smoothX) ref.smoothX = ref.x;
            if (!ref.smoothY) ref.smoothY = ref.y;
            const targetX = s.x + s.size/2 + 18 * Math.sin((s.life + idx*10)/60);
            const targetY = s.y - s.size/2 - 18 * Math.cos((s.life + idx*10)/60);
            ref.smoothX += (targetX - ref.smoothX) * 0.12;
            ref.smoothY += (targetY - ref.smoothY) * 0.12;
            ref.x = ref.smoothX;
            ref.y = ref.smoothY;
            ref.life = s.life;
            ref.maxLife = s.maxLife;
            // Fade in/out logic
            if (s.fadeIn && ref.alpha < 0.7) {
                ref.alpha += 0.02;
            }
            if (s.fadeOut) {
                ref.alpha -= 0.02;
            }
        });
        // Remove faded out references
        refTexts = refTexts.filter(ref => ref.alpha > 0);
    }

    function renderReferences() {
        refTexts.forEach(ref => {
            ctx.save();
            ctx.globalAlpha = ref.alpha;
            ctx.font = `bold ${ref.fontSize}px 'Fira Mono', 'Menlo', 'Consolas', 'Montserrat', monospace`;
            ctx.fillStyle = ref.color;
            ctx.textAlign = 'center';
            ctx.fillText(ref.text, ref.x, ref.y);
            ctx.restore();
        });
    }
    // === Animated Background Shapes ===
    const canvas = document.getElementById('bgShapes');
    const ctx = canvas.getContext('2d');
    let shapes = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function randomColor() {
        // Subtle white/gray shades
        const shade = Math.floor(220 + Math.random() * 35);
        return `rgba(${shade},${shade},${shade},${0.08 + Math.random() * 0.12})`;
    }

    function createShape() {
        const types = ['circle', 'rect', 'hex'];
        const type = types[Math.floor(Math.random() * types.length)];
        const size = 40 + Math.random() * 80;
        const x = Math.random() < 0.5 ? -size : canvas.width + size;
        const y = Math.random() * canvas.height;
        const speed = 0.5 + Math.random() * 1.5;
        const direction = x < 0 ? 1 : -1;
        const fadeIn = true;
        return {
            type,
            x,
            y,
            size,
            baseSize: size,
            speed,
            direction,
            alpha: 0,
            fadeIn,
            fadeOut: false,
            life: 0,
            maxLife: 400 + Math.random() * 400,
            color: randomColor(),
            rotate: Math.random() * Math.PI * 2,
            rotateSpeed: (Math.random() - 0.5) * 0.01
        };
    }

    function drawHex(x, y, size, rotate, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(rotate);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i;
            ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }

    function drawShape(s) {
        ctx.save();
        ctx.globalAlpha = s.alpha;
        if (s.type === 'circle') {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 3;
            ctx.stroke();
        } else if (s.type === 'rect') {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rotate);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 3;
            ctx.strokeRect(-s.size/2, -s.size/2, s.size, s.size * (0.6 + Math.sin(s.life/30)*0.2));
            ctx.restore();
        } else if (s.type === 'hex') {
            drawHex(s.x, s.y, s.size/2, s.rotate, s.color, s.alpha);
        }
        ctx.restore();
    }

    function updateShapes() {
        if (shapes.length < 12 && Math.random() < 0.04) {
            shapes.push(createShape());
        }
        shapes.forEach(s => {
            s.x += s.speed * s.direction;
            s.rotate += s.rotateSpeed;
            s.life++;
            // Fade in/out logic
            if (s.fadeIn && s.alpha < 1) {
                s.alpha += 0.02;
                if (s.alpha > 0.8) s.fadeIn = false;
            }
            if (s.life > s.maxLife && !s.fadeOut) {
                s.fadeOut = true;
            }
            if (s.fadeOut) {
                s.alpha -= 0.02;
            }
            // Resize and glide
            s.size = s.baseSize * (0.8 + Math.sin(s.life/40)*0.3);
        });
        // Remove faded out shapes
        shapes = shapes.filter(s => s.alpha > 0);
    }

    function renderShapes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach(drawShape);
    }

    function animateShapes() {
    updateShapes();
    updateReferences();
    renderShapes();
    renderReferences();
    requestAnimationFrame(animateShapes);
    }
    animateShapes();
    // === Fade-in on scroll ===
    function fadeInOnScroll() {
        const fadeEls = document.querySelectorAll('.fade-in');
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 40) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        });
    }
    window.addEventListener('scroll', fadeInOnScroll);
    window.addEventListener('resize', fadeInOnScroll);
    setTimeout(fadeInOnScroll, 100);

    // Add .fade-in to main sections
    document.querySelectorAll('header, section, footer').forEach(el => {
        el.classList.add('fade-in');
    });
    // Initialize animations or any interactive elements here
    console.log('Portfolio website loaded');

        // === Custom Cursor ===
    const cursor = document.getElementById('customCursor');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let lastCursorX = mouseX;
    let lastCursorY = mouseY;
    let isHovering = false;

    // Initial small size
    let baseSize = 12;
    let hoverSize = 32;
    let targetSize = baseSize;
    let currentSize = baseSize;
    
            // Helper function to check if element is text or inline
            function isTextElement(el) {
                const inlineTags = ['A', 'SPAN', 'B', 'I', 'EM', 'STRONG', 'SMALL', 'LABEL', 'MARK', 'U', 'S', 'SUB', 'SUP'];
                return inlineTags.includes(el.tagName);
            }
    
            // Add hover listeners to all elements except text/inline
            document.querySelectorAll('body *').forEach(el => {
                if (!isTextElement(el)) {
                    el.addEventListener('mouseenter', () => {
                        targetSize = hoverSize;
                    });
                    el.addEventListener('mouseleave', () => {
                        targetSize = baseSize;
                    });
                }
            });
            // Also keep button hover logic for accessibility
            document.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    targetSize = hoverSize;
                });
                btn.addEventListener('mouseleave', () => {
                    targetSize = baseSize;
                });
            });

    function animateCursor() {
    // Velocity calculation
    const dx = cursorX - lastCursorX;
    const dy = cursorY - lastCursorY;
    const velocity = Math.sqrt(dx * dx + dy * dy);

    lastCursorX = cursorX;
    lastCursorY = cursorY;

    // Squeeze/stretch effect based on velocity, in direction of movement
    let scaleMajor = 1 + Math.min(velocity / 16, 0.5);
    let scaleMinor = 1 - Math.min(velocity / 24, 0.3);
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Smoothly animate size
    targetSize = isHovering ? hoverSize : baseSize;
    currentSize += (targetSize - currentSize) * 0.18;
    cursor.style.width = `${currentSize}px`;
    cursor.style.height = `${currentSize}px`;

    // Apply transform: translate + rotate + scale
    cursor.style.transform = `translate(${cursorX - currentSize/2}px, ${cursorY - currentSize/2}px) rotate(${angle}deg) scale(${scaleMajor},${scaleMinor})`;
    requestAnimationFrame(animateCursor);
    }

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smoothly follow mouse
    function followMouse() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;
        setTimeout(followMouse, 16);
    }
    followMouse();
    animateCursor();

    // Cursor largens on interactive elements
    const interactiveSelectors = [
        'a',
        'button',
        '.project-card',
        '.skill-card',
        '.achievement-card',
        '.certification-card',
        '.interests-list > *',
        '.languages-list > *',
        '.volunteer-card',
        '.info-card'
    ].join(', ');
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            cursor.style.background = 'rgba(255,255,255,0.18)';
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            cursor.style.background = 'rgba(255,255,255,0.08)';
        });
    });

});