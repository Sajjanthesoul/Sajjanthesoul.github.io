(function () {
  const canvas = document.querySelector("#scene");
  const stage = document.querySelector(".stage");

  function showError(message) {
    const notice = document.createElement("div");
    notice.style.cssText = "position:absolute;inset:0;display:grid;place-content:center;padding:28px;text-align:center;background:#171b15;color:#f1f1e9;font:14px/1.6 Arial,sans-serif;z-index:3";
    const heading = document.createElement("strong");
    heading.textContent = "3D preview could not start";
    heading.style.cssText = "color:#c9f36a;font-size:18px;margin-bottom:10px";
    const detail = document.createElement("span");
    detail.textContent = message;
    const hint = document.createElement("small");
    hint.textContent = "Open this demo in Chrome and check that WebGL is enabled.";
    hint.style.cssText = "margin-top:12px;color:#a3a69b";
    notice.append(heading, detail, hint);
    stage.appendChild(notice);
  }

  function start() {
    if (!window.THREE) {
      showError("The 3D engine did not load. Please check your internet connection and reload.");
      return;
    }

    const THREE = window.THREE;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (error) {
      showError("WebGL is disabled or unavailable on this browser/device.");
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#20271d");
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4, 3, 5);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor("#20271d", 1);

    const group = new THREE.Group();
    scene.add(group);

    const material = new THREE.MeshStandardMaterial({ color: "#c9f36a", metalness: 0.4, roughness: 0.3 });
    const geometry = new THREE.BoxGeometry(2.1, 2.1, 2.1);
    group.add(new THREE.Mesh(geometry, material));
    group.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: "#f0ffd1", transparent: true, opacity: 0.45 })
    ));

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.035, 10, 80),
      new THREE.MeshStandardMaterial({ color: "#a2b77b", metalness: 0.5, roughness: 0.35 })
    );
    ring.rotation.x = Math.PI / 2.6;
    group.add(ring);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x536044, 1.8));
    const light = new THREE.DirectionalLight(0xffffff, 2.5);
    light.position.set(4, 5, 5);
    scene.add(light);

    function resize() {
      const width = Math.max(stage.clientWidth, 1);
      const height = Math.max(stage.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    resize();

    let dragging = false;
    let lastX = 0;
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", function (event) {
      dragging = true;
      lastX = event.clientX;
      if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointerup", function () { dragging = false; });
    canvas.addEventListener("pointercancel", function () { dragging = false; });
    canvas.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      group.rotation.y += (event.clientX - lastX) * 0.009;
      lastX = event.clientX;
    });

    document.querySelector("#finish").addEventListener("change", function (event) {
      material.color.set(event.target.value);
    });
    document.querySelector("#rotation").addEventListener("input", function (event) {
      group.rotation.y = Number(event.target.value);
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!dragging) group.rotation.y += 0.003;
      renderer.render(scene, camera);
    }
    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();