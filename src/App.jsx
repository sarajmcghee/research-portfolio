import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as FLORASYNTH from "florasynth";
import chatShot from "./assets/chat.png";
import cryShot from "./assets/cry.png";
import enigShot from "./assets/enig.jpeg";
import kingfisherArt from "./assets/king.jpg";

const projects = [
  {
    title: "PyTorch Bird Images Classifier",
    subtitle: "Transfer learning for fine‑grained bird species recognition",
    summary:
      "A local training pipeline that prepares a bird image dataset, fine‑tunes a ResNet-style model, and saves reusable artifacts for downstream inference.",
    details: [
      "Dataset: Kaggle 200 Bird Species (11,788 images, CUB‑200‑2011)",
      "Data split: reproducible 80/20 train/validation with class‑preserving folders",
      "Transforms: resize to 224×224, random horizontal flip for training",
      "Optimization: Adam with a smaller fine‑tuning LR and frozen early layers",
      "Training loop: 3 epochs with accuracy tracking, saved model + class map"
    ],
    outputs: ["image_model.pth", "class index mapping"],
    stack: ["PyTorch", "torchvision", "Python", "Apple MPS"],
    link: "https://github.com/sarajmcghee/research-portfolio/blob/main/notebooks/pytorch_birdimages.ipynb",
    linkLabel: "Notebook: pytorch_birdimages.ipynb",
    tone: "river"
  },
  {
    title: "Multimodal Bird ID (Audio + Image Fusion)",
    subtitle: "Cross‑checking top‑k predictions to boost confidence",
    summary:
      "Combines a fine‑tuned ResNet image classifier with a trained audio model and a lightweight agreement check for better bird identification.",
    details: [
      "Image model: ResNet18 loaded from saved PyTorch weights",
      "Audio model: joblib‑loaded classifier with standardized features",
      "Top‑k prediction utilities for both modalities",
      "Agreement check with optional audio‑label canonical mapping",
      "Interactive helper that recommends the most confident species"
    ],
    outputs: ["image_model.pth", "audio_model.joblib", "audio_scaler.joblib"],
    stack: ["PyTorch", "torchvision", "scikit‑learn", "joblib", "Apple MPS"],
    link: "https://github.com/sarajmcghee/research-portfolio/blob/main/notebooks/pytorch_fusion_audio_image_Bird.ipynb",
    linkLabel: "Notebook: pytorch_fusion_audio_image_Bird.ipynb",
    tone: "sunset"
  },
  {
    title: "Birdsong Audio Baseline",
    subtitle: "Numeric feature classification + confusion matrix review",
    summary:
      "A clean audio‑only baseline that scales numeric features, trains a logistic regression classifier, and exports artifacts for later fusion.",
    details: [
      "Dataset: Birdsong numeric features (train/test split)",
      "StandardScaler normalization for stable training",
      "Logistic regression baseline with accuracy tracking",
      "Confusion matrix visualization for class‑level errors",
      "Saved artifacts: model, scaler, feature columns, classes"
    ],
    outputs: ["audio_model.joblib", "audio_scaler.joblib", "audio_feature_columns.joblib"],
    stack: ["scikit‑learn", "pandas", "joblib", "Python"],
    link: "https://github.com/sarajmcghee/research-portfolio/blob/main/notebooks/pytorch_birdSongs.ipynb",
    linkLabel: "Notebook: pytorch_birdSongs.ipynb",
    tone: "forest"
  }
];

const highlights = [
  {
    title: "Research Portfolio",
    summary: "Current home for ML research notes, notebooks, and portfolio updates.",
    year: "2026",
    language: "Jupyter Notebook",
    url: "https://github.com/sarajmcghee/research-portfolio",
    tone: "river"
  },
  {
    title: "React Chat App",
    summary: "Real‑time UI exploration with modern React patterns.",
    year: "2025",
    language: "JavaScript",
    url: "https://github.com/sarajmcghee/react-chat-app",
    demo: "https://sarajmcghee.github.io/react-chat-app/",
    image: chatShot,
    tone: "sunset"
  },
  {
    title: "Kids Chore Calendar",
    summary: "Utility scripting and scheduling logic in Python.",
    year: "2024",
    language: "Python",
    url: "https://github.com/sarajmcghee/KidsChoreCalendar",
    tone: "sunset"
  },
  {
    title: "Crybaby Photo",
    summary: "JavaScript visual experimentation and image‑forward UI exploration.",
    year: "2025",
    language: "JavaScript",
    url: "https://github.com/sarajmcghee/crybaby-photo",
    demo: "https://sarajmcghee.github.io/crybaby-photo/",
    image: cryShot,
    tone: "river"
  },
  {
    title: "Unearthed Enigma",
    summary: "Moody web experience with strong visual atmosphere.",
    year: "2024",
    language: "JavaScript",
    url: "https://sarajmcghee.github.io/unearthed-enigma/",
    demo: "https://sarajmcghee.github.io/unearthed-enigma/",
    image: enigShot,
    tone: "forest"
  },
  {
    title: "Zayzilla",
    summary: "Creative JavaScript experimentation and front‑end exploration.",
    year: "2024",
    language: "JavaScript",
    url: "https://github.com/sarajmcghee/Zayzilla",
    demo: "https://sarajmcghee.github.io/Zayzilla/",
    tone: "forest"
  },
  {
    title: "Portfolio Project (HTML)",
    summary: "Early web foundations and layout practice.",
    year: "2022",
    language: "HTML",
    url: "https://github.com/sarajmcghee/Portfolio-Project",
    tone: "river"
  }
];

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#f4f0ea", 8, 32);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    camera.position.set(0, 2.6, 12);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const world = new THREE.Group();
    scene.add(world);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: "#e7e1d6" })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.6;
    scene.add(ground);

    const sun = new THREE.DirectionalLight("#ffe5c2", 1.1);
    sun.position.set(6, 10, 4);
    scene.add(sun);
    scene.add(new THREE.AmbientLight("#d9e6e4", 0.7));

    let baseTree = null;
    const movement = {
      forward: 0,
      strafe: 0
    };
    const pointer = {
      active: false,
      lastX: 0,
      lastY: 0,
      yaw: 0,
      pitch: -0.08
    };
    const joystick = {
      active: false,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0
    };
    const lastInput = { time: Date.now() };

    const createForest = async () => {
      const tree = new FLORASYNTH.Tree(FLORASYNTH.Presets.ASH);
      const meshes = await tree.generate();
      const treeGroup = new THREE.Group();
      if (meshes.mesh) {
        meshes.mesh.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.computeVertexNormals?.();
            child.material = new THREE.MeshStandardMaterial({
              color: "#5a3a26",
              roughness: 0.7,
              metalness: 0.0
            });
          }
        });
        treeGroup.add(meshes.mesh);
      }
      if (meshes.foliageMesh) {
        meshes.foliageMesh.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.computeVertexNormals?.();
            child.material = new THREE.MeshStandardMaterial({
              color: "#c7392f",
              roughness: 0.5,
              metalness: 0.0,
              flatShading: false
            });
          }
        });
        treeGroup.add(meshes.foliageMesh);
      }
      if (meshes.fruitMesh) treeGroup.add(meshes.fruitMesh);
      baseTree = treeGroup;

      const rows = 5;
      const cols = 6;
      const spacing = 6;
      for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < cols; j += 1) {
          const clone = baseTree.clone(true);
          const x = (j - (cols - 1) / 2) * spacing + (Math.random() - 0.5) * 2.2;
          const z = -i * spacing - Math.random() * 4;
          const scale = 0.07 + Math.random() * 0.03;
          clone.position.set(x, -0.6, z);
          clone.scale.setScalar(scale);
          clone.rotation.y = Math.random() * Math.PI * 2;
          world.add(clone);
        }
      }
    };

    createForest();

    const resize = () => {
      const width = canvas.parentElement?.clientWidth || 520;
      const height = Math.min(520, width);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    const onKey = (event, isDown) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          movement.forward = isDown ? 1 : 0;
          if (isDown) lastInput.time = Date.now();
          break;
        case "KeyS":
        case "ArrowDown":
          movement.forward = isDown ? -1 : 0;
          if (isDown) lastInput.time = Date.now();
          break;
        case "KeyA":
        case "ArrowLeft":
          movement.strafe = isDown ? -1 : 0;
          if (isDown) lastInput.time = Date.now();
          break;
        case "KeyD":
        case "ArrowRight":
          movement.strafe = isDown ? 1 : 0;
          if (isDown) lastInput.time = Date.now();
          break;
        default:
          break;
      }
    };

    const onPointerDown = (event) => {
      pointer.active = true;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      lastInput.time = Date.now();
    };

    const onPointerMove = (event) => {
      if (!pointer.active) return;
      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.yaw -= dx * 0.002;
      pointer.pitch = THREE.MathUtils.clamp(pointer.pitch - dy * 0.002, -0.35, 0.35);
      lastInput.time = Date.now();
    };

    const onPointerUp = () => {
      pointer.active = false;
    };

    const onWheel = (event) => {
      camera.position.z += event.deltaY * 0.003;
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, 3, 18);
      lastInput.time = Date.now();
    };

    const joyBase = document.getElementById("joystick-base");
    const joyStick = document.getElementById("joystick-stick");

    const onJoyStart = (event) => {
      if (!joyBase || !joyStick) return;
      joystick.active = true;
      const touch = event.touches ? event.touches[0] : event;
      const rect = joyBase.getBoundingClientRect();
      joystick.startX = rect.left + rect.width / 2;
      joystick.startY = rect.top + rect.height / 2;
      joystick.x = touch.clientX - joystick.startX;
      joystick.y = touch.clientY - joystick.startY;
      lastInput.time = Date.now();
    };

    const onJoyMove = (event) => {
      if (!joystick.active || !joyBase || !joyStick) return;
      if (event.cancelable) event.preventDefault();
      const touch = event.touches ? event.touches[0] : event;
      const dx = touch.clientX - joystick.startX;
      const dy = touch.clientY - joystick.startY;
      const max = 30;
      const dist = Math.min(Math.hypot(dx, dy), max);
      const angle = Math.atan2(dy, dx);
      joystick.x = Math.cos(angle) * dist;
      joystick.y = Math.sin(angle) * dist;
      joyStick.style.transform = `translate(${joystick.x}px, ${joystick.y}px)`;
      movement.strafe = THREE.MathUtils.clamp(joystick.x / max, -1, 1);
      movement.forward = THREE.MathUtils.clamp(-joystick.y / max, -1, 1);
      lastInput.time = Date.now();
    };

    const onJoyEnd = () => {
      if (!joyBase || !joyStick) return;
      joystick.active = false;
      joystick.x = 0;
      joystick.y = 0;
      joyStick.style.transform = "translate(0px, 0px)";
      movement.forward = 0;
      movement.strafe = 0;
    };

    const onKeyDown = (e) => onKey(e, true);
    const onKeyUp = (e) => onKey(e, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: true });
    joyBase?.addEventListener("pointerdown", onJoyStart);
    window.addEventListener("pointermove", onJoyMove);
    window.addEventListener("pointerup", onJoyEnd);
    joyBase?.addEventListener("touchstart", onJoyStart, { passive: true });
    window.addEventListener("touchmove", onJoyMove, { passive: false });
    window.addEventListener("touchend", onJoyEnd);

    let frameId;
    const animate = () => {
      const speed = 0.08;
      const idle = Date.now() - lastInput.time > 1800;
      const forward = (idle ? 0.45 : movement.forward) * speed;
      const strafe = (idle ? 0.1 : movement.strafe) * speed;

      camera.position.x += Math.sin(pointer.yaw) * forward + Math.cos(pointer.yaw) * strafe;
      camera.position.z += Math.cos(pointer.yaw) * forward - Math.sin(pointer.yaw) * strafe;

      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -10, 10);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -32, 12);

      const lookTarget = new THREE.Vector3(
        camera.position.x + Math.sin(pointer.yaw),
        camera.position.y + pointer.pitch,
        camera.position.z - Math.cos(pointer.yaw)
      );
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("wheel", onWheel);
      joyBase?.removeEventListener("pointerdown", onJoyStart);
      window.removeEventListener("pointermove", onJoyMove);
      window.removeEventListener("pointerup", onJoyEnd);
      joyBase?.removeEventListener("touchstart", onJoyStart);
      window.removeEventListener("touchmove", onJoyMove);
      window.removeEventListener("touchend", onJoyEnd);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-top">
          <div className="badge">Sara McGhee Portfolio</div>
          <a className="link" href="https://github.com/sarajmcghee" target="_blank" rel="noreferrer">
            github.com/sarajmcghee
          </a>
        </div>
        <div className="hero-main">
          <div>
            <h1>
              Sara McGhee
              <span>Minimalist AI portfolio with a love for birds</span>
            </h1>
            <p className="lead">
              I build focused machine‑learning experiments that respect data locality, model clarity, and
              nature‑inspired aesthetics. My latest work explores how transfer learning can make a compact
              bird classifier both accurate and fast to iterate.
            </p>
            <div className="hero-actions">
              <a className="button" href="#work">Latest PyTorch work</a>
              <a className="button ghost" href="#about">About</a>
            </div>
          </div>
          <div className="hero-canvas forest">
            <canvas ref={canvasRef} aria-hidden="true" />
            <div id="joystick-base" className="joystick" aria-hidden="true">
              <div id="joystick-stick" className="joystick-stick" />
            </div>
          </div>
        </div>
      </header>

      <section id="work" className="section">
        <div className="section-title">
          <h2>Latest PyTorch Work</h2>
          <p>Inspired by kingfisher precision: quick dives, clean retrieval.</p>
        </div>
        {projects.map((project) => (
          <article className="card" key={project.title}>
            <div className="card-header">
              <div className="card-title">
                <div className={`thumb ${project.tone}`} aria-hidden="true" />
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.subtitle}</p>
                </div>
              </div>
              <div className="pill">2026</div>
            </div>
            <p className="card-summary">{project.summary}</p>
            <ul className="list">
              {project.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="meta">
              <div>
                <span className="label">Outputs</span>
                <div className="chips">
                  {project.outputs.map((item) => (
                    <span className="chip" key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="label">Stack</span>
                <div className="chips">
                  {project.stack.map((item) => (
                    <span className="chip" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="path">
              <span className="label">Notebook</span>
              <a className="link" href={project.link} target="_blank" rel="noreferrer">
                {project.linkLabel}
              </a>
            </div>
          </article>
        ))}
      </section>

      <section id="about" className="section split">
        <div>
          <h2>About</h2>
          <p>
            I gravitate toward projects where careful data handling and expressive model design meet.
            Birds are a perfect testbed: subtle class boundaries, diverse textures, and the need for
            graceful generalization.
          </p>
        </div>
        <div className="panel">
          <h3>Kingfisher Palette</h3>
          <div className="palette">
            <span style={{ "--swatch": "var(--kingfisher-orange)" }} />
            <span style={{ "--swatch": "var(--teal)" }} />
            <span style={{ "--swatch": "var(--aqua)" }} />
            <span style={{ "--swatch": "var(--ink)" }} />
          </div>
          <p className="small">
            Clean lines, bright accents, and a hint of river‑light shimmer.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Development Highlights</h2>
          <p>A curated grid tracing the evolution of tools, languages, and focus.</p>
        </div>
        <div className="grid">
          {highlights.map((item) => (
            <a className="highlight-card" key={item.title} href={item.url} target="_blank" rel="noreferrer">
              {item.image ? (
                <img className="shot" src={item.image} alt={`${item.title} screenshot`} />
              ) : (
                <div className={`thumb ${item.tone}`} aria-hidden="true" />
              )}
              <div>
                <div className="highlight-head">
                  <h3>{item.title}</h3>
                  <span className="pill">{item.year}</span>
                </div>
                <p>{item.summary}</p>
                <div className="highlight-meta">
                  <span className="chip">{item.language}</span>
                  {item.demo ? (
                    <span className="demo">Live</span>
                  ) : null}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section art">
        <div className="section-title">
          <h2>Art</h2>
          <p>Original kingfisher study in colored pencil.</p>
        </div>
        <div className="art-card">
          <img src={kingfisherArt} alt="Kingfisher drawing by Sara McGhee" />
        </div>
      </section>


      <footer className="footer">
        <span>© 2026 Sara McGhee</span>
        <span className="dot" />
        <a className="link" href="https://github.com/sarajmcghee" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
}
