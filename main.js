/**
 * CODE KARBONE - MAIN INTERACTIONS
 * Core logic for animations, smooth scroll, and DOM manipulation.
 */

// Early check for Dark Mode (Prevents screen flashing)
if (localStorage.getItem('karbone-theme') === 'dark') {
  document.documentElement.classList.add('alt-theme');
}

document.addEventListener("DOMContentLoaded", function() {

  // ==========================================
  // 1. SMOOTH SCROLL (LENIS) & GSAP INTEGRATION
  // ==========================================
  const fab = document.querySelector('.fab-expandable');
  const mainNav = document.querySelector('.nav');

  const handleScrollEvents = (scrollY) => {
    if (fab) {
      if (scrollY > 150) fab.classList.add('is-visible');
      else fab.classList.remove('is-visible');
    }
    if (mainNav) {
      if (scrollY > 10) mainNav.classList.add('nav-scrolled');
      else mainNav.classList.remove('nav-scrolled');
    }
  };

  if (typeof Lenis !== 'undefined') {
    window.lenis = new Lenis({ smoothWheel: true, wheelMultiplier: 1 });
    
    // Synced GSAP Ticker with Lenis for flawless performance
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => { window.lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { window.lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    window.sportsCarEasing = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Handle hash links on load
    if (window.location.hash) {
      let hashTarget = document.querySelector(window.location.hash);
      if (hashTarget) {
        setTimeout(() => {
          if (window.lenis) window.lenis.scrollTo(hashTarget, { offset: -100, duration: 1.5, easing: window.sportsCarEasing });
        }, 600);
      }
    }
    
    window.lenis.on('scroll', () => handleScrollEvents(window.scrollY));
  }

  // ==========================================
  // 2. TEXT SCRAMBLE / GLITCH EFFECT
  // ==========================================
  class TextScramble {
    constructor(el) { 
      this.el = el; 
      this.chars = '!<>-_0\\/[]{:}—=+*^?#________'; 
      this.update = this.update.bind(this); 
    }
    setText(newText) {
      const oldText = this.el.innerText; 
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve); 
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ''; const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40); const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest); 
      this.frame = 0; 
      this.update(); 
      return promise;
    }
    update() {
      let output = ''; let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) { complete++; output += to; }
        else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; }
          output += `<span class="dud">${char}</span>`;
        } else { output += from; }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) { this.resolve(); }
      else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
    }
    randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
  }

  const scrambleEl = document.getElementById('scramble-text');
  if(scrambleEl) {
    const phrases = ["Création de sites web sur mesure","Design premium (UI/UX)","Référencement local & SEO","Sécurité & Fiabilité"];
    const fx = new TextScramble(scrambleEl); let counter = 0;
    const next = () => { fx.setText(phrases[counter]).then(() => { setTimeout(next, 2500); }); counter = (counter + 1) % phrases.length; };
    next();
  }

  // ==========================================
  // 3. GSAP HERO LOGO CRASH
  // ==========================================
  const titleElement = document.querySelector('.carbon-reveal-text');
  if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined' && titleElement) {
    const textToReveal = new SplitType('.carbon-reveal-text', { types: 'lines, chars' });
    gsap.set('.carbon-reveal-text', { visibility: 'visible' });
    
    const line1Chars = textToReveal.lines[0].querySelectorAll('.char');
    const line2CharsArray = Array.from(textToReveal.lines[1].querySelectorAll('.char'));
    const dotWrapper = line2CharsArray.pop(); 
    
    dotWrapper.innerHTML = `<span class="round-dot"></span><span class="final-rect-dot">.</span>`;
    dotWrapper.style.position = 'relative';

    const shift = 400; 
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from(line1Chars, { duration: 2.2, opacity: 0, scale: 0.8, filter: "blur(20px)", x: (i) => (i - (line1Chars.length / 2)) * shift, ease: "power3.out" })
      .from(line2CharsArray, { duration: 1.8, opacity: 0, scale: 0.8, filter: "blur(20px)", x: (i) => (i - (line2CharsArray.length / 2)) * (shift * 0.8), ease: "power3.out" }, "-=1.4")
      .to(".round-dot", { duration: 0.5, opacity: 1, scale: 1, ease: "back.out(2)" }, "-=0.2")
      .fromTo(".final-rect-dot", { y: -1000, opacity: 1, scaleY: 2 }, { duration: 0.6, y: 0, scaleY: 1, opacity: 1, ease: "power2.in" })
      .to(".round-dot", { duration: 0.05, scaleY: 0, scaleX: 1.5, opacity: 0, transformOrigin: "bottom center", ease: "none" }, ">")
      .to(".final-rect-dot", { duration: 0.15, scaleY: 0.5, scaleX: 1.3, ease: "power2.out" }, "<")
      .to(".final-rect-dot", { duration: 0.4, scaleY: 1, scaleX: 1, ease: "elastic.out(1, 0.4)" });
  } else if (titleElement) {
    titleElement.style.visibility = 'visible';
  }

  // ==========================================
  // 4. GSAP FLIP PORTFOLIO (Grid/List View)
  // ==========================================
  if (typeof Flip !== 'undefined') {
    gsap.registerPlugin(Flip);
    const viewButton = document.querySelector(".view-button-switch");
    const projectsList = document.querySelector(".projects_list_cartes");

    if (viewButton && projectsList) {
      viewButton.addEventListener("click", function (e) {
        e.preventDefault();
        const targets = document.querySelectorAll(".projects_item_cartes, .projects_img_cartes, .projects_img-height, .projects_photo, .projects_flex");
        const state = Flip.getState(targets, { props: "width,height,padding,margin" });
        
        this.classList.toggle("pressed");
        projectsList.classList.toggle("list-view");
        
        Flip.from(state, { duration: 0.7, ease: "power3.inOut", absolute: true, nested: true, scale: false });
      });
    }
  }

  // ==========================================
  // 5. MAGNETIC BUTTONS (Directional Hover)
  // ==========================================
  const buttons = document.querySelectorAll('.mb-btn-directional, .view-button-switch, button[type="submit"], input[type="submit"], .w-button, .btn, a.projects_p');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      button.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
    button.addEventListener('mouseleave', function(e) {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      button.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
  });

  // ==========================================
  // 6. DARK/LIGHT MODE LOGIC
  // ==========================================
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  const moonIcons = document.querySelectorAll('.moon');

  if(toggleBtns.length > 0) {
    const savedTheme = localStorage.getItem('karbone-theme');
    
    if (document.documentElement.classList.contains('alt-theme') || savedTheme === 'dark') {
      document.body.classList.add('alt-theme');
      moonIcons.forEach(icon => icon.classList.remove('sun'));  
      toggleBtns.forEach(btn => btn.classList.remove('day')); 
    } else {
      document.body.classList.remove('alt-theme');
      moonIcons.forEach(icon => icon.classList.add('sun'));     
      toggleBtns.forEach(btn => btn.classList.add('day'));    
    }

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); 
        document.body.classList.toggle('alt-theme'); 
        document.documentElement.classList.toggle('alt-theme'); 
        
        moonIcons.forEach(icon => icon.classList.toggle('sun'));            
        toggleBtns.forEach(b => b.classList.toggle('day'));            

        if (document.body.classList.contains('alt-theme')) {
          localStorage.setItem('karbone-theme', 'dark');
        } else {
          localStorage.setItem('karbone-theme', 'light');
        }
      });
    });
  }

  // ==========================================
  // 7. PARTICLES.JS SECURE ARCHITECTURE
  // ==========================================
  let isMobilePart = window.innerWidth <= 767;

  function initCodeKarboneParticles() {
    if (window.pJSDom && window.pJSDom.length > 0) { window.pJSDom[0].pJS.fn.vendors.destroypJS(); window.pJSDom = []; }
    const nbParticles = isMobilePart ? 15 : 70;

    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
      particlesJS("particles-js", {
        "particles": { 
          "number": { "value": nbParticles, "density": { "enable": false } }, 
          "color": { "value": "#0E100E" }, "shape": { "type": "circle" }, "opacity": { "value": 0.4 }, "size": { "value": 2 }, 
          "line_linked": { "enable": true, "distance": 150, "color": "#0E100E", "opacity": 0.2, "width": 1 }, 
          "move": { "enable": true, "speed": 1.45 } 
        },
        "interactivity": { 
          "detect_on": "window", 
          "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false } }, 
          "modes": { "push": { "particles_nb": 4 } } 
        },
        "retina_detect": true
      });
    }
  }

  initCodeKarboneParticles();
  
  window.addEventListener('resize', function() {
    const newIsMobile = window.innerWidth <= 767;
    if (newIsMobile !== isMobilePart) { isMobilePart = newIsMobile; initCodeKarboneParticles(); }
  });

  // Interactive Particles via Mouse
  window.addEventListener('click', function(e) {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.mb-btn-directional')) { return; }
    if (window.pJSDom && window.pJSDom.length > 0) {
      var pJS = window.pJSDom[0].pJS;
      if (pJS && pJS.canvas && pJS.canvas.el) {
        var rect = pJS.canvas.el.getBoundingClientRect();
        var pxRatio = pJS.retina_detect ? (pJS.canvas.pxratio || 1) : 1;
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            var exactClickPos = { pos_x: (e.clientX - rect.left) * pxRatio, pos_y: (e.clientY - rect.top) * pxRatio };
            const nbPushActuel = window.innerWidth <= 767 ? 2 : 4;
            pJS.fn.modes.pushParticles(nbPushActuel, exactClickPos);
        }
      }
    }
  });

});
