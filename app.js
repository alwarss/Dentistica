// ══════════════════════════════════════════════════════
// HAMBURGER MENU - UNIVERSAL
// ══════════════════════════════════════════════════════
(function() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
  });
  
  document.addEventListener('click', function(e) {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    }
  });
  
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      menu.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
})();

// ══════════════════════════════════════════════════════
// BEFORE/AFTER SLIDER - UNIVERSAL (drag only)
// ══════════════════════════════════════════════════════
function initSlider(container) {
  const slider = container.querySelector('.ba-slider');
  const afterImg = container.querySelector('.ba-img-after');
  
  if (!slider || !afterImg) return;
  
  let pct = 50;
  
  function setPos(p) {
    pct = Math.max(0, Math.min(100, p));
    slider.style.left = pct + '%';
    afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  }
  
  setPos(50);
  
  function getX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }
  
  function onMove(e) {
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    setPos(((getX(e) - rect.left) / rect.width) * 100);
    container.classList.add('dragging');
  }
  
  function onUp() {
    container.classList.remove('dragging');
  }
  
  // Mouse
  container.addEventListener('mousedown', function(e) {
    e.preventDefault();
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', function off() {
      onUp();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', off);
    });
  });
  
  // Touch
  container.addEventListener('touchstart', function(e) {
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', function off() {
      onUp();
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', off);
    });
  }, { passive: true });
}

// Init all sliders on page load
document.querySelectorAll('.ba-wrap').forEach(initSlider);

// ══════════════════════════════════════════════════════
// QUIZ (only on index)
// ══════════════════════════════════════════════════════
window.quizAnswers = {};
window.nextStep = function(step, answer) {
  window.quizAnswers['step' + (step - 1)] = answer;
  const prev = document.getElementById('dot-' + (step - 1));
  if (prev) {
    prev.classList.remove('active');
    prev.classList.add('done');
  }
  const next = document.getElementById('dot-' + step);
  if (next) next.classList.add('active');
  
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  
  if (step === 3) {
    const a1 = window.quizAnswers['step1'];
    const a2 = window.quizAnswers['step2'];
    let title, desc;
    
    if (a2 === 'calidad') {
      title = 'Diagnóstico Integral — $130.000';
      desc = 'Sales con diagnóstico al 100%, radiografía, limpieza incluida y plan de tratamiento listo para el mejor resultado posible.';
      document.getElementById('quiz-cta-text').textContent = 'Agendar Diagnóstico Integral';
    } else if (a1 === 'info' || a2 === 'no-se') {
      title = 'Empieza con la foto gratuita';
      desc = 'Antes de decidir cualquier cosa, envíanos una foto de tu sonrisa. El Dr. Jorge te orienta directamente y sin costo.';
      document.getElementById('quiz-cta-text').textContent = 'Enviar foto — completamente gratis';
    } else {
      title = 'Valoración Estética — $30.000';
      desc = 'En 30 minutos con el Dr. Jorge verás exactamente qué es posible para tu caso con simulación digital incluida.';
      document.getElementById('quiz-cta-text').textContent = 'Agendar mi Valoración Estética';
    }
    document.getElementById('quiz-title').textContent = title;
    document.getElementById('quiz-desc').textContent = desc;
  }
  
  const s = document.getElementById('step-' + step);
  if (s) s.classList.add('active');
};

// ══════════════════════════════════════════════════════
// TAB SYSTEM (only on tratamientos)
// ══════════════════════════════════════════════════════
window.showTab = function(id) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  
  const target = document.getElementById('tab-' + id);
  if (target) target.classList.add('active');
  
  document.querySelectorAll('.tab-btn').forEach(b => {
    if (b.getAttribute('onclick') === `showTab('${id}')`) {
      b.classList.add('active');
    }
  });
  
  // Re-init sliders for new tab
  setTimeout(function() {
    document.querySelectorAll('.ba-wrap').forEach(initSlider);
  }, 100);
};

// ══════════════════════════════════════════════════════
// ACTIVITY BAR - Dynamic (only on index)
// ══════════════════════════════════════════════════════
(function() {
  const labelEl = document.getElementById('abLabel');
  const timeEl = document.getElementById('abTime');
  
  if (!labelEl || !timeEl) return;
  
  const items = [
    { label: '<b>Alguien</b> envió fotos de su sonrisa', time: 'hace 51 min' },
    { label: '<b>Alguien</b> reservó su cupo de valoración', time: 'hace 23 min' },
    { label: '<b>Alguien</b> agendó su Diagnóstico Integral', time: 'hace 1 hora' },
    { label: '<b>Alguien</b> solicitó su simulación digital', time: 'hace 38 min' },
    { label: '<b>Alguien</b> envió foto para orientación gratuita', time: 'hace 12 min' },
  ];
  
  let idx = 0;
  labelEl.style.transition = timeEl.style.transition = 'opacity 0.3s';
  
  setInterval(function() {
    idx = (idx + 1) % items.length;
    labelEl.style.opacity = timeEl.style.opacity = '0';
    setTimeout(function() {
      labelEl.innerHTML = items[idx].label;
      timeEl.textContent = items[idx].time;
      labelEl.style.opacity = timeEl.style.opacity = '1';
    }, 300);
  }, 5000);
})();

// ══════════════════════════════════════════════════════
// CUPOS COUNTDOWN (only on index)
// ══════════════════════════════════════════════════════
(function() {
  const timerEl = document.getElementById('abTimer');
  if (!timerEl) return;
  
  let slots = 3;
  const intervals = [8, 14, 22];
  let i = 0;
  
  function tick() {
    if (i >= intervals.length || slots <= 1) return;
    setTimeout(function() {
      slots--;
      if (timerEl) timerEl.textContent = '0' + slots;
      i++;
      tick();
    }, intervals[i] * 60 * 1000);
  }
  tick();
})();