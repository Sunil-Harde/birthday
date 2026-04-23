// ===== CONFIGURATION — CHANGE THESE =====
const CONFIG = {
    name: "Bestie",
    yourName: "Your Friend",
    typing: "Happy Birthday to one of my absolute favorite people! 🎉 You bring so much fun, laughter, and good vibes everywhere you go. I hope your day is as awesome, crazy, and beautiful as you are. Let's celebrate! 🎂🥂"
};

// ===== INIT =====
document.getElementById('birthday-name').textContent = CONFIG.name;
document.getElementById('made-by-name').textContent = CONFIG.yourName;

// Loading Screen Failsafe
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 1000);
});

setTimeout(hideLoader, 3000);

function hideLoader() {
    const loader = document.getElementById('loading');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        
        try {
            if (typeof AOS !== 'undefined') AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });
            if (typeof createPetals === 'function') createPetals();
            if (typeof createHearts === 'function') createHearts();
            if (typeof startTyping === 'function') startTyping();
        } catch (error) {
            console.error("Animation load issue:", error);
        }
    }
}

// ===== API POST: SUBMIT QUIZ TO BACKEND =====
async function submitQuiz() {
    const answer1 = document.getElementById('q1').value.trim();
    const answer2 = document.getElementById('q2').value.trim();
    const errorText = document.getElementById('quiz-error');
    const btn = document.getElementById('unlock-btn');

    if (!answer1 || !answer2) {
        errorText.style.display = 'block';
        errorText.textContent = "Please answer both questions! 😂";
        return;
    }

    errorText.style.display = 'none';
    btn.textContent = "Saving to Database...";
    btn.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foodAnswer: answer1, replyAnswer: answer2 })
        });

        if (response.ok) {
            // Unlocks the website
            document.getElementById('main-nav').style.display = 'flex';
            showPage('welcome');
        } else {
            errorText.style.display = 'block';
            errorText.textContent = "Something went wrong! Try again.";
        }
    } catch (error) {
        console.error("Backend Error:", error);
        // Fallback: If your localhost backend is turned off, let her in anyway so the surprise isn't ruined!
        document.getElementById('main-nav').style.display = 'flex';
        showPage('welcome');
    } finally {
        btn.textContent = "Unlock Surprise 🔓";
        btn.disabled = false;
    }
}

// ===== PAGE NAVIGATION =====
let currentPage = 'quiz';
function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    const navEl = document.getElementById('nav-' + name);
    if (navEl) navEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentPage = name;
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
    if (name === 'surprise') launchConfetti();
    return false;
}

// ===== TYPING ANIMATION =====
function startTyping() {
    const el = document.getElementById('typed-text');
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
    lbIndex = (lbIndex + dir + imgs.length) % imgs.length;
    document.getElementById('lightbox-img').src = imgs[lbIndex].src;
    document.getElementById('lightbox-caption').textContent = PHOTOS[lbIndex]?.caption || '';
}
document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (lb.classList.contains('active')) {
        if (e.key === 'ArrowRight') lightboxNav(1);
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'Escape') closeLightbox({target: lb});
    }
});

// ===== CONFETTI =====
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
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
        pieces.forEach((p, i) => {
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