const canvas = document.querySelector("#scene");
const stage = document.querySelector(".stage");

function showError(message) {
  const notice = document.createElement("div");
  notice.style.cssText = "position:absolute;inset:0;display:grid;place-content:center;padding:28px;text-align:center;background:#171b15;color:#f1f1e9;font:14px/1.6 Arial,sans-serif;z-index:2";
  notice.innerHTML = '<strong style="color:#c9f36a;font-size:18px;margin-bottom:10px">3D preview could not start</strong><span></span><small style="margin-top:12px;color:#a3a69b">Try opening this page in Chrome and enable hardware acceleration/WebGL.</small>';
  notice.querySelector("span").textContent = message;
  stage.appendChild(notice);
}

async function loadThree() {
  try {
    return await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (firstError) {
    try {
      return await import("https://unpkg.com/three@0.160.0/build/three.module.js");
    } catch (secondError) {
      throw new Error("The 3D library could not be downloaded. Check your internet connection or try Chrome.");
    }
  }
}

async function start() {
  try {
    const THREE = await loadThree();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#20271d");

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4, 3, 5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (error) {
      throw new Error("WebGL is unavailable in this browser or device.");
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    scene.add(group);

    const material = new THREE.MeshStandardMaterial({
      color: "#c9f36a",
      metalness: 0.45,
      roughness: 0.24
    });
    const geometry = new THREE.BoxGeometry(2.1, 2.1, 2.1);
    const body = new THREE.Mesh(geometry, material);
    group.add(body);

    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: "#f0ffd1", transparent: true, opacity: 0.4 })
    );
    group.add(edge);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.035, 12, 100),
      new THREE.MeshStandardMaterial({ color: "#a2b77b", metalness: 0.6, roughness: 0.3 })
    );
    ring.rotation.x = Math.PI / 2.6;
    group.add(ring);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x536044, 2));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(4, 5, 5);
    scene.add(light);

    function resize() {
      const width = Math.max(stage.clientWidth, 1);
      const height = Math.max(stage.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(resize).observe(stage);
    }
    window.addEventListener("resize", resize);
    resize();

    let dragging = false;
    let lastX = 0;
    canvas.style.touchAction = "none";

    canvas.addEventListener("pointerdown", event => {
      dragging = true;
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointerup", () => dragging = false);
    canvas.addEventListener("pointercancel", () => dragging = false);
    canvas.addEventListener("pointermove", event => {
      if (!dragging) return;
      group.rotation.y += (event.clientX - lastX) * 0.009;
      lastX = event.clientX;
    });

    document.querySelector("#finish").addEventListener("change", event => {
      material.color.set(event.target.value);
    });
    document.querySelector("#rotation").addEventListener("input", event => {
      group.rotation.y = Number(event.target.value);
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!dragging) group.rotation.y += 0.003;
      renderer.render(scene, camera);
    }
    animate();
  } catch (error) {
    console.error("3D configurator:", error);
    showError(error && error.message ? error.message : "An unexpected error occurred.");
  }
}

start();