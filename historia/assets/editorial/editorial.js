/* ==========================================================================
   Capa editorial e interactiva (web-cinematica-scroll)
   Uso, DESPUÉS de mountScrollWorld(...):
     EDITORIAL.iniciar({ finalEnBlanco: true, logo: 'assets/brand/wordmark-horizontal-white.svg' });
   Requiere en la página: .cargador (pantalla de carga), .blanco y #final (cierre).
   La página pone html.js en el <head>; sin JavaScript no hay cargador ni bloqueo de scroll.
   ========================================================================== */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raton = matchMedia('(hover: hover) and (pointer: fine)').matches && innerWidth > 860;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  // Parte un texto en palabras con máscara. *texto* = remate dorado (<em>, sin cursiva: Manrope no la tiene).
  function partir(el) {
    if (!el || el.dataset.partido) return;
    el.dataset.partido = '1';
    // Admite el remate escrito como <em> en el HTML (legible sin JS) o como *texto*.
    const fuente = [...el.childNodes].map(n => n.nodeName === 'EM' ? `*${n.textContent}*` : n.textContent).join('');
    const trozos = fuente.split('*');
    let i = 0;
    el.innerHTML = trozos.map((t, k) => {
      const pals = t.split(/(\s+)/).map(p => {
        if (!p.trim()) return p;
        return `<span class="pal"><span style="--i:${i++}">${p.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</span></span>`;
      }).join('');
      return k % 2 ? `<em>${pals}</em>` : pals;
    }).join('');
  }

  // Los títulos de los capítulos entran cuando el motor los hace visibles.
  function textosVivos(logo) {
    const copias = [...document.querySelectorAll('.sw-copy')];
    copias.forEach(c => partir(c.querySelector('.sw-copy__title')));
    (function mirar() {
      copias.forEach(c => {
        const op = parseFloat(c.style.opacity || '0');
        if (op > 0.35) c.classList.add('is-in');
        else if (op < 0.03) c.classList.remove('is-in');
      });
      requestAnimationFrame(mirar);
    })();
    // Marca: la firma aprobada en SVG en lugar del texto (el texto queda como alt).
    const marca = document.querySelector('.sw-brand__name');
    if (marca && logo) {
      const img = new Image();
      img.src = logo; img.alt = marca.textContent.replace(/\*/g, ''); img.width = 2200; img.height = 500; img.decoding = 'async';
      marca.replaceChildren(img);
    } else if (marca && marca.textContent.includes('*')) {
      const [a, b] = marca.textContent.split('*');
      marca.innerHTML = `${a}<em>${b}</em>`;
    }
    // Cierre: entra al verlo
    const cierre = document.querySelectorAll('.cierre [data-partir]');
    cierre.forEach(partir);
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-in', e.isIntersecting)), { threshold: 0.25 });
    cierre.forEach(e => io.observe(e));
  }

  // Pantalla de carga: avanza con la letra, la primera imagen y el primer vídeo.
  function cargador() {
    const caja = document.querySelector('.cargador');
    if (!caja) return Promise.resolve();
    const barra = caja.querySelector('.cargador__barra i');
    const num = caja.querySelector('.cargador__num');
    let meta = 0.08, mostrado = 0, listo = false;
    const t0 = performance.now();
    const sube = v => { meta = Math.max(meta, v); };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => sube(0.35));
    const img = document.querySelector('.sw-scene__still');
    if (img) (img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })).then(() => sube(0.6));
    return new Promise(resolve => {
      (function paso() {
        const t = performance.now() - t0;
        if (document.querySelector('.sw-scene.has-clip')) sube(1);
        if (t > 7000) sube(1);                       // nunca más de 7 s esperando
        mostrado += (meta - mostrado) * 0.08;
        if (meta === 1 && 1 - mostrado < 0.004) mostrado = 1;
        barra.style.transform = `scaleX(${mostrado.toFixed(3)})`;
        num.textContent = String(Math.round(mostrado * 100)).padStart(3, '0');
        if (mostrado >= 1 && t > (reduce ? 0 : 1300) && !listo) {
          listo = true;
          setTimeout(() => { caja.classList.add('fuera'); document.documentElement.classList.remove('cargando'); resolve(); }, reduce ? 0 : 250);
          return;
        }
        requestAnimationFrame(paso);
      })();
    });
  }

  // Scroll suave con la rueda del ratón (en móvil se deja el nativo, que va mejor).
  function scrollSuave() {
    if (!raton || reduce) return;
    let objetivo = scrollY, actual = scrollY, vivo = false;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    addEventListener('wheel', e => {
      if (e.ctrlKey || document.documentElement.classList.contains('cargando')) return;
      e.preventDefault();
      objetivo = clamp(objetivo + e.deltaY * (e.deltaMode === 1 ? 36 : 1), 0, max());
      if (!vivo) { vivo = true; actual = scrollY; requestAnimationFrame(bucle); }
    }, { passive: false });
    function bucle() {
      actual += (objetivo - actual) * 0.085;
      if (Math.abs(objetivo - actual) < 0.4) { actual = objetivo; vivo = false; }
      scrollTo(0, actual);
      if (vivo) requestAnimationFrame(bucle);
    }
    addEventListener('scroll', () => { if (!vivo) objetivo = actual = scrollY; }, { passive: true });
  }

  // Cursor propio: aro que sigue al ratón, crece sobre enlaces y dice «Desliza» al principio.
  function cursor() {
    if (!raton || reduce) return;
    document.documentElement.classList.add('cursor-propio');
    const c = document.createElement('div'); c.className = 'cursor';
    c.innerHTML = '<div class="cursor__aro"><span>Desliza</span></div><div class="cursor__punto"></div>';
    document.body.appendChild(c);
    const aro = c.firstChild, punto = c.lastChild;
    let x = innerWidth / 2, y = innerHeight / 2, ax = x, ay = y;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
    document.addEventListener('mouseover', e => c.classList.toggle('grande', !!e.target.closest('a, button')));
    (function bucle() {
      ax += (x - ax) * 0.16; ay += (y - ay) * 0.16;
      punto.style.transform = `translate(${x}px, ${y}px)`;
      aro.style.transform = `translate(${ax}px, ${ay}px)`;
      c.classList.toggle('con-texto', scrollY < 40 && !c.classList.contains('grande'));
      requestAnimationFrame(bucle);
    })();
  }

  // Botones magnéticos: se acercan al ratón.
  function imanes() {
    if (!raton || reduce) return;
    document.querySelectorAll('[data-iman]').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
      b.style.transition = 'transform .5s var(--ease-out), background var(--motion-short), color var(--motion-short)';
    });
  }

  // Fundido a blanco sincronizado con el último vídeo (que termina en blanco).
  function blanco(activo) {
    const capa = document.querySelector('.blanco'), final = document.getElementById('final');
    if (!activo || !capa || !final) return;
    function pintar() {
      const vh = innerHeight, top = final.getBoundingClientRect().top;
      const t = clamp((1.2 * vh - top) / (0.3 * vh), 0, 1);
      capa.style.opacity = t.toFixed(3);
      const barra = document.querySelector('.sw-topbar'); if (barra) barra.style.opacity = (1 - t).toFixed(3);
      const pista = document.querySelector('.sw-hint'); if (pista && t > 0) pista.style.opacity = 0;
    }
    addEventListener('scroll', pintar, { passive: true }); addEventListener('resize', pintar); pintar();
  }

  window.EDITORIAL = {
    iniciar(op = {}) {
      document.documentElement.classList.add('js', 'cargando');
      scrollTo(0, 0);
      textosVivos(op.logo); scrollSuave(); cursor(); imanes(); blanco(op.finalEnBlanco !== false);
      return cargador();
    },
    partir,
  };
})();
