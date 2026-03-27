
//  Google tag (gtag.js)

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-M4ZPF7PL0Q');

// JS for hamburger
document.addEventListener('DOMContentLoaded', () => {
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const hamIcon = document.getElementById('ham-icon');
const closeIcon = document.getElementById('close-icon');

// Toggle menu open/close
hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent triggering document click
    mobileMenu.classList.toggle('hidden');
    hamIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// Close menu when clicking any link (so it actually navigates!)
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    });
});

// Close when clicking outside the menu
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    mobileMenu.classList.add('hidden');
    hamIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    }
});

// Prevent menu from closing when clicking inside it
mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

});

// JS for active link highlighting
document.addEventListener('DOMContentLoaded', () => {
const sections = document.querySelectorAll('main > div[id]');
const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
    });
}, { threshold: 0.3, rootMargin: '-100px 0px -50%' });

sections.forEach(section => observer.observe(section));
});

 // JS for loading sidebar from external file
fetch('/how_to_pages/how_to_sidebar.html')
    .then(response => {
        if (!response.ok) throw new Error('Sidebar not found');
        return response.text();
    })
    .then(html => {
        // Insert sidebar
        document.querySelector('.sidebar-container').innerHTML = html;

        const currentPath = window.location.pathname
        .replace(/\.html$/, '')           // remove .html
        .replace(/\/$/, '');              // remove trailing slash

        const sidebarLinks = document.querySelectorAll('.sidebar a');

        let bestMatch = null;
        let bestScore = 0;

        // Find the most specific matching link
        sidebarLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;

        // Normalize href (remove domain if absolute, remove .html for comparison)
        href = href
            .replace(/^https?:\/\/[^/]+/, '')   // remove domain if present
            .replace(/\.html$/, '')
            .replace(/\/$/, '');

        // Score: higher = better match
        let score = 0;
        if (currentPath === href) score = 100;                    // exact match
        else if (currentPath.startsWith(href + '/')) score = 80;  // folder match
        else if (currentPath.includes(href)) score = 60;          // partial match

        if (score > bestScore) {
            bestScore = score;
            bestMatch = link;
        }

        });

        // === Highlight + expand logic ===
        if (bestMatch) {
        bestMatch.classList.add('active');

        // Walk up and open ALL parent nested <ul> lists
        let currentElement = bestMatch.parentElement;   // start from <li>

        while (currentElement) {
            const nestedUl = currentElement.querySelector('ul.nested, ul[data-parent]');
            if (nestedUl) {
            nestedUl.style.display = 'block';
            }
            // Move up to parent <li>
            currentElement = currentElement.parentElement?.closest('li');
        }
        }
    })
    .catch(err => {
        console.error('Sidebar load failed:', err);
        document.querySelector('.sidebar-container').innerHTML = 
        '<p class="text-red-500 p-4">Failed to load sidebar. Refresh page.</p>';
    });

// Script for adding email to waitlist
document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    try {
    const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
        document.getElementById('success-msg').classList.remove('hidden');
        form.reset();
    } else {
        alert('Something went wrong – try again!');
    }
    } catch (error) {
    alert('Network error – please check your connection.');
    }
});

// JS for countdown timer
    
// Set your launch date here (YYYY, MM-1, DD, HH, MM, SS)
const launchDate = new Date(2026, 2, 17, 10, 0, 0).getTime(); // Example: March 6, 2026, 10:00 AM

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
    document.getElementById("countdown").innerHTML = "<span class='text-3xl md:text-5xl'>We're Live! 🎉</span>";
    return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days.toString().padStart(2, '0');
    document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Fix video autoplay on iOS & modern Chrome
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('video');
    
    // Critical: playsinline + muted + poster
    video.muted = true;
    video.playsInline = true;

    // Start playing (even if silent)
    video.play().catch(() => {
    // If autoplay fails, show poster + play button overlay
    video.style.background = '#000 url("assets/tourist-guide-ai-preview.webp"") center/cover';
    video.controls = true;
    });

    // Unmute + full play on first tap/click
    document.body.addEventListener('click', function unmute() {
    video.muted = false;
    video.play();
    document.body.removeEventListener('click', unmute);
    }, { once: true });
});

