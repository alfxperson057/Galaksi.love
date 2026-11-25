
/* =====================================================================
   PENGATURAN — ubah di sini saja
   ===================================================================== */
var CONFIG = {
  // Tulisan di tengah hati
  centerText: "I LOVE U",

  // Kata-kata yang melayang. Pisahkan dengan koma, tiap kata diapit tanda kutip.
  words: [
    "You are my reason to smile", "With you, I can face anything", "You light up my life", 
    "My mind is full of you", "Always and forever", "Just us", "Better together", "My person.",
    "All of me loves you."
  ],

  // Foto yang melayang. Letakkan fotonya di folder yang sama dengan index.html,
  // lalu tulis nama filenya, dipisah koma. Boleh sebanyak apa pun.
  // Contoh: ["foto1.jpg", "foto2.jpg", "kita-berdua.png"]
  // Kalau dikosongkan, yang tampil kartu hati contoh.
  photos: [
"imeg/11s.jfif", "imeg/22s.jfif", "imeg/33s.jfif", "imeg/44s.jfif", "imeg/55s.jfif", "imeg/66s.jfif", "imeg/77s.jfif", "imeg/88s.jfif",
  ]
};

(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = document.getElementById("stage");
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x05030c, 1);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 600);

  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------- helpers ----------
  function glowTexture(stops) {
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var g = c.getContext("2d");
    var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); });
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  var dot = glowTexture([[0, "rgba(255,255,255,1)"], [0.25, "rgba(255,255,255,.8)"], [1, "rgba(255,255,255,0)"]]);

  function points(positions, colors, size, opacity) {
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    var mat = new THREE.PointsMaterial({
      size: size, map: dot, vertexColors: true, transparent: true, opacity: opacity == null ? 1 : opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    return new THREE.Points(geo, mat);
  }

  // ---------- background stars ----------
  (function () {
    var n = 5000, p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var r = 90 + Math.random() * 160, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1);
      p[i*3] = r * Math.sin(ph) * Math.cos(th); p[i*3+1] = r * Math.cos(ph); p[i*3+2] = r * Math.sin(ph) * Math.sin(th);
      var t = Math.random(), b = 0.4 + Math.random() * 0.6;
      c[i*3] = b * (0.8 + 0.2 * t); c[i*3+1] = b * 0.85; c[i*3+2] = b * (1 - 0.2 * t);
    }
    scene.add(points(p, c, 1.6, 0.9));
  })();

  // ---------- spiral galaxy ----------
  var galaxy = new THREE.Group();
  scene.add(galaxy);
  (function () {
    var n = 70000, R = 15, arms = 3;
    var p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    var inner = new THREE.Color(1.0, 0.82, 0.92), mid = new THREE.Color(0.75, 0.45, 0.95), outer = new THREE.Color(0.25, 0.8, 0.82);
    var col = new THREE.Color();
    for (var i = 0; i < n; i++) {
      var u = Math.pow(Math.random(), 1.7), r = u * R + 0.15;
      var a = r * 0.62 + (i % arms) * (Math.PI * 2 / arms);
      var spread = 0.15 + r * 0.09;
      var rx = (Math.random() - 0.5) * (Math.random() - 0.5) * 4 * spread;
      var rz = (Math.random() - 0.5) * (Math.random() - 0.5) * 4 * spread;
      var ry = (Math.random() - 0.5) * (Math.random() - 0.5) * 3 * (1.1 - r / R);
      p[i*3] = Math.cos(a) * r + rx; p[i*3+1] = ry; p[i*3+2] = Math.sin(a) * r + rz;
      var k = r / R;
      if (k < 0.45) col.copy(inner).lerp(mid, k / 0.45); else col.copy(mid).lerp(outer, (k - 0.45) / 0.55);
      var br = (0.35 + Math.random() * 0.65) * (1.1 - k * 0.6);
      c[i*3] = col.r * br; c[i*3+1] = col.g * br; c[i*3+2] = col.b * br;
    }
    galaxy.add(points(p, c, 0.11, 0.95));
    var m = 14000, hp = new Float32Array(m * 3), hc = new Float32Array(m * 3);
    for (var j = 0; j < m; j++) {
      var rr = 4 + Math.pow(Math.random(), 0.7) * 34, aa = Math.random() * 6.283;
      hp[j*3] = Math.cos(aa) * rr; hp[j*3+1] = (Math.random() - 0.5) * 6 * Math.random(); hp[j*3+2] = Math.sin(aa) * rr;
      var bb = 0.3 + Math.random() * 0.5;
      hc[j*3] = bb * 0.7; hc[j*3+1] = bb * 0.85; hc[j*3+2] = bb;
    }
    galaxy.add(points(hp, hc, 0.09, 0.8));
  })();

  function glowSprite(color, size, opacity, x, y, z) {
    var t = glowTexture([[0, color.replace("A", opacity)], [1, color.replace("A", "0")]]);
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(size, size, 1); s.position.set(x, y, z); scene.add(s); return s;
  }
  glowSprite("rgba(255,235,245,A)", 9, 0.9, 0, 0.2, 0);
  glowSprite("rgba(255,120,190,A)", 22, 0.28, 0, 0, 0);
  glowSprite("rgba(130,90,255,A)", 34, 0.22, 9, -1, -6);
  glowSprite("rgba(70,210,200,A)", 30, 0.2, -11, -1, 7);

  // ---------- heart of particles ----------
  var HEART_Y = 10.5, HS = 0.42;
  var heartPts;
  (function () {
    var n = 9000, p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var t = Math.random() * Math.PI * 2;
      var x = 16 * Math.pow(Math.sin(t), 3);
      var y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      var s = 1 + (Math.random() - 0.5) * 0.16 - Math.pow(Math.random(), 8) * 0.25;
      p[i*3] = x * s * HS + (Math.random() - 0.5) * 0.35;
      p[i*3+1] = HEART_Y + (y * s + 2) * HS + (Math.random() - 0.5) * 0.35;
      p[i*3+2] = (Math.random() - 0.5) * 1.1;
      var b = 0.55 + Math.random() * 0.45;
      c[i*3] = b; c[i*3+1] = b * 0.88; c[i*3+2] = b;
    }
    heartPts = points(p, c, 0.1, 1);
    scene.add(heartPts);
  })();
  var heartGlow = glowSprite("rgba(255,100,180,A)", 17, 0.16, 0, HEART_Y, 0);

  // aliran partikel dari inti galaksi ke ujung hati
  var stream, streamU, SN = 1800;
  (function () {
    var p = new Float32Array(SN * 3), c = new Float32Array(SN * 3);
    streamU = new Float32Array(SN);
    for (var i = 0; i < SN; i++) { streamU[i] = Math.random(); c[i*3] = 1; c[i*3+1] = 0.85; c[i*3+2] = 0.95; }
    stream = points(p, c, 0.09, 0.9);
    scene.add(stream);
  })();
  var streamJit = new Float32Array(SN * 2);
  for (var q = 0; q < SN * 2; q++) streamJit[q] = Math.random() - 0.5;

  // ---------- tulisan tengah: tertanam di dalam hati, tidak selalu menghadap layar ----------
  var centerGroup = new THREE.Group();
  centerGroup.position.set(0, HEART_Y + 1.4, 0);
  scene.add(centerGroup);

  function centerTextTexture(text) {
    var px = 72, font = 'italic 700 ' + px + 'px "Playfair Display", Georgia, serif';
    var c = document.createElement("canvas"), g = c.getContext("2d");
    g.font = font;
    var w = Math.ceil(g.measureText(text).width) + 80, h = Math.ceil(px * 1.9);
    c.width = w; c.height = h;
    g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(255,90,170,0.95)"; g.shadowBlur = px * 0.5;
    g.fillStyle = "#ffffff";
    g.fillText(text, w / 2, h / 2); g.fillText(text, w / 2, h / 2);
    var tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter;
    return { tex: tex, aspect: w / h };
  }
  function buildCenterText() {
    var t = centerTextTexture(CONFIG.centerText || "Aku cinta kamu");
    var h = 3.2, geo = new THREE.PlaneGeometry(h * t.aspect, h);
    function face() {
      return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        map: t.tex, transparent: true, depthWrite: false, side: THREE.FrontSide
      }));
    }
    var front = face(), back = face();
    front.position.z = 0.04;
    back.rotation.y = Math.PI; back.position.z = -0.04;   // sisi belakang tetap terbaca
    centerGroup.add(front); centerGroup.add(back);
  }
  // (dipanggil di start(), setelah font siap)

  // ---------- kata & foto melayang ----------
  var floaters = new THREE.Group();
  scene.add(floaters);
  var photoSprites = [];

  function textSprite(text, px, glow) {
    var font = "600 " + px + 'px "Manrope", system-ui, sans-serif';
    var c = document.createElement("canvas"), g = c.getContext("2d");
    g.font = font;
    var w = Math.ceil(g.measureText(text).width) + 60, h = Math.ceil(px * 1.9);
    c.width = w; c.height = h;
    g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = glow; g.shadowBlur = px * 0.45;
    g.fillStyle = "#ffffff";
    g.fillText(text, w / 2, h / 2); g.fillText(text, w / 2, h / 2);
    var tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    s.userData.aspect = w / h;
    return s;
  }

  function heartCard(seed) {
    var c = document.createElement("canvas"); c.width = c.height = 220;
    var g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, 220, 220);
    var gr = g.createLinearGradient(0, 0, 220, 220);
    var pal = [["#ffd1e6", "#ff6fae"], ["#ffe3d1", "#ff9a8a"], ["#e6d4ff", "#ff7ac0"], ["#ffd9ec", "#c768ff"]][seed % 4];
    gr.addColorStop(0, pal[0]); gr.addColorStop(1, pal[1]);
    g.fillStyle = gr; g.fillRect(10, 10, 200, 200);
    g.fillStyle = "rgba(255,255,255,.92)";
    g.beginPath(); var cx = 110, cy = 112, s = 3.4;
    for (var t = 0; t <= Math.PI * 2; t += 0.04) {
      var x = 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      if (t === 0) g.moveTo(cx + x * s, cy + y * s - 8); else g.lineTo(cx + x * s, cy + y * s - 8);
    }
    g.closePath(); g.fill();
    return c;
  }

  function photoCard(img) {
    var c = document.createElement("canvas"); c.width = c.height = 220;
    var g = c.getContext("2d");
    g.fillStyle = "#fff"; g.fillRect(0, 0, 220, 220);
    var s = Math.min(img.naturalWidth, img.naturalHeight);
    var sx = (img.naturalWidth - s) / 2, sy = (img.naturalHeight - s) / 2;
    g.drawImage(img, sx, sy, s, s, 10, 10, 200, 200);
    return c;
  }

  function cardSprite(canvasEl) {
    var tex = new THREE.CanvasTexture(canvasEl); tex.minFilter = THREE.LinearFilter;
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { console.warn("Foto tidak ditemukan: " + src); resolve(null); };
      im.src = src;
    });
  }

  function build(images) {
    var words = (CONFIG.words || []).filter(Boolean);
    if (!words.length) words = ["Aku sayang kamu"];
    var list = [], i;
    for (i = 0; i < words.length; i++) list.push({ kind: "w", text: words[i] });
    if (images.length) { for (i = 0; i < images.length; i++) list.push({ kind: "p", img: images[i] }); }
    else { for (i = 0; i < 6; i++) list.push({ kind: "h", idx: i }); }
    list.sort(function () { return Math.random() - 0.5; });

    list.forEach(function (it, idx) {
      var s;
      if (it.kind === "w") {
        s = textSprite(it.text, 46, "rgba(255,150,210,0.8)");
        var h = 0.95 + Math.random() * 0.45; s.scale.set(h * s.userData.aspect, h, 1);
      } else {
        s = cardSprite(it.kind === "p" ? photoCard(it.img) : heartCard(it.idx));
        var sz = 1.9 + Math.random() * 0.9; s.scale.set(sz, sz, 1);
        if (it.kind === "p") { s.userData.src = it.img.src; photoSprites.push(s); }
      }
      s.userData.rad = 10 + Math.random() * 9;
      s.userData.a = (idx / list.length) * Math.PI * 2 + Math.random() * 0.4;
      s.userData.y = 1.2 + Math.random() * 12.5;
      s.userData.sp = (0.035 + Math.random() * 0.04) * (Math.random() < 0.85 ? 1 : -1);
      s.userData.ph = Math.random() * 6.283;
      floaters.add(s);
    });
    if (images.length) document.getElementById("hint").textContent = "Seret untuk memutar · Ketuk foto untuk membuka";
  }

  // ---------- bintang jatuh ----------
  var shooters = [];
  function spawnShooter() {
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array([1, 1, 1, 0, 0, 0]), 3));
    var line = new THREE.Line(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    var th = Math.random() * 6.283, r = 40 + Math.random() * 20;
    var start = new THREE.Vector3(Math.cos(th) * r, 14 + Math.random() * 22, Math.sin(th) * r);
    var dir = new THREE.Vector3(-Math.sin(th) * 0.8 + (Math.random() - 0.5) * 0.3, -0.35, Math.cos(th) * 0.8 + (Math.random() - 0.5) * 0.3).normalize();
    scene.add(line);
    shooters.push({ line: line, pos: start, dir: dir, life: 0 });
  }

  // ---------- kamera & interaksi ----------
  var theta = 0.6, phi = 1.32, radius = 30, targetRadius = 30;
  var target = new THREE.Vector3(0, 6.2, 0);
  var pointers = {}, lastPinch = 0, dragging = false, idleUntil = 0;
  var downInfo = null;
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

  function pick(x, y) {
    ndc.set(x / window.innerWidth * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObjects(photoSprites, false);
    return hits.length ? hits[0].object : null;
  }

  canvas.addEventListener("pointerdown", function (e) {
    canvas.setPointerCapture(e.pointerId);
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    downInfo = Object.keys(pointers).length === 1 ? { x: e.clientX, y: e.clientY, t: performance.now() } : null;
    dragging = true; canvas.classList.add("drag");
  });
  canvas.addEventListener("pointermove", function (e) {
    var p = pointers[e.pointerId];
    if (!p) {
      if (e.pointerType === "mouse") canvas.classList.toggle("hot", !!pick(e.clientX, e.clientY));
      return;
    }
    var ids = Object.keys(pointers);
    if (ids.length === 2) {
      var a = pointers[ids[0]], b = pointers[ids[1]];
      p.x = e.clientX; p.y = e.clientY;
      var d = Math.hypot(a.x - b.x, a.y - b.y);
      if (lastPinch) targetRadius = Math.min(60, Math.max(14, targetRadius * (lastPinch / d)));
      lastPinch = d; return;
    }
    theta -= (e.clientX - p.x) * 0.006;
    phi = Math.min(1.75, Math.max(0.9, phi - (e.clientY - p.y) * 0.004));
    p.x = e.clientX; p.y = e.clientY;
  });
  function endPtr(e) {
    var wasTap = false;
    if (e.type === "pointerup" && downInfo && Object.keys(pointers).length === 1) {
      wasTap = Math.hypot(e.clientX - downInfo.x, e.clientY - downInfo.y) < 6 && performance.now() - downInfo.t < 600;
    }
    delete pointers[e.pointerId]; lastPinch = 0;
    if (!Object.keys(pointers).length) {
      dragging = false; canvas.classList.remove("drag"); idleUntil = performance.now() + 1500; downInfo = null;
    }
    if (wasTap) { var hit = pick(e.clientX, e.clientY); if (hit) openPhoto(hit); }
  }
  canvas.addEventListener("pointerup", endPtr);
  canvas.addEventListener("pointercancel", endPtr);
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    targetRadius = Math.min(60, Math.max(14, targetRadius * (1 + e.deltaY * 0.001)));
  }, { passive: false });

  // ---------- lightbox foto ----------
  var lb = document.getElementById("lb"), lbImg = document.getElementById("lbImg"), lbClose = document.getElementById("lbClose");
  var lbOpen = false, lbClosing = false, lbSprite = null, lbFinal = null;
  var TRANS = "transform .6s cubic-bezier(.22,.8,.24,1), clip-path .6s cubic-bezier(.22,.8,.24,1)";

  // posisi & ukuran kartu di layar (piksel)
  function spriteRect(sprite) {
    var v = sprite.position.clone().applyMatrix4(floaters.matrixWorld);
    var depth = -v.clone().applyMatrix4(camera.matrixWorldInverse).z;
    var ndcPos = v.clone().project(camera);
    var H = window.innerHeight, W = window.innerWidth;
    var size = sprite.scale.x * H / (2 * depth * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    return { cx: (ndcPos.x + 1) / 2 * W, cy: (1 - ndcPos.y) / 2 * H, w: size };
  }
  // keadaan awal: foto mengecil jadi kotak seukuran kartu, di posisi kartu
  function fromState(r, fr) {
    var base = Math.min(fr.width, fr.height), s = r.w / base;
    var dx = r.cx - (fr.left + fr.width / 2), dy = r.cy - (fr.top + fr.height / 2);
    var ix = Math.max(0, (fr.width - base) / 2), iy = Math.max(0, (fr.height - base) / 2);
    return {
      t: "translate(" + dx + "px," + dy + "px) scale(" + s + ")",
      c: "inset(" + iy + "px " + ix + "px " + iy + "px " + ix + "px round 8px)"
    };
  }

  function openPhoto(sprite) {
    if (lbOpen) return;
    lbOpen = true; lbClosing = false; lbSprite = sprite;
    var r = spriteRect(sprite);
    lbImg.style.transition = "none";
    lbImg.style.transform = "none";
    lbImg.style.clipPath = "none";
    lb.classList.remove("on");
    lb.hidden = false;
    var started = false;
    function go() {
      if (started) return; started = true;
      var fr = lbImg.getBoundingClientRect();
      lbFinal = fr;
      var from = fromState(r, fr);
      lbImg.style.transform = from.t;
      lbImg.style.clipPath = from.c;
      void lbImg.offsetWidth;
      sprite.material.opacity = 0;
      lb.classList.add("on");
      lbImg.style.transition = TRANS;
      lbImg.style.transform = "none";
      lbImg.style.clipPath = "inset(0px 0px 0px 0px round 8px)";
      lbClose.focus({ preventScroll: true });
    }
    lbImg.src = sprite.userData.src;
    if (lbImg.decode) lbImg.decode().then(go, go); else lbImg.onload = go;
  }

  function closePhoto() {
    if (!lbOpen || lbClosing || !lbFinal) return;
    lbClosing = true;
    var r = spriteRect(lbSprite);
    var from = fromState(r, lbFinal);
    lb.classList.remove("on");
    lbImg.style.transition = TRANS;
    lbImg.style.transform = from.t;
    lbImg.style.clipPath = from.c;
    setTimeout(function () {
      lbSprite.material.opacity = 1;
      lb.hidden = true;
      lbOpen = false; lbClosing = false; lbSprite = null; lbFinal = null;
    }, 620);
  }
  lbClose.addEventListener("click", function (e) { e.stopPropagation(); closePhoto(); });
  lb.addEventListener("click", function (e) { if (e.target !== lbImg) closePhoto(); });
  lbImg.addEventListener("click", function (e) { e.stopPropagation(); });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape") closePhoto(); });

  // ---------- loop ----------
  var clock = new THREE.Clock(), nextShoot = 2, elapsed = 0;
  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05);
    if (lbOpen) dt = 0;               // adegan berhenti selama foto dibuka
    elapsed += dt;
    var speed = reduce ? 0.15 : 1;

    if (!dragging && performance.now() > idleUntil) theta += dt * 0.09 * speed;
    radius += (targetRadius - radius) * 0.08;
    camera.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(target);

    galaxy.rotation.y += dt * 0.05 * speed;

    var pulse = 1 + Math.sin(elapsed * 1.6) * 0.025;
    heartPts.scale.setScalar(pulse);
    heartPts.position.y = HEART_Y * (1 - pulse);
    heartGlow.material.opacity = 0.7 + Math.sin(elapsed * 1.6) * 0.2;

    var pos = stream.geometry.attributes.position.array, y0 = 0.3, y1 = HEART_Y - 7.2;
    for (var i = 0; i < SN; i++) {
      var u = (streamU[i] += dt * 0.22 * speed); if (u > 1) { streamU[i] = u = u - 1; }
      var w = (1 - u) * 1.8 + 0.12, ang = u * 14 + i;
      pos[i*3] = Math.cos(ang) * w * 0.5 + streamJit[i*2] * w;
      pos[i*3+1] = y0 + u * (y1 - y0);
      pos[i*3+2] = Math.sin(ang) * w * 0.5 + streamJit[i*2+1] * w;
    }
    stream.geometry.attributes.position.needsUpdate = true;

    var kids = floaters.children;
    for (var j = 0; j < kids.length; j++) {
      var s = kids[j], d = s.userData;
      d.a += d.sp * dt * speed;
      s.position.set(Math.cos(d.a) * d.rad, d.y + Math.sin(elapsed * 0.7 + d.ph) * 0.5, Math.sin(d.a) * d.rad);
    }
    floaters.updateMatrixWorld(true);

    nextShoot -= dt;
    if (nextShoot <= 0 && !reduce) { spawnShooter(); nextShoot = 2.5 + Math.random() * 4; }
    for (var k = shooters.length - 1; k >= 0; k--) {
      var sh = shooters[k]; sh.life += dt;
      sh.pos.addScaledVector(sh.dir, dt * 60);
      var arr = sh.line.geometry.attributes.position.array;
      arr[0] = sh.pos.x; arr[1] = sh.pos.y; arr[2] = sh.pos.z;
      arr[3] = sh.pos.x - sh.dir.x * 9; arr[4] = sh.pos.y - sh.dir.y * 9; arr[5] = sh.pos.z - sh.dir.z * 9;
      sh.line.geometry.attributes.position.needsUpdate = true;
      sh.line.material.opacity = Math.max(0, 1 - sh.life / 1.4);
      if (sh.life > 1.4) { scene.remove(sh.line); sh.line.geometry.dispose(); sh.line.material.dispose(); shooters.splice(k, 1); }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  // Tunggu font dan foto siap, baru bangun adegan.
  var started = false;
  function start() {
    if (started) return; started = true;
    buildCenterText();
    Promise.all((CONFIG.photos || []).map(loadImage)).then(function (list) {
      build(list.filter(Boolean));
      frame();
    });
  }
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('italic 700 40px "Playfair Display"'),
      document.fonts.load('600 40px "Manrope"')
    ]).then(start, start);
    setTimeout(start, 2500);
  } else start();
})();
