// ===== CONFIGURATION — CHANGE THESE =====
const CONFIG = {
    name: "Bestie",
    yourName: "Your Friend",
    typing: "Happy Birthday to one of my absolute favorite people! 🎉 You bring so much fun, laughter, and good vibes everywhere you go. I hope your day is as awesome, crazy, and beautiful as you are. Let's celebrate! 🎂🥂"
};

const BACKEND = "https://birthday-six-sepia-31.vercel.app";

// ===== INIT =====
document.getElementById('birthday-name').textContent = CONFIG.name;
document.getElementById('made-by-name').textContent = CONFIG.yourName;

// Loading Screen Logic
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 1000);
});

setTimeout(hideLoader, 3000); // Failsafe

function hideLoader() {
    const loader = document.getElementById('loading');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        
        try {
            if (typeof AOS !== 'undefined') AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });
            createPetals();
            createHearts();
            startTyping();
        } catch (error) {
            console.error("Animation load issue:", error);
        }
    }
}

// ===== PAGE NAVIGATION =====
let currentPage = 'welcome';
function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    
    const targetPage = document.getElementById('page-' + name);
    if(targetPage) targetPage.classList.add('active');
    
    const navEl = document.getElementById('nav-' + name);
    if (navEl) navEl.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentPage = name;
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
    if (name === 'surprise') launchConfetti();

    // ===== LOAD NOTES WHEN MESSAGES PAGE OPENS =====
    if (name === 'messages') loadNotesFromBackend();

    return false;
}

// ===== LOAD SAVED NOTES FROM BACKEND =====
async function loadNotesFromBackend() {
    try {
        const res = await fetch(`${BACKEND}/notes`);
        const notes = await res.json();
        const grid = document.querySelector('.messages-grid');

        // Remove previously loaded dynamic cards to avoid duplicates
        document.querySelectorAll('.dynamic-card').forEach(c => c.remove());

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'message-card dynamic-card';
            card.innerHTML = `
                <div class="msg-from">A Friend 💌</div>
                <h3>"${note.title || 'A Special Wish'}"</h3>
                <p>${note.message}</p>
                <div class="msg-icon">💌</div>
            `;
            card.style.animation = 'fadeIn 0.5s ease';
            grid.appendChild(card);
        });
    } catch (e) {
        console.log("Could not load notes from backend:", e);
    }
}

// ===== TYPING ANIMATION =====
function startTyping() {
    const el = document.getElementById('typed-text');
    if (!el || el.innerHTML !== "") return; 
    
    const text = CONFIG.typing;
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(type, 28);
        }
    }
    setTimeout(type, 500);
}

// ===== PETALS =====
function createPetals() {
    const container = document.getElementById('petals');
    if (!container) return;
    const colors = ['#e8638a','#f5c842','#fce4ec','#c2185b','#ff8fab'];
    for (let i = 0; i < 18; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${6 + Math.random() * 10}px;
            height: ${6 + Math.random() * 10}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-duration: ${4 + Math.random() * 6}s;
            animation-delay: ${-Math.random() * 8}s;
        `;
        container.appendChild(petal);
    }
}

// ===== FLOATING ICONS =====
function createHearts() {
    const icons = ['✨', '🎉', '🎈', '🌟', '💫', '🌸'];
    for (let i = 0; i < 8; i++) {
        const h = document.createElement('div');
        h.className = 'heart-float';
        h.textContent = icons[Math.floor(Math.random() * icons.length)];
        h.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-duration: ${6 + Math.random() * 6}s;
            animation-delay: ${-Math.random() * 8}s;
            font-size: ${0.8 + Math.random() * 0.8}rem;
        `;
        document.body.appendChild(h);
    }
}

// ===== LIGHTBOX =====
const PHOTOS = [
    {src: document.querySelectorAll('.photo-item img')[0]?.src, caption: 'Golden Hour Glow'},
    {src: document.querySelectorAll('.photo-item img')[1]?.src, caption: 'Pure Joy'},
    {src: document.querySelectorAll('.photo-item img')[2]?.src, caption: 'Field of Dreams'},
    {src: document.querySelectorAll('.photo-item img')[3]?.src, caption: "Nature's Muse"},
    {src: document.querySelectorAll('.photo-item img')[4]?.src, caption: 'Effortless Elegance'},
    {src: document.querySelectorAll('.photo-item img')[5]?.src, caption: 'Caught Smiling'},
    {src: document.querySelectorAll('.photo-item img')[6]?.src, caption: 'Café Vibes'},
    {src: document.querySelectorAll('.photo-item img')[7]?.src, caption: 'A Special Moment'},
];
let lbIndex = 0;
function openLightbox(i) {
    lbIndex = i;
    const imgs = document.querySelectorAll('.photo-item img');
    if(!imgs[i]) return;
    document.getElementById('lightbox-img').src = imgs[i].src;
    document.getElementById('lightbox-caption').textContent = PHOTOS[i]?.caption || '';
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
    if (!e || e.target === document.getElementById('lightbox') || e.target === document.getElementById('lightbox-close')) {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    }
}
function lightboxNav(dir) {
    const imgs = document.querySelectorAll('.photo-item img');
    if(imgs.length === 0) return;
    lbIndex = (lbIndex + dir + imgs.length) % imgs.length;
    document.getElementById('lightbox-img').src = imgs[lbIndex].src;
    document.getElementById('lightbox-caption').textContent = PHOTOS[lbIndex]?.caption || '';
}
document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('active')) {
        if (e.key === 'ArrowRight') lightboxNav(1);
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'Escape') closeLightbox({target: lb});
    }
});

// ===== ADD WISH (saves to backend + shows on screen) =====
async function addWish() {
    const title = document.getElementById('msg-title').value.trim();
    const body = document.getElementById('msg-body').value.trim();
    if (!body) { alert('Please write a message!'); return; }

    // Save to backend
    try {
        await fetch(`${BACKEND}/note`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, message: body })
        });
    } catch (e) {
        console.log("Backend offline, showing locally anyway");
    }

    // Show card on screen instantly
    const grid = document.querySelector('.messages-grid');
    const card = document.createElement('div');
    card.className = 'message-card dynamic-card';
    card.innerHTML = `
        <div class="msg-from">A Friend 💌</div>
        <h3>"${title || 'A Special Wish'}"</h3>
        <p>${body}</p>
        <div class="msg-icon">💌</div>
    `;
    card.style.animation = 'fadeIn 0.5s ease';
    grid.insertBefore(card, grid.firstChild);

    document.getElementById('msg-title').value = '';
    document.getElementById('msg-body').value = '';
}

// ===== CONFETTI =====
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const pieces = [];
    const colors = ['#e8638a','#f5c842','#c2185b','#fce4ec','#ffffff','#ff8fab','#ffdd59'];
    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
            w: 8 + Math.random() * 8, h: 4 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: 2 + Math.random() * 4, vx: -1.5 + Math.random() * 3,
            rot: Math.random() * 360, rspeed: -2 + Math.random() * 4, opacity: 1
        });
    }
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach((p) => {
            p.y += p.vy; p.x += p.vx; p.rot += p.rspeed;
            if (frame > 120) p.opacity -= 0.008;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
        });
        frame++;
        if (frame < 300) requestAnimationFrame(draw);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
}

// ===== REVEAL GIFT =====
function revealGift() {
    document.getElementById('gift-msg').classList.add('visible');
    document.querySelector('.reveal-btn').style.display = 'none';
    launchConfetti();
}

// ===== DARK/LIGHT TOGGLE =====
function toggleMode() {
    document.body.classList.toggle('light');
    const btn = document.querySelector('.toggle-btn');
    btn.textContent = document.body.classList.contains('light') ? '🌙 Mode' : '☀️ Mode';
}

// ===== MUSIC =====
let musicPlaying = false;
function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    if (audio.src && audio.src !== window.location.href) {
        if (musicPlaying) { audio.pause(); btn.textContent = '🎵'; } 
        else { audio.play(); btn.textContent = '🔇'; }
        musicPlaying = !musicPlaying;
    } else {
        btn.textContent = '🔇';
        setTimeout(() => btn.textContent = '🎵', 1500);
    }
}