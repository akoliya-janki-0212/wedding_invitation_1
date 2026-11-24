/**
 * Mayank & Shreya Wedding Celebration
 * Video Intro (Clean Tap To Begin, No Box, No Controls Line), White Transition & Interactive Invitation Card
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Stage 1 (Video)
  const videoStage = document.getElementById('video-stage');
  const heroVideo = document.getElementById('hero-video');
  const tapOverlay = document.getElementById('tap-overlay');
  const tapBtn = document.getElementById('tap-btn');
  const topSkipBtn = document.getElementById('top-skip-btn');

  // DOM Elements - Stage 2 (Transition)
  const whiteFlashVeil = document.getElementById('white-flash-veil');

  // DOM Elements - Stage 3 (Invitation Card & Website)
  const invitationStage = document.getElementById('invitation-stage');
  const replayVideoBtn = document.getElementById('replay-video-btn');
  const saveDateBtn = document.getElementById('save-date-btn');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicTooltip = document.getElementById('music-status-tooltip');
  const petalsCanvas = document.getElementById('petals-canvas');

  let isTransitioned = false;
  let isVideoPlaying = false;
  let isMusicPlaying = false;
  let webAudioCtx = null;
  let musicAudioElement = null;

  // -------------------------------------------------------------
  // 1. Initial State: Video Loaded & Paused (NO AUTOPLAY)
  // -------------------------------------------------------------
  heroVideo.pause();
  heroVideo.currentTime = 0;
  heroVideo.muted = true;
  heroVideo.volume = 0;

  heroVideo.addEventListener('loadeddata', () => {
    heroVideo.pause();
  });

  // Start video on "Tap To Begin" / "OPEN THE DOORS"
  function startHeroVideo() {
    if (isVideoPlaying) return;

    tapOverlay.classList.add('hidden');

    // Intro video voice removed (muted)
    heroVideo.muted = true;
    heroVideo.volume = 0;
    
    heroVideo.play().then(() => {
      isVideoPlaying = true;
    }).catch(err => {
      console.warn('Video playback notice:', err);
      heroVideo.muted = true;
      heroVideo.play().then(() => {
        isVideoPlaying = true;
      });
    });

    // Start "Vela Milan Ni" music right from the beginning!
    startWeddingMusic();
  }

  // Bind clicks for Tap To Begin
  tapBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startHeroVideo();
  });

  tapOverlay.addEventListener('click', () => {
    startHeroVideo();
  });

  // Optional: Clicking on video while playing skips directly to card
  heroVideo.addEventListener('click', () => {
    if (isVideoPlaying) {
      triggerWhiteFlashTransition();
    }
  });

  // -------------------------------------------------------------
  // 2. Video Finished / Skip -> Cinematic White Flash Transition
  // -------------------------------------------------------------
  function triggerWhiteFlashTransition() {
    if (isTransitioned) return;
    isTransitioned = true;

    // Trigger high-intensity white flash
    whiteFlashVeil.classList.add('flashing');

    // Peak of the flash (at 450ms): swap video with invitation
    setTimeout(() => {
      heroVideo.pause();
      videoStage.classList.add('fade-out');
      videoStage.style.display = 'none';

      invitationStage.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Start floating pink heart petals
      initPetalsAnimation();

      // Initialize interactive scratch card
      initScratchCard();

      // Start soothing background wedding music
      startWeddingMusic();
    }, 450);

    // End of flash animation (at 1400ms): cleanup
    setTimeout(() => {
      whiteFlashVeil.classList.remove('flashing');
    }, 1400);
  }

  // Trigger when video ends naturally
  heroVideo.addEventListener('ended', () => {
    triggerWhiteFlashTransition();
  });

  // Top skip button
  if (topSkipBtn) {
    topSkipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerWhiteFlashTransition();
    });
  }

  // Replay Video from invitation page
  if (replayVideoBtn) {
    replayVideoBtn.addEventListener('click', () => {
      stopWeddingMusic();

      isTransitioned = false;
      invitationStage.classList.add('hidden');
      videoStage.style.display = 'flex';
      videoStage.classList.remove('fade-out');

      heroVideo.currentTime = 0;
      tapOverlay.classList.remove('hidden');
      isVideoPlaying = false;
    });
  }

  // -------------------------------------------------------------
  // 3. Floating Pink Heart Petals (Matching the Screenshot!)
  // -------------------------------------------------------------
  function initPetalsAnimation() {
    if (!petalsCanvas) return;
    const ctx = petalsCanvas.getContext('2d');
    let width = (petalsCanvas.width = window.innerWidth);
    let height = (petalsCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = petalsCanvas.width = window.innerWidth;
      height = petalsCanvas.height = window.innerHeight;
    });

    const petals = [];
    const PETAL_COUNT = 12; // Reduced count for gentle, subtle floating animation

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 8,
        speedY: Math.random() * 0.65 + 0.35,
        speedX: Math.random() * 0.5 - 0.25,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.25 + 0.22,
        swayAmplitude: Math.random() * 1.5 + 0.8,
        swaySpeed: Math.random() * 0.015 + 0.008,
        angle: Math.random() * Math.PI * 2
      });
    }

    function drawHeart(ctx, x, y, size, rotation, opacity) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      
      // Top left curve
      ctx.bezierCurveTo(
        -size / 2, -topCurveHeight,
        -size, size / 3,
        0, size
      );
      
      // Top right curve
      ctx.bezierCurveTo(
        size, size / 3,
        size / 2, -topCurveHeight,
        0, topCurveHeight
      );

      ctx.fillStyle = `rgba(235, 130, 145, ${opacity})`;
      ctx.fill();
      ctx.restore();
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);

      for (let p of petals) {
        p.angle += p.swaySpeed;
        p.x += Math.sin(p.angle) * p.swayAmplitude + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.opacity);
      }

      requestAnimationFrame(animatePetals);
    }

    animatePetals();
  }

  // -------------------------------------------------------------
  // 4. Soothing Royal Indian Wedding Instrumental Music
  // -------------------------------------------------------------
  let synthInterval = null;

  function createWeddingSynthesizer() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const droneNotes = [130.81, 196.00, 261.63];
      droneNotes.forEach(freq => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
      });

      const ragaScale = [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];
      let noteIndex = 0;

      function playMelodyNote() {
        if (!isMusicPlaying) return;
        const noteFreq = ragaScale[noteIndex % ragaScale.length];
        noteIndex = (noteIndex + Math.floor(Math.random() * 3 + 1)) % ragaScale.length;

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 1.9);
      }

      return {
        ctx,
        start() {
          if (ctx.state === 'suspended') ctx.resume();
          if (synthInterval) clearInterval(synthInterval);
          synthInterval = setInterval(playMelodyNote, 800);
        },
        stop() {
          if (synthInterval) clearInterval(synthInterval);
          if (ctx.state === 'running') ctx.suspend();
        }
      };
    } catch (e) {
      console.warn('Web Audio init error:', e);
      return null;
    }
  }

  function startWeddingMusic() {
    isMusicPlaying = true;
    musicToggleBtn.classList.add('playing');
    if (musicTooltip) musicTooltip.textContent = 'Music: Playing 🎵';

    if (!musicAudioElement) {
      musicAudioElement = document.getElementById('wedding-bg-audio') || new Audio('Vela Milan Ni.mp3');
      musicAudioElement.loop = true;
      musicAudioElement.volume = 0.5;
      
      musicAudioElement.play().catch(() => {
        if (!webAudioCtx) {
          webAudioCtx = createWeddingSynthesizer();
        }
        if (webAudioCtx) webAudioCtx.start();
      });
    } else {
      if (musicAudioElement.paused) {
        musicAudioElement.play().catch(() => {
          if (!webAudioCtx) webAudioCtx = createWeddingSynthesizer();
          if (webAudioCtx) webAudioCtx.start();
        });
      }
    }
  }

  function stopWeddingMusic() {
    isMusicPlaying = false;
    musicToggleBtn.classList.remove('playing');
    if (musicTooltip) musicTooltip.textContent = 'Music: Paused 🔇';

    if (musicAudioElement) {
      musicAudioElement.pause();
    }
    if (webAudioCtx) {
      webAudioCtx.stop();
    }
  }

  musicToggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      stopWeddingMusic();
    } else {
      startWeddingMusic();
    }
  });

  // -------------------------------------------------------------
  // 5. Wedding Countdown Timer (To 25th January 2027)
  // -------------------------------------------------------------
  const weddingDate = new Date('January 25, 2027 17:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      document.getElementById('days-count').textContent = '00';
      document.getElementById('hours-count').textContent = '00';
      document.getElementById('minutes-count').textContent = '00';
      document.getElementById('seconds-count').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    document.getElementById('days-count').textContent = pad(days);
    document.getElementById('hours-count').textContent = pad(hours);
    document.getElementById('minutes-count').textContent = pad(minutes);
    document.getElementById('seconds-count').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------------------------------------
  // 6. Save The Date (.ics Calendar File Download)
  // -------------------------------------------------------------
  if (saveDateBtn) {
    saveDateBtn.addEventListener('click', () => {
      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mayank and Shreya Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wedding-mayank-shreya-2027@celebration
DTSTAMP:20261122T000000Z
DTSTART:20270125T113000Z
DTEND:20270125T183000Z
SUMMARY:Mayank & Shreya's Royal Wedding
DESCRIPTION:We are thrilled to invite you to celebrate the wedding of Mayank (S/o Vishesh & Radhika Agrawal) and Shreya (D/o Rajiv & Sanya Malhotra).
LOCATION:The Royal Heritage Palace, Lake View Palace Road
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Mayank_Shreya_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // -------------------------------------------------------------
  // 8. Interactive Golden Scratch Card (SAVE THE DATE)
  // -------------------------------------------------------------
  function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const instructionText = document.getElementById('scratch-instruction');
    const cardBox = document.getElementById('scratch-card-box');
    const handIndicator = document.getElementById('scratch-hand-indicator');

    if (!canvas || !cardBox) return;

    function hideHandIndicator() {
      if (handIndicator && !handIndicator.classList.contains('hide-hand')) {
        handIndicator.classList.add('hide-hand');
      }
    }

    const ctx = canvas.getContext('2d');
    let isScratching = false;
    let isRevealed = false;
    let lastX = 0;
    let lastY = 0;

    function resizeCanvas() {
      const rect = cardBox.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      drawGoldSurface(rect.width, rect.height);
    }

    function drawGoldSurface(w, h) {
      ctx.globalCompositeOperation = 'source-over';
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#fced9f');
      grad.addColorStop(0.2, '#e8c456');
      grad.addColorStop(0.48, '#c99623');
      grad.addColorStop(0.72, '#f7e089');
      grad.addColorStop(0.88, '#aa8021');
      grad.addColorStop(1, '#fced9f');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Gold Sparkle Particles / Glitter Dust
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const size = Math.random() * 2 + 1;
        ctx.fillRect(x, y, size, size);
      }
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
      if (!isRevealed) resizeCanvas();
    });

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function scratch(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 42;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
    }

    function checkScratchPercent() {
      if (isRevealed) return;
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let transparentPixels = 0;
        const totalSampled = data.length / 16;

        for (let i = 3; i < data.length; i += 16) {
          if (data[i] === 0) {
            transparentPixels++;
          }
        }

        const percent = transparentPixels / totalSampled;
        if (percent > 0.38) {
          revealDateFully();
        }
      } catch (err) {
        // Fallback for security boundaries
      }
    }

    function revealDateFully() {
      isRevealed = true;
      hideHandIndicator();
      canvas.style.transition = 'opacity 0.6s ease';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';

      if (instructionText) {
        instructionText.textContent = '✨ 25TH JANUARY 2027 — SAVE THE DATE! ✨';
        instructionText.style.color = '#fff0aa';
        instructionText.style.fontWeight = '700';
      }
    }

    // Pointer & Touch Events
    function onStart(e) {
      if (isRevealed) return;
      hideHandIndicator();
      isScratching = true;
      const coords = getCoords(e);
      lastX = coords.x;
      lastY = coords.y;
      scratch(coords.x, coords.y);
    }

    function onMove(e) {
      if (!isScratching || isRevealed) return;
      hideHandIndicator();
      e.preventDefault();
      const coords = getCoords(e);
      scratch(coords.x, coords.y);
      checkScratchPercent();
    }

    function onEnd() {
      if (!isScratching) return;
      isScratching = false;
      checkScratchPercent();
    }

    // Mouse Listeners
    canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Touch Listeners
    canvas.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  }

  // Also call initScratchCard right away if section is visible
  initScratchCard();

  // -------------------------------------------------------------
  // 9. 3D Coverflow Memories Photo Carousel
  // -------------------------------------------------------------
  function initMemoriesCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    const wrapper = document.getElementById('carousel-3d-wrapper');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const total = slides.length;
    let autoPlayTimer = null;

    // Create pagination dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCoverflow();
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateCoverflow() {
      slides.forEach((slide, i) => {
        let diff = (i - currentIndex) % total;
        if (diff < -Math.floor(total / 2)) diff += total;
        if (diff > Math.floor(total / 2)) diff -= total;

        slide.className = 'carousel-slide';

        if (diff === 0) {
          slide.classList.add('active');
        } else if (diff === -1) {
          slide.classList.add('prev-1');
        } else if (diff === 1) {
          slide.classList.add('next-1');
        } else if (diff === -2) {
          slide.classList.add('prev-2');
        } else if (diff === 2) {
          slide.classList.add('next-2');
        } else {
          slide.classList.add('hidden-slide');
        }
      });

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % total;
      updateCoverflow();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + total) % total;
      updateCoverflow();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        resetAutoPlay();
      });
    }

    // Clicking any slide brings it to center
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        if (currentIndex !== i) {
          currentIndex = i;
          updateCoverflow();
          resetAutoPlay();
        }
      });
    });

    // Touch swipe handling
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoPlay();
      }
    }, { passive: true });

    // Auto Play every 4.5 seconds
    function startAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(nextSlide, 4500);
    }

    function resetAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
      });
      wrapper.addEventListener('mouseleave', () => {
        startAutoPlay();
      });
    }

    updateCoverflow();
    startAutoPlay();
  }

  initMemoriesCarousel();

  // -------------------------------------------------------------
  // 10. Wedding Functions Video Carousel
  // -------------------------------------------------------------
  function initFunctionsCarousel() {
    const track = document.getElementById('functions-track');
    const prevBtn = document.getElementById('func-prev-btn');
    const nextBtn = document.getElementById('func-next-btn');
    const cards = document.querySelectorAll('.function-card');
    const videos = document.querySelectorAll('.func-bg-video');

    if (!track) return;

    // Autoplay all card videos muted
    videos.forEach((vid) => {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });

    // Arrow navigation
    const scrollStep = 340;
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: scrollStep, behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      });
    }

    // Update arrow visibility based on scroll position
    function updateArrowState() {
      if (!prevBtn || !nextBtn) return;
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      prevBtn.style.opacity = track.scrollLeft <= 10 ? '0.35' : '1';
      prevBtn.style.pointerEvents = track.scrollLeft <= 10 ? 'none' : 'auto';
      nextBtn.style.opacity = track.scrollLeft >= maxScrollLeft - 10 ? '0.35' : '1';
      nextBtn.style.pointerEvents = track.scrollLeft >= maxScrollLeft - 10 ? 'none' : 'auto';
    }

    track.addEventListener('scroll', updateArrowState, { passive: true });
    window.addEventListener('resize', updateArrowState, { passive: true });
    setTimeout(updateArrowState, 400);
  }

  initFunctionsCarousel();
});
