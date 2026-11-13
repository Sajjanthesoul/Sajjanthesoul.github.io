import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

(() => {
  const canvas = document.getElementById("dream-canvas");
  const host = document.getElementById("dream-world");
  if (!canvas || !host) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 700px)").matches;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080d09);
  scene.fog = new THREE.FogExp2(0x080d09, mobile ? 0.026 : 0.019);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 240);
  camera.position.set(0, 4.2, 9);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  scene.add(new THREE.HemisphereLight(0xb9d9a0, 0x10170f, 1.5));
  const keyLight = new THREE.PointLight(0xb7ee73, 42, 48, 2);
  keyLight.position.set(-3, 7, 4);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x4a9d9a, 24, 38, 2);
  fillLight.position.set(4, 4, -18);
  scene.add(fillLight);

  const lime = 0xc9f36a, mint = 0x72c6a0, blue = 0x65a8d9, violet = 0x9b82dc, gold = 0xd7a85e;
  const rooms = [
    { name: "THE DREAM OFFICE", id: "01" },
    { name: "PHP / LARAVEL LAB", id: "02" },
    { name: "CREATIVE COMMERCE STUDIO", id: "03" },
    { name: "IMMERSIVE 3D GALLERY", id: "04" },
    { name: "CAREER CONSTELLATION", id: "05" },
    { name: "THE MEETING LOUNGE", id: "06" }
  ];
  const roomSpacing = 27;
  const roomGroups = [];
  const material = (color, roughness = 0.55, metalness = 0.25, emissive = 0x000000) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: 1.1 });
  const mats = {
    floor: material(0x111a13, 0.8, 0.2),
    wall: material(0x17231a, 0.72, 0.15),
    dark: material(0x09100c, 0.4, 0.45),
    lime: material(lime, 0.28, 0.5, 0x496d1b),
    mint: material(mint, 0.3, 0.35, 0x174a36),
    blue: material(blue, 0.28, 0.35, 0x163d61),
    violet: material(violet, 0.3, 0.35, 0x39255c),
    gold: material(gold, 0.3, 0.35, 0x543613),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x9ecb9b, roughness: 0.12, metalness: 0.15, transparent: true, opacity: 0.22, transmission: 0.25 })
  };
  const box = (parent, x, y, z, w, h, d, mat, rx = 0, ry = 0, rz = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); parent.add(mesh); return mesh;
  };
  const sphere = (parent, x, y, z, radius, mat, segments = 18) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), mat);
    mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };
  const line = (parent, points, color = lime, opacity = 0.65) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    parent.add(mesh); return mesh;
  };
  const textTexture = (title, subtitle, accent = "#c9f36a") => {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 320;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#09110b"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = accent; ctx.lineWidth = 4; ctx.strokeRect(14, 14, 996, 292);
    ctx.fillStyle = accent; ctx.font = "bold 30px monospace"; ctx.fillText("SA / DIGITAL WORKSPACE", 52, 75);
    ctx.fillStyle = "#f1f5e9"; ctx.font = "bold 66px Arial"; ctx.fillText(title, 52, 165);
    ctx.fillStyle = "#aab9a2"; ctx.font = "28px monospace"; ctx.fillText(subtitle, 55, 235);
    const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  };
  const panel = (parent, x, y, z, w, h, title, subtitle, color = "#c9f36a") => {
    box(parent, x, y, z, w + 0.16, h + 0.16, 0.18, mats.dark);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: textTexture(title, subtitle, color) }));
    mesh.position.set(x, y, z + 0.105); parent.add(mesh);
    const glow = new THREE.PointLight(new THREE.Color(color), 3.5, 9, 2); glow.position.set(x, y, z + 1.5); parent.add(glow);
  };
  const ring = (parent, x, y, z, radius, color, rotation = 0) => {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.035, 8, 72), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 }));
    mesh.position.set(x, y, z); mesh.rotation.set(Math.PI / 2 + rotation, 0, 0); parent.add(mesh); return mesh;
  };
  const addRoomShell = (group, centerZ, accent) => {
    box(group, 0, -0.28, centerZ, 19, 0.45, 25, mats.floor);
    box(group, -9.5, 3, centerZ, 0.3, 6.5, 25, mats.wall);
    box(group, 9.5, 3, centerZ, 0.3, 6.5, 25, mats.wall);
    box(group, 0, 6.3, centerZ, 19, 0.25, 25, mats.dark);
    for (let i = -8; i <= 8; i += 2) {
      line(group, [[i, -0.04, centerZ - 12], [i, -0.04, centerZ + 12]], 0x8aa67a, 0.12);
    }
    for (let z = -12; z <= 12; z += 2) {
      line(group, [[-9.3, -0.035, centerZ + z], [9.3, -0.035, centerZ + z]], 0x8aa67a, 0.12);
    }
    box(group, 0, 5.95, centerZ - 12.25, 17, 0.07, 0.08, new THREE.MeshBasicMaterial({ color: accent }));
    box(group, 0, 0.02, centerZ, 0.06, 0.04, 24, new THREE.MeshBasicMaterial({ color: accent }));
  };

  const makeOffice = (group, z) => {
    addRoomShell(group, z, lime);
    panel(group, 0, 4.35, z - 12.05, 7.2, 2.25, "WELCOME, SAJJAN", "SOFTWARE ENGINEER  /  DIGITAL BUILDER");
    // Desk and ergonomic chair
    box(group, -1, 1.35, z - 1.2, 5.6, 0.22, 2.2, mats.dark);
    box(group, -1, 1.2, z - 1.2, 5.35, 0.08, 2.05, mats.lime);
    for (const x of [-3.2, 1.2]) for (const zz of [z - 1.9, z - 0.5]) box(group, x, 0.58, zz, 0.12, 1.15, 0.12, mats.dark);
    box(group, -1.2, 2.8, z - 2.05, 2.2, 1.45, 0.16, mats.dark);
    panel(group, -1.2, 2.8, z - 1.94, 1.92, 1.17, "BUILD / CREATE", "PHP  •  LARAVEL  •  3D");
    box(group, 2.5, 0.95, z - 2.5, 1.05, 1.9, 0.95, mats.wall);
    for (let i = 0; i < 4; i++) box(group, 2.5, 1.25 + i * 0.35, z - 1.98, 0.7, 0.045, 0.12, mats.mint);
    // Large glowing orb and orbit rings
    sphere(group, 4.4, 3.2, z + 2.5, 1.1, mats.lime, 28);
    ring(group, 4.4, 3.2, z + 2.5, 1.75, lime, 0.35);
    ring(group, 4.4, 3.2, z + 2.5, 2.15, mint, -0.5);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      box(group, Math.cos(a) * 6.9, 1.1 + (i % 3) * 0.45, z + Math.sin(a) * 6.9, 0.12, 0.12, 0.12, mats.lime);
    }
  };
  const makeCodeLab = (group, z) => {
    addRoomShell(group, z, mint);
    panel(group, 0, 4.35, z - 12.05, 7.2, 2.25, "PHP / LARAVEL LAB", "BACKEND SYSTEMS  •  MYSQL  •  APIs", "#72c6a0");
    // floating server racks
    for (let x of [-6, -3.8, 3.8, 6]) {
      box(group, x, 2.05, z - 2.5, 1.25, 4.1, 1.15, mats.dark);
      for (let k = 0; k < 5; k++) {
        box(group, x, 0.65 + k * 0.7, z - 1.89, 0.95, 0.42, 0.08, mats.wall);
        sphere(group, x - 0.34, 0.67 + k * 0.7, z - 1.78, 0.055, mats.mint, 8);
      }
    }
    panel(group, 0, 2.85, z - 5.2, 4.8, 2.5, "HMIS / DATABASE", "HEALTHCARE WORKFLOWS  •  REPORTS", "#72c6a0");
    for (let i = 0; i < 8; i++) {
      const bar = box(group, -2.8 + i * 0.8, 0.3 + Math.random() * 1.3, z + 1.2, 0.28, 0.7 + Math.random() * 2, 0.28, mats.mint);
      bar.userData.float = i * 0.5;
    }
    // Data stream arcs
    for (let i = 0; i < 4; i++) line(group, [[-6, 4.7 - i * 0.35, z + 4], [-3, 3.5 - i * 0.2, z + 2], [0, 4.5 - i * 0.2, z + 1], [3, 3.3 + i * 0.2, z + 2], [6, 4.6 + i * 0.2, z + 4]], mint, 0.4);
  };
  const makeCommerce = (group, z) => {
    addRoomShell(group, z, gold);
    panel(group, 0, 4.35, z - 12.05, 7.2, 2.25, "CREATIVE COMMERCE", "WORDPRESS  •  WOOCOMMERCE  •  UX", "#d7a85e");
    // Floating storefront portals
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 5.3;
      box(group, x, 2.7, z - 2.2, 3.5, 4.8, 0.25, mats.dark);
      box(group, x, 2.7, z - 2.02, 3.18, 4.45, 0.08, mats.glass);
      box(group, x, 4.45, z - 1.92, 3.18, 0.42, 0.1, mats.gold);
      for (let j = 0; j < 3; j++) {
        box(group, x - 0.85 + j * 0.85, 2.7, z - 1.83, 0.65, 1.2 + (j % 2) * 0.45, 0.12, [mats.lime, mats.mint, mats.blue][j]);
      }
      box(group, x, 0.6, z - 1.9, 2.3, 0.08, 0.5, mats.gold);
    }
    for (let i = 0; i < 14; i++) {
      const p = sphere(group, (Math.random() - 0.5) * 15, 1 + Math.random() * 4, z + (Math.random() - 0.5) * 18, 0.045 + Math.random() * 0.06, mats.gold, 8);
      p.userData.float = Math.random() * 6;
    }
  };
  const makeGallery = (group, z) => {
    addRoomShell(group, z, blue);
    panel(group, 0, 4.35, z - 12.05, 7.2, 2.25, "IMMERSIVE 3D GALLERY", "THREE.JS  •  WEBGL  •  PRODUCT WORLDS", "#65a8d9");
    const colors = [mats.lime, mats.mint, mats.blue, mats.violet, mats.gold, mats.glass];
    for (let i = 0; i < 6; i++) {
      const x = (i % 3 - 1) * 5.3;
      const zz = z + (i < 3 ? -1 : 5);
      box(group, x, 0.28, zz, 3.6, 0.22, 3.4, mats.dark);
      const shape = i % 3 === 0
        ? new THREE.Mesh(new THREE.TorusKnotGeometry(0.85, 0.25, 90, 12), colors[i])
        : i % 3 === 1
          ? new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), colors[i])
          : new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.8, 1.7, 12), colors[i]);
      shape.position.set(x, 2.2, zz); group.add(shape); shape.userData.spin = 0.15 + i * 0.04;
      ring(group, x, 0.65, zz, 1.4, [lime, mint, blue, violet, gold, lime][i]);
      const beam = new THREE.PointLight(new THREE.Color([lime, mint, blue, violet, gold, lime][i]), 7, 8, 2);
      beam.position.set(x, 3.5, zz); group.add(beam);
    }
  };
  const makeCareer = (group, z) => {
    addRoomShell(group, z, violet);
    panel(group, 0, 4.35, z - 12.05, 7.2, 2.25, "CAREER CONSTELLATION", "SICHN  •  SMBBIT  •  ORADOT  •  FREELANCE", "#9b82dc");
    const points = [[-6, 1.5, z - 1], [-2, 3.8, z + 1], [2.5, 1.9, z + 2], [6, 4.1, z + 5]];
    points.forEach((p, i) => {
      sphere(group, ...p, 0.48, [mats.lime, mats.mint, mats.blue, mats.violet][i], 20);
      ring(group, p[0], p[1], p[2], 0.78, [lime, mint, blue, violet][i]);
      if (i < points.length - 1) line(group, [p, points[i + 1]], [lime, mint, blue, violet][i], 0.7);
    });
    panel(group, -5.7, 0.9, z + 5, 3.3, 1.05, "SICHN", "PHP / MYSQL HMIS", "#c9f36a");
    panel(group, 0, 3.5, z + 6.8, 3.3, 1.05, "SMBBIT", "WEB DEVELOPER", "#72c6a0");
    panel(group, 5.6, 0.9, z + 5, 3.3, 1.05, "ORADOT", "WEB / E-COMMERCE", "#65a8d9");
  };
  const makeLounge = (group, z) => {
    addRoomShell(group, z, lime);
    panel(group, 0, 4.35, z - 12.05, 7.2, 2.25, "LET'S BUILD TOGETHER", "REMOTE WORK  •  COLLABORATION  •  IDEAS");
    // Meeting table, seats and glowing invitation portal
    box(group, 0, 1.2, z - 1.8, 6.2, 0.3, 3.1, mats.dark);
    box(group, 0, 1.38, z - 1.8, 5.9, 0.06, 2.8, mats.lime);
    for (const x of [-4, 4]) for (const zz of [z - 3.5, z - 0.1]) {
      box(group, x, 0.75, zz, 1.25, 1.2, 1.25, mats.wall);
      box(group, x, 1.45, zz + 0.2, 1.25, 0.18, 0.5, mats.mint);
    }
    const portal = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.12, 14, 72), new THREE.MeshBasicMaterial({ color: lime }));
    portal.position.set(0, 3.25, z + 5); group.add(portal);
    const core = new THREE.Mesh(new THREE.CircleGeometry(2.05, 48), new THREE.MeshBasicMaterial({ color: 0x91c95c, transparent: true, opacity: 0.13, side: THREE.DoubleSide }));
    core.position.set(0, 3.25, z + 5); group.add(core);
    panel(group, 0, 3.25, z + 5.12, 3.3, 1.05, "SAY HELLO", "SAJJANTHESOUL@GMAIL.COM");
  };

  const builders = [makeOffice, makeCodeLab, makeCommerce, makeGallery, makeCareer, makeLounge];
  builders.forEach((build, index) => {
    const group = new THREE.Group();
    const z = -index * roomSpacing;
    build(group, z);
    scene.add(group);
    roomGroups.push(group);
  });

  // Floating stars and soft particles create the dream-world atmosphere.
  const particleCount = mobile ? 260 : 650;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 42;
    positions[i * 3 + 1] = Math.random() * 12;
    positions[i * 3 + 2] = 14 - Math.random() * (roomSpacing * rooms.length + 30);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xb7dca0, size: mobile ? 0.045 : 0.06, transparent: true, opacity: 0.68, sizeAttenuation: true }));
  scene.add(particles);

  let scrollTarget = 0, scrollCurrent = 0, lastRoom = -1;
  const roomName = document.getElementById("world-room-name");
  const roomIndex = document.getElementById("world-room-index");
  const scrollHint = document.querySelector(".world-scroll-hint");
  const getScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollTarget = Math.min(1, Math.max(0, window.scrollY / max));
  };
  window.addEventListener("scroll", getScroll, { passive: true });
  getScroll();

  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener("resize", resize); resize();

  const clock = new THREE.Clock();
  let raf = 0;
  let running = true;
  const animate = () => {
    if (!running) return;
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (reduceMotion) scrollCurrent = scrollTarget;
    else scrollCurrent += (scrollTarget - scrollCurrent) * 0.055;
    const progress = scrollCurrent;
    const track = progress * (roomSpacing * (rooms.length - 1));
    const targetZ = 8 - track;
    camera.position.x = Math.sin(progress * Math.PI * 5) * (mobile ? 0.12 : 0.42);
    camera.position.y = 3.5 + Math.sin(t * 0.24) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.065;
    camera.lookAt(Math.sin(progress * Math.PI * 5) * 0.2, 2.5, camera.position.z - 7.5);
    keyLight.position.x = Math.sin(t * 0.22) * 5;
    fillLight.position.z = camera.position.z - 16;
    roomGroups.forEach(g => {
      g.children.forEach(obj => {
        if (obj.userData.spin) { obj.rotation.y += obj.userData.spin * 0.008; obj.rotation.x += obj.userData.spin * 0.002; }
        if (obj.userData.float !== undefined) obj.position.y += Math.sin(t + obj.userData.float) * 0.0008;
      });
    });
    const room = Math.min(rooms.length - 1, Math.round(progress * (rooms.length - 1)));
    if (room !== lastRoom) {
      lastRoom = room;
      if (roomName) roomName.textContent = rooms[room].name;
      if (roomIndex) roomIndex.textContent = rooms[room].id + " — 06";
    }
    if (scrollHint) scrollHint.style.opacity = progress > 0.97 ? "0" : "1";
    renderer.render(scene, camera);
  };
  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!running) { running = true; animate(); }
  });
  window.addEventListener("pagehide", () => { running = false; cancelAnimationFrame(raf); renderer.dispose(); });
})();
