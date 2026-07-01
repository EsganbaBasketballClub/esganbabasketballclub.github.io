// ==========================================================================
// INTERACTIVIDAD DINÁMICA - ESGANBA BOGOTÁ
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- NAVBAR DINÁMICO AL HACER SCROLL ---
    const navbar = document.querySelector('.navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar al cargar la página por si se inicia con scroll

    // --- MENÚ MÓVIL INTERACTIVO ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Cambiar el icono del menú móvil
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons(); // Recargar iconos modificados
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // --- REPRODUCTOR DE VIDEO PERSONALIZADO DE LA GALERÍA ---
    const videoOverlay = document.getElementById('video-overlay-btn');
    const galeriaVideo = document.getElementById('galeria-video');
    
    if (videoOverlay && galeriaVideo) {
        videoOverlay.addEventListener('click', () => {
            videoOverlay.classList.add('hide');
            galeriaVideo.play();
        });

        // Mostrar de nuevo el overlay si el video termina o se pausa
        galeriaVideo.addEventListener('pause', () => {
            videoOverlay.classList.remove('hide');
            // Cambiar texto por algo descriptivo
            const overlayTitle = videoOverlay.querySelector('h3');
            if (overlayTitle) overlayTitle.textContent = 'Video Pausado - Esganba';
        });
    }

    // --- DETECTOR DE SECCIÓN ACTIVA (INTERSECTION OBSERVER) ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Detecta cuando la sección ocupa la parte central
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${activeId}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // --- FORMULARIO DE INSCRIPCIÓN CON VALIDACIÓN ---
    const inscriptionForm = document.getElementById('inscription-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (inscriptionForm) {
        inscriptionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const categoria = document.getElementById('categoria').value;
            
            // Validaciones básicas
            if (!nombre || !email || !telefono || !categoria) {
                showFeedback('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            // Cambiar estado del botón de envío
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando... <i data-lucide="loader" class="spin" style="margin-left: 8px;"></i>';
            lucide.createIcons();

            // Simulación de envío de datos (petición AJAX de 1.5s)
            setTimeout(() => {
                // Éxito simulado
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons();

                showFeedback(`¡Felicidades, ${nombre}! Tu clase de cortesía ha sido reservada con éxito. Nos comunicaremos contigo al celular ${telefono} o al correo ${email} en las próximas 24 horas.`, 'success');
                
                // Reiniciar el formulario
                inscriptionForm.reset();
            }, 1500);
        });
    }

    function showFeedback(message, type) {
        if (!formFeedback) return;
        
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback'; // Reiniciar clases
        
        if (type === 'success') {
            formFeedback.classList.add('success');
        } else if (type === 'error') {
            formFeedback.classList.add('error');
        }
        
        // Hacer scroll hacia abajo un poco para que se vea el mensaje de feedback completo
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- ANIMACIÓN SUAVE PARA EFECTOS DE REVELACIÓN (SCROLL REVEAL BÁSICO) ---
    const revealElements = document.querySelectorAll('.feature-item, .program-card, .gallery-item, .info-card, .flyer-container');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Retardo escalonado para elementos que aparecen juntos
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    });

    // Agregar estilos CSS en tiempo de ejecución para soportar las animaciones de revelado
    const style = document.createElement('style');
    style.innerHTML = `
        .feature-item, .program-card, .gallery-item, .info-card, .flyer-container {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-item.revealed, .program-card.revealed, .gallery-item.revealed, .info-card.revealed, .flyer-container.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ==========================================================================
    // MINIJUEGO: DESAFÍO DE TIRO LIBRE ESGANBA
    // ==========================================================================
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const attemptsEl = document.getElementById('attempts-count');
        const scoreEl = document.getElementById('score-count');
        const resetBtn = document.getElementById('reset-game-btn');
        const premioCard = document.getElementById('premio-card');

        let attempts = 0;
        let score = 0;
        let hasWon = false;

        // Parámetros físicos
        const gravity = 0.35;
        const bounce = 0.72;
        const friction = 0.992;

        // Elementos del juego
        const hoop = {
            x: 390,
            y: 160,
            radius: 30, // Ancho de 60px para el aro
            netHeight: 35
        };

        const board = {
            x: 440,
            y: 70,
            width: 8,
            height: 120
        };

        const ball = {
            startX: 90,
            startY: 300,
            x: 90,
            y: 300,
            radius: 18,
            vx: 0,
            vy: 0,
            isDragging: false,
            isLaunched: false,
            dragX: 0,
            dragY: 0
        };

        let particles = [];
        let scoreTriggeredThisLaunch = false;
        
        // Cargar imagen del balón
        const ballImg = new Image();
        ballImg.src = 'assets/Balon.png';

        // Función para resetear el balón a la posición de inicio
        function resetBall() {
            ball.x = ball.startX;
            ball.y = ball.startY;
            ball.vx = 0;
            ball.vy = 0;
            ball.isLaunched = false;
            ball.isDragging = false;
            scoreTriggeredThisLaunch = false;
        }

        // Evento reset global del juego
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                attempts = 0;
                score = 0;
                hasWon = false;
                attemptsEl.textContent = '0';
                scoreEl.textContent = '0';
                if (premioCard) premioCard.classList.add('hide');
                particles = [];
                resetBall();
            });
        }

        // Obtener coordenadas relativas del mouse/touch
        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            // Escalar de forma precisa las coordenadas por si el canvas tiene tamaño responsivo
            return {
                x: (clientX - rect.left) * (canvas.width / rect.width),
                y: (clientY - rect.top) * (canvas.height / rect.height)
            };
        }

        // Manejo de eventos del mouse y táctiles
        function onStart(pos) {
            if (ball.isLaunched) return;

            // Detectar si hace clic cerca del balón
            const dist = Math.hypot(pos.x - ball.x, pos.y - ball.y);
            if (dist < 40) {
                ball.isDragging = true;
                ball.dragX = pos.x;
                ball.dragY = pos.y;
            }
        }

        function onMove(pos) {
            if (!ball.isDragging) return;
            ball.dragX = pos.x;
            ball.dragY = pos.y;
        }

        function onEnd() {
            if (!ball.isDragging) return;

            ball.isDragging = false;
            
            // Calcular vector de fuerza en sentido inverso (efecto resortera)
            const dx = ball.x - ball.dragX;
            const dy = ball.y - ball.dragY;
            const dist = Math.hypot(dx, dy);

            if (dist > 10) {
                // Limitar la fuerza máxima de lanzamiento
                const maxForce = 120;
                const force = Math.min(dist, maxForce);
                const angle = Math.atan2(dy, dx);

                // Asignar velocidad inicial
                const speedCoeff = 0.15; // Ajuste fino de la sensibilidad del tiro
                ball.vx = Math.cos(angle) * force * speedCoeff;
                ball.vy = Math.sin(angle) * force * speedCoeff;
                ball.isLaunched = true;

                attempts++;
                attemptsEl.textContent = attempts;
                scoreTriggeredThisLaunch = false;
            }
        }

        // Registrar Eventos en Canvas
        canvas.addEventListener('mousedown', (e) => onStart(getMousePos(e)));
        canvas.addEventListener('mousemove', (e) => onMove(getMousePos(e)));
        window.addEventListener('mouseup', onEnd);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            onStart(getMousePos(e));
        }, { passive: false });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            onMove(getMousePos(e));
        }, { passive: false });
        window.addEventListener('touchend', onEnd);

        // Crear explosión de confeti dorado/naranja
        function createConfetti() {
            for (let i = 0; i < 55; i++) {
                particles.push({
                    x: hoop.x + hoop.radius,
                    y: hoop.y,
                    size: Math.random() * 6 + 4,
                    color: Math.random() > 0.5 ? '#e60026' : '#0052cc',
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.8) * 8 - 3,
                    alpha: 1,
                    decay: Math.random() * 0.015 + 0.01
                });
            }
        }

        // Lógica de física y colisiones
        function updatePhysics() {
            if (!ball.isLaunched) return;

            // Guardar posición anterior para verificar cruce por el aro
            const prevY = ball.y;

            // Aplicar gravedad y fricción
            ball.vy += gravity;
            ball.vx *= friction;
            ball.vy *= friction;

            // Actualizar posiciones
            ball.x += ball.vx;
            ball.y += ball.vy;

            // 1. Colisión con los bordes del canvas (suelo y paredes)
            if (ball.y + ball.radius > canvas.height) {
                ball.y = canvas.height - ball.radius;
                ball.vy = -ball.vy * bounce;
                ball.vx *= 0.8; // Más fricción en el suelo
            }
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx = -ball.vx * bounce;
            }
            if (ball.x + ball.radius > canvas.width) {
                ball.x = canvas.width - ball.radius;
                ball.vx = -ball.vx * bounce;
            }

            // 2. Colisión con el tablero (Backboard)
            if (ball.x + ball.radius > board.x && 
                ball.x - ball.radius < board.x + board.width &&
                ball.y + ball.radius > board.y && 
                ball.y - ball.radius < board.y + board.height) {
                
                // Determinar el lado del rebote
                if (ball.x < board.x) {
                    ball.x = board.x - ball.radius;
                    ball.vx = -ball.vx * bounce;
                } else if (ball.x > board.x + board.width) {
                    ball.x = board.x + board.width + ball.radius;
                    ball.vx = -ball.vx * bounce;
                }
            }

            // 3. Colisión con el aro (bordes metálicos izquierdo y derecho)
            const edgeLeft = { x: hoop.x, y: hoop.y };
            const edgeRight = { x: hoop.x + hoop.radius * 2, y: hoop.y };

            // Rebote en borde izquierdo
            const distLeft = Math.hypot(ball.x - edgeLeft.x, ball.y - edgeLeft.y);
            if (distLeft < ball.radius) {
                const angle = Math.atan2(ball.y - edgeLeft.y, ball.x - edgeLeft.x);
                ball.x = edgeLeft.x + Math.cos(angle) * ball.radius;
                // Reflejar velocidad
                const speed = Math.hypot(ball.vx, ball.vy);
                ball.vx = Math.cos(angle) * speed * bounce;
                ball.vy = Math.sin(angle) * speed * bounce;
            }

            // Rebote en borde derecho
            const distRight = Math.hypot(ball.x - edgeRight.x, ball.y - edgeRight.y);
            if (distRight < ball.radius) {
                const angle = Math.atan2(ball.y - edgeRight.y, ball.x - edgeRight.x);
                ball.x = edgeRight.x + Math.cos(angle) * ball.radius;
                // Reflejar velocidad
                const speed = Math.hypot(ball.vx, ball.vy);
                ball.vx = Math.cos(angle) * speed * bounce;
                ball.vy = Math.sin(angle) * speed * bounce;
            }

            // 4. Detección de ENCESTAR (Pasar por dentro del aro de arriba a abajo)
            // El centro de la pelota debe pasar el eje Y del aro mientras el eje X está dentro de los límites del aro
            if (!scoreTriggeredThisLaunch && 
                prevY < hoop.y && 
                ball.y >= hoop.y && 
                ball.x > hoop.x + 3 && 
                ball.x < hoop.x + hoop.radius * 2 - 3) {
                
                score++;
                scoreEl.textContent = score;
                scoreTriggeredThisLaunch = true;
                createConfetti();

                if (!hasWon) {
                    hasWon = true;
                    // Desbloquear tarjeta de premio
                    if (premioCard) {
                        premioCard.classList.remove('hide');
                        premioCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            }

            // Si el balón se detiene o sale por debajo, resetearlo tras un pequeño delay
            if (ball.isLaunched && Math.hypot(ball.vx, ball.vy) < 0.2 && ball.y + ball.radius >= canvas.height - 2) {
                setTimeout(resetBall, 1000);
            }
        }

        // Renderizado gráfico del Canvas
        function draw() {
            // Fondo estilo parqué deportivo claro (maple)
            ctx.fillStyle = '#f6edd9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dibujar líneas de madera de la cancha (líneas sutiles claras)
            ctx.strokeStyle = '#e6dcbf';
            ctx.lineWidth = 2;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }

            // Dibujar línea de tres puntos decorativa (arco neón tenue)
            ctx.strokeStyle = 'rgba(0, 82, 204, 0.22)';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, canvas.height, 220, 0, -Math.PI / 2, true);
            ctx.stroke();

            // Dibujar el Tablero (Backboard)
            ctx.fillStyle = '#222';
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 3;
            ctx.fillRect(board.x, board.y, board.width, board.height);
            ctx.strokeRect(board.x, board.y, board.width, board.height);
            
            // Detalle interior del tablero (cuadrado de tiro)
            ctx.strokeStyle = '#e60026';
            ctx.lineWidth = 2;
            ctx.strokeRect(board.x, board.y + 40, board.width, 40);

            // Dibujar Soporte de Metal del Aro
            ctx.strokeStyle = '#777';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(hoop.x + hoop.radius * 2, hoop.y + 3);
            ctx.lineTo(board.x, hoop.y + 3);
            ctx.stroke();

            // Dibujar la Red (Net) - Efecto malla
            ctx.strokeStyle = 'rgba(240, 240, 240, 0.7)';
            ctx.lineWidth = 2;
            const netSegments = 5;
            const startX = hoop.x;
            const endX = hoop.x + hoop.radius * 2;
            
            for (let i = 0; i <= netSegments; i++) {
                const ratio = i / netSegments;
                const topX = startX + (endX - startX) * ratio;
                const bottomX = (startX + 10) + ((endX - 10) - (startX + 10)) * ratio;
                
                // Malla izquierda a derecha cruzada
                ctx.beginPath();
                ctx.moveTo(topX, hoop.y);
                ctx.lineTo(bottomX, hoop.y + hoop.netHeight);
                ctx.stroke();

                // Malla derecha a izquierda cruzada
                ctx.beginPath();
                ctx.moveTo(topX, hoop.y);
                ctx.lineTo((endX - 10) - ((endX - 10) - (startX + 10)) * ratio, hoop.y + hoop.netHeight);
                ctx.stroke();
            }

            // Dibujar el Aro de Metal Naranja (Hoop)
            ctx.strokeStyle = '#e60026';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(hoop.x, hoop.y);
            ctx.lineTo(hoop.x + hoop.radius * 2, hoop.y);
            ctx.stroke();

            // Dibujar la trayectoria si se está apuntando
            if (ball.isDragging) {
                const dx = ball.x - ball.dragX;
                const dy = ball.y - ball.dragY;
                const dist = Math.hypot(dx, dy);

                if (dist > 10) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(230, 0, 38, 0.6)';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([5, 5]);
                    
                    // Dibujar vector de fuerza
                    ctx.beginPath();
                    ctx.moveTo(ball.x, ball.y);
                    // Proyección parabólica simple
                    let tempX = ball.x;
                    let tempY = ball.y;
                    let tempVx = dx * 0.15;
                    let tempVy = dy * 0.15;
                    
                    for (let i = 0; i < 25; i++) {
                        tempVy += gravity;
                        tempVx *= friction;
                        tempVy *= friction;
                        tempX += tempVx;
                        tempY += tempVy;
                        ctx.lineTo(tempX, tempY);
                    }
                    ctx.stroke();
                    ctx.restore();

                    // Dibujar indicador visual neón del arrastre
                    ctx.strokeStyle = '#0052cc';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(ball.x, ball.y, dist, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            // Dibujar partículas de Confeti
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                
                // Actualizar partícula
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.18; // Gravedad interna de confeti
                p.alpha -= p.decay;

                // Eliminar partículas invisibles
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }
            ctx.globalAlpha = 1.0; // Restaurar opacidad global

            // Dibujar el Balón de Baloncesto (Basketball) usando assets/Balon.png
            ctx.save();
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.clip();
            
            if (ballImg.complete && ballImg.naturalWidth !== 0) {
                ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
            } else {
                // Fallback por si la imagen aún no carga
                ctx.fillStyle = '#ff6b00';
                ctx.fillRect(ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
            }
            
            ctx.restore();

            // Dibujar contorno del balón
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Bucle de animación (Game Loop)
        function gameLoop() {
            updatePhysics();
            draw();
            requestAnimationFrame(gameLoop);
        }

        // Inicializar bucle
        gameLoop();
    }

    revealElements.forEach(el => revealObserver.observe(el));
});
