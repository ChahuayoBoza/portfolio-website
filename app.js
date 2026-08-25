/* -------------------------------------------------------------
   INTERACTIVE APPLICATION LOGIC
   Jhonatan Chahuayo Boza - Portfolio
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Initialize Navigation & Mobile Drawer
    initNavbar();

    // Initialize Simulators
    initPaymentSimulator();
    updateConcurrency(50000);

    // Initialize Skill Filters
    initSkillFilters();
});

/* -------------------------------------------------------------
   NAVBAR & SCROLLSPY
------------------------------------------------------------- */
function initNavbar() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Active state link highlighting on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Simulator Tab Switcher
    const simTabs = document.querySelectorAll('.sim-tab');
    const simContents = document.querySelectorAll('.sim-content');

    simTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            simTabs.forEach(t => t.classList.remove('active'));
            simContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

/* -------------------------------------------------------------
   TAB 1: FINTECH PAYMENTS SIMULATOR
------------------------------------------------------------- */
function initPaymentSimulator() {
    // Already set up via inline onsubmit
}

function runPaymentSimulation(event) {
    event.preventDefault();

    const amount = document.getElementById('payAmount').value;
    const cardBrand = document.getElementById('cardBrand').value;
    const opType = document.getElementById('opType').value;
    const jsonCode = document.getElementById('paymentJsonCode');
    const logs = document.getElementById('paymentLogs');
    const badge = document.getElementById('payStatusBadge');
    const btn = document.getElementById('btnProcessPayment');

    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2"></i> Procesando Transacción...';
    if (window.lucide) lucide.createIcons();

    badge.className = 'code-badge';
    badge.innerText = 'PROCESSING...';

    const txId = 'TX-' + Math.floor(100000 + Math.random() * 900000);
    const token = 'tok_sec_' + Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().toISOString();

    addPaymentLog(logs, `[INIT] Transacción ${txId} iniciada desde cliente Web.`, 'info');

    setTimeout(() => {
        addPaymentLog(logs, `[SECURITY] Tokenizando datos de tarjeta con AES-256 (Token: ${token.substring(0, 12)}...)`, 'info');
        
        jsonCode.innerText = JSON.stringify({
            gateway_id: "IZIPAY_BCP_TRANSACTION_ENGINE",
            transaction_id: txId,
            operation: opType,
            amount: parseFloat(amount).toFixed(2),
            currency: "PEN",
            card_network: cardBrand,
            token_status: "ENCRYPTED_AND_VERIFIED",
            timestamp: timestamp,
            status: "IN_PROGRESS"
        }, null, 2);
    }, 600);

    setTimeout(() => {
        addPaymentLog(logs, `[BACKEND] Petición aprobada por Microservicio .NET / Spring Boot. Código HTTP 200 OK.`, 'success');
        
        jsonCode.innerText = JSON.stringify({
            gateway_id: "IZIPAY_BCP_TRANSACTION_ENGINE",
            transaction_id: txId,
            operation: opType,
            amount: parseFloat(amount).toFixed(2),
            currency: "PEN",
            card_network: cardBrand,
            auth_code: "AUTH-" + Math.floor(1000 + Math.random() * 9000),
            http_status: 200,
            response_code: "00_APPROVED",
            message: "Transacción aprobada exitosamente",
            timestamp: timestamp
        }, null, 2);

        badge.className = 'code-badge badge-green';
        badge.innerText = 'APPROVED (HTTP 200)';

        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="send"></i> Simular Petición API Backend';
        if (window.lucide) lucide.createIcons();
    }, 1500);
}

function addPaymentLog(container, message, type) {
    const item = document.createElement('div');
    item.className = `log-item ${type}`;
    item.innerText = `${new Date().toLocaleTimeString()} ${message}`;
    container.prepend(item);
}

/* -------------------------------------------------------------
   TAB 2: HIGH CONCURRENCY VOTING SIMULATOR (ONPE)
------------------------------------------------------------- */
function updateConcurrency(value) {
    const valDisplay = document.getElementById('voterCountVal');
    const podsVal = document.getElementById('podsVal');
    const dbLatencyVal = document.getElementById('dbLatencyVal');
    const tpsVal = document.getElementById('tpsVal');
    const health = document.getElementById('concurrencyHealth');
    const logs = document.getElementById('concurrencyLogs');

    const reqs = parseInt(value);
    valDisplay.innerText = `${reqs.toLocaleString()} req/min`;

    // Calculate simulated auto-scaling metrics
    const pods = Math.ceil(reqs / 25000);
    const latency = Math.floor(8 + (reqs / 20000));
    const tps = Math.floor(reqs / 60);

    podsVal.innerText = `${pods} Replicas (Docker/Kubernetes)`;
    dbLatencyVal.innerText = `${latency} ms`;
    tpsVal.innerText = `${tps.toLocaleString()} req/s`;

    if (reqs > 180000) {
        health.className = 'code-badge';
        health.style.background = 'rgba(245, 158, 11, 0.2)';
        health.style.color = '#fbbf24';
        health.innerText = 'HIGH LOAD - AUTO SCALING ACTIVE';
        addPaymentLog(logs, `[AUTOSCALER] Aumentando réplicas de Pods Spring Boot a ${pods}...`, 'warn');
    } else {
        health.className = 'code-badge badge-green';
        health.innerText = 'HEALTHY (99.99%)';
    }

    drawConcurrencyChart(reqs);
}

function triggerTrafficSpike() {
    const slider = document.getElementById('voterSlider');
    slider.value = 220000;
    updateConcurrency(220000);
    
    const logs = document.getElementById('concurrencyLogs');
    addPaymentLog(logs, `[ONPE VOTO DIGITAL] ¡PICO DE TRÁFICO SIMULADO! Procesando 220,000 electores simultáneos.`, 'warn');
}

function drawConcurrencyChart(reqs) {
    const canvas = document.getElementById('concurrencyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw sparkline curve
    const points = 12;
    const step = canvas.width / (points - 1);
    const baseHeight = canvas.height - 20;

    ctx.beginPath();
    ctx.moveTo(0, baseHeight);

    for (let i = 0; i < points; i++) {
        const x = i * step;
        const variation = Math.sin(i + Date.now() / 1000) * 15;
        const normalized = (reqs / 250000) * (canvas.height - 60);
        const y = baseHeight - normalized + variation;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Fill gradient
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
}

/* -------------------------------------------------------------
   TAB 3: ACTIVITI BPM WORKFLOW SIMULATOR (OECE)
------------------------------------------------------------- */
let currentBpmStage = 1;

function stepBpmWorkflow() {
    const nodes = [
        document.getElementById('node1'),
        document.getElementById('node2'),
        document.getElementById('node3'),
        document.getElementById('node4')
    ];
    const consoleBox = document.getElementById('bpmConsole');

    // Reset next stage
    currentBpmStage = (currentBpmStage % 4) + 1;

    nodes.forEach((node, idx) => {
        const nodeNum = idx + 1;
        const statusSpan = node.querySelector('.node-status');

        if (nodeNum < currentBpmStage) {
            node.className = 'bpm-node completed';
            statusSpan.innerText = 'COMPLETADO';
        } else if (nodeNum === currentBpmStage) {
            node.className = 'bpm-node active';
            statusSpan.innerText = 'EN EJECUCIÓN';
        } else {
            node.className = 'bpm-node';
            statusSpan.innerText = 'ESPERANDO';
        }
    });

    const messages = [
        "[FRONTEND SPA]: Formulario Angular enviado con payload validado.",
        "[SPRING SECURITY]: Token JWT autenticado y permisos de usuario confirmados.",
        "[ACTIVITI BPM ENGINE]: Evaluando reglas de negocio automatizadas BPMN 2.0.",
        "[DOCKER / POSTGRESQL]: Registro transaccional auditado y persistido con éxito."
    ];

    const time = new Date().toLocaleTimeString();
    consoleBox.innerHTML += `<br>[${time}] ${messages[currentBpmStage - 1]}`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

/* -------------------------------------------------------------
   SKILL FILTERS
------------------------------------------------------------- */
function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* -------------------------------------------------------------
   CV MODAL CONTROLLER
------------------------------------------------------------- */
function openCvModal() {
    document.getElementById('cvModal').classList.add('active');
}

function closeCvModal() {
    document.getElementById('cvModal').classList.remove('active');
}

/* -------------------------------------------------------------
   CONTACT FORM HANDLER
------------------------------------------------------------- */
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    const mailtoUrl = `mailto:chahuayoboza@gmail.com?subject=${encodeURIComponent(subject + " - " + name)}&body=${encodeURIComponent("Nombre: " + name + "\nEmail: " + email + "\n\nMensaje:\n" + message)}`;

    window.location.href = mailtoUrl;

    alert(`¡Gracias ${name}! Se abrirá tu cliente de correo para enviar el mensaje a chahuayoboza@gmail.com.`);
}
