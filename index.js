



// animated background script
const bg = document.querySelector('.background');
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      bg.style.transform = `rotateY(${x}deg) rotateX(${y}deg) scale(1.2)`;
    });



(function () {
  const loveLayer = document.getElementById('loveLayer');
  const gun = document.getElementById('gun');

  // Burst settings
  const BURST_INTERVAL = 400;   // ms between bursts
  const HEARTS_PER_BURST = 18;  // hearts per burst (tweak)
  const MAX_HEARTS_ON_SCREEN = 400; // safety cap
  const HEART_LIFE = 6000;      // ms before forced removal

  // Helper: get absolute spawn position at the tip of the gun (approx center-top)
  function getGunSpawnPoint() {
    const r = gun.getBoundingClientRect();
    // position near the gun muzzle — adjust offsets if using a different gun image
    const x = r.left + r.width * 0.8;
    const y = r.top + r.height * 0.1;
    return { x, y };
  }

  // Create a single heart DOM element positioned at (x,y)
  function makeHeart(x, y) {
    const el = document.createElement('div');
    el.className = 'heart';
    // Use colored hearts — you can change to emoji or <img> if you want
    // options: '❤', '💖', '💘', '💞'
    const heartChars = ['❤', '💖', '💘', '💞','🎂','🥰','🎉','😘','💃','🧚‍♂️','🧚','🥳','🎈'];
    el.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];

    // random size
    const size = 10 + Math.random() * 42; // px
    el.style.fontSize = `${size}px`;

    // place at spawn
    el.style.left = `${x - size/2}px`;
    el.style.top = `${y - size/2}px`;

    // initial rotation
    el.style.transform = `translate3d(0,0,0) rotate(${(Math.random()-0.5)*60}deg) scale(${0.6 + Math.random()*0.9})`;

    return el;
  }

  // Launch heart from gun: compute random direction & distance, animate via transition
  function launchHeart(el) {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    // decide random angle that generally goes upward but spreads out
    // angle in radians: -120deg to -60deg centered upward(-90deg) but allow full spread sometimes
    const base = -Math.PI / 2; // up
    // we bias angles more upwards but allow large spread:
    let angle = base + (Math.random() - 0.5) * Math.PI * 0.85; // spread ~153deg
    // occasionally allow shots lower to cross the screen
    if (Math.random() < 0.12) angle = (Math.random() - 0.5) * Math.PI * 2;

    // distance: up to diagonal length so hearts can reach corners
    const maxDist = Math.hypot(vw, vh) * (0.6 + Math.random()*0.9);

    const dx = Math.cos(angle) * maxDist;
    const dy = Math.sin(angle) * maxDist;

    // random final position relative transform
    const tx = dx;
    const ty = dy;

    // random rotation and duration
    const rot = (Math.random() - 0.5) * 720; // degrees
    const duration = 2500 + Math.random() * 8000; // ms

    // apply transition
    el.style.transition = `transform ${duration}ms cubic-bezier(.16,.84,.44,1), opacity ${duration}ms linear`;
    // small delay for scattering effect
    const delay = Math.random() * 1000; // ms
    el.style.transitionDelay = `${delay}ms`;

    // target transform (translate + rotate + scale)
    const scale = 0.8 + Math.random() * 0.9;
    // Use translate3d for smoother GPU accelerated motion
    // we already positioned element at (spawnX, spawnY), so translate by tx,ty
    requestAnimationFrame(() => {
      // must set in next frame to trigger transition
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`;
      // fade slowly
      el.style.opacity = `${0.02 + Math.random() * 0.6}`; // many fade almost out; some remain visible
    });

    // After main movement finishes, optionally add a gentle drift class and continue subtle animation
    setTimeout(() => {
      // Add drift only for hearts that still exist
      if (!el.parentElement) return;
      el.classList.add('drift');
      // gently restore some opacity so leftover hearts still visible for a while before removal
      el.style.opacity = '0.85';
      el.style.transition = ''; // stop big transitions, now drift handles motion
    }, duration + 250);

    // Ensure removal after HEART_LIFE ms
    setTimeout(() => {
      if (el.parentElement) {
        // fade out quickly and remove
        el.style.transition = 'opacity 500ms linear';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 520);
      }
    }, HEART_LIFE);
  }

  // Burst of many hearts (spawned at gun)
  function burst() {
    // safety: cap number of hearts
    const liveHearts = loveLayer.querySelectorAll('.heart').length;
    if (liveHearts > MAX_HEARTS_ON_SCREEN) return;

    const spawn = getGunSpawnPoint();
    const count = HEARTS_PER_BURST;

    for (let i = 0; i < count; i++) {
      const h = makeHeart(spawn.x, spawn.y);
      loveLayer.appendChild(h);

      // small stagger so they don't all overlap exactly
      setTimeout(() => launchHeart(h), Math.random() * 120);
    }
  }

  // Start periodic bursts
  const burstTimer = setInterval(burst, BURST_INTERVAL);

  // Optionally start with a few quick bursts for strong initial effect
  setTimeout(() => { burst(); burst(); }, 400);

  // Clean up on page unload (not strictly necessary)
  window.addEventListener('beforeunload', () => clearInterval(burstTimer));

  // Resize handling: nothing special — hearts use viewport-based distances
})();
//*/


// → gentle, cinematic GSAP swap (replace your previous swap functions with this)

// element refs (keep same ids in HTML)
const imgTL = document.getElementById("img-tl");
const imgTR = document.getElementById("img-tr");
const imgBL = document.getElementById("img-bl");
const imgBR = document.getElementById("img-br");
const centerBox = document.querySelector('.center-box'); // optional visual sync

// slower swap function (longer duration, softer settle)
function swapImagesWithAnimation(elA, elB, opts = {}) {
  const { duration = 1.6, rotate = 420, ease = "power3.inOut", scale = 1.06 } = opts;

  const rectA = elA.getBoundingClientRect();
  const rectB = elB.getBoundingClientRect();

  const dxA = rectB.left - rectA.left;
  const dyA = rectB.top - rectA.top;
  const dxB = rectA.left - rectB.left;
  const dyB = rectA.top - rectB.top;

  const srcA = elA.src;
  const srcB = elB.src;
  const altA = elA.alt;
  const altB = elB.alt;

  const tl = gsap.timeline();

  // raise z-index so they appear above other elements during move
  elA.style.zIndex = elB.style.zIndex = 40;

  // move to each other's position with smooth rotation
  tl.to(elA, { duration, x: dxA, y: dyA, rotation: (Math.random()>0.5?1:-1)*rotate, scale, ease }, 0);
  tl.to(elB, { duration, x: dxB, y: dyB, rotation: (Math.random()>0.5?-1:1)*rotate, scale, ease }, 0);

  // softer settle & slight bounce (longer)
  tl.to([elA, elB], { duration: 0.45, scale: 1, rotation: 0, ease: "elastic.out(1,0.55)" }, "+=0.02");

  // finalize: swap src & clear inline transforms
  tl.add(() => {
    elA.src = srcB;
    elB.src = srcA;
    elA.alt = altB;
    elB.alt = altA;
    gsap.set([elA, elB], { clearProps: "all" });
    elA.style.zIndex = "";
    elB.style.zIndex = "";
  });

  return tl;
}

// main sequence with longer spacing + initial delay
function runSwapSequence() {
  const main = gsap.timeline();

  // optional: small center-box fade-in synced with sequence (remove if not needed)
  if (centerBox) {
    gsap.fromTo(centerBox, { autoAlpha: 0, y: 18 }, { duration: 0.9, autoAlpha: 1, y: 0, ease: "power2.out" });
  }

  // Step 1: Top-left ↔ Top-right (slow)
  main.add(swapImagesWithAnimation(imgTL, imgTR, { duration: 1.6, rotate: 420, scale: 1.06 }));

  // wait a bit before bottom pair (so viewer enjoys first swap)
  main.add(swapImagesWithAnimation(imgBL, imgBR, { duration: 1.6, rotate: 420, scale: 1.06 }), "+=0.45");

  // diagonal: slightly longer & dreamier
  main.add(swapImagesWithAnimation(imgTL, imgBR, { duration: 1.9, rotate: 540, scale: 1.1 }), "+=0.6");
  main.add(swapImagesWithAnimation(imgTR, imgBL, { duration: 1.9, rotate: 540, scale: 1.1 }), "<");

  // when complete, you can call showCircles() or next step (if you have it)
  // main.eventCallback('onComplete', showCircles); // uncomment if you want circles after

  return main;
}

// trigger once after a gentle delay on page load
window.addEventListener('load', () => {
  // initial wait so page elements settle and user sees layout
  const initialDelay = 1500; // ms (1.5s) — change if you want longer
  setTimeout(() => {
    runSwapSequence();
  }, initialDelay);
});


// reveal circle container and animate entrance
function showCircles() {
  if (!circleContainer) return;
  // ensure visible class is set
  circleContainer.classList.add("visible");
  circleContainer.setAttribute("aria-hidden", "false");

  // small GSAP entrance (scale + fade)
  gsap.fromTo(circleContainer,
    { scale: 0.9, opacity: 0 },
    { duration: 0.8, scale: 1, opacity: 1, ease: "back.out(1.2)" }
  );
}

// Start auto-run after load
window.addEventListener("load", () => {
  setTimeout(() => runSwapSequence(), 800);
});




// SECRET BUTTON & MODAL logic
const secretBtn = document.getElementById('secretBtn');
const secretModal = document.getElementById('secretModal');
const secretInner = document.getElementById('secretInner');
const secretClose = document.getElementById('secretClose');

// open modal
function openSecret() {
  if (!secretModal) return;
  // reveal overlay
  secretModal.classList.add('visible');
  secretModal.setAttribute('aria-hidden','false');
  // animate inner card: if GSAP exists use it
  const inner = secretInner;
  if (window.gsap && inner) {
    gsap.fromTo(inner,
      { scale: 0.9, rotationX: -8, opacity: 0 },
      { duration: 0.7, scale: 1, rotationX: 0, opacity: 1, ease: "back.out(1.1)" }
    );
  } else {
    // fallback CSS: ensure visible class triggers transform
    inner.style.transform = 'translateY(0) scale(1)';
    inner.style.opacity = '1';
  }
  secretBtn.setAttribute('aria-expanded','true');
}

// close modal
function closeSecret() {
  if (!secretModal) return;
  // hide with animation
  if (window.gsap && secretInner) {
    gsap.to(secretInner, { duration: 0.45, scale: 0.92, rotationX: -6, opacity: 0, ease: "power1.in", onComplete: () => {
      secretModal.classList.remove('visible');
      secretModal.setAttribute('aria-hidden','true');
    }});
  } else {
    secretModal.classList.remove('visible');
    secretModal.setAttribute('aria-hidden','true');
  }
  secretBtn.setAttribute('aria-expanded','false');
}

// wiring
if (secretBtn) secretBtn.addEventListener('click', openSecret);
if (secretClose) secretClose.addEventListener('click', closeSecret);

// also close when clicking overlay outside inner card
if (secretModal) {
  secretModal.addEventListener('click', (e) => {
    if (e.target === secretModal) closeSecret();
  });
}

// keyboard: Esc to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && secretModal && secretModal.classList.contains('visible')) closeSecret();
});



// 🎥 Local Video Modal Logic (for MP4)
const videoBtn = document.getElementById("videoBtn");
const videoModal = document.getElementById("videoModal");
const closeVideo = document.getElementById("closeVideo");
const videoFrame = document.getElementById("videoFrame");

// Function to open video modal
function openVideo() {
  if (!videoModal) return;
  videoModal.classList.add("visible");
  videoModal.setAttribute("aria-hidden", "false");
  // play local video
  if (videoFrame && videoFrame.play) {
    videoFrame.currentTime = 0; // start from beginning
    videoFrame.play();
  }
}

// Function to close video modal
function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove("visible");
  videoModal.setAttribute("aria-hidden", "true");
  // pause local video
  if (videoFrame && videoFrame.pause) {
    videoFrame.pause();
  }
}

// Events
if (videoBtn) videoBtn.addEventListener("click", openVideo);
if (closeVideo) closeVideo.addEventListener("click", closeVideoModal);

// close when clicking outside video frame
if (videoModal) {
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) closeVideoModal();
  });
}

// ESC key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && videoModal.classList.contains("visible")) {
    closeVideoModal();
  }
});

