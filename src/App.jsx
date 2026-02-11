import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as FLORASYNTH from "florasynth";
import chatShot from "./assets/chat.png";
import cryShot from "./assets/cry.png";
import enigShot from "./assets/enig.jpeg";
import igKingfisherStudy from "./assets/instagram-art/DUOWvQ3EcRL.jpg";
import igTargetPractice from "./assets/instagram-art/DHRzbtpOYiC.jpg";
import igDrawingJourney from "./assets/instagram-art/DHKCTbouuDs.jpg";
import igWoodpeckerInspo from "./assets/instagram-art/DJMpq_au-ye.jpg";
import igDrawingDetail from "./assets/instagram-art/DHKCN5cujm_.jpg";
import igBlueJayInktober from "./assets/instagram-art/CU-s4qzrjg5.jpg";
import igRavenInktober from "./assets/instagram-art/CUplS_aLaQx.jpg";
import igBaldEagleStudy from "./assets/instagram-art/CTnjhBXLtMH.jpg";
import igOwlStudy from "./assets/instagram-art/CTXiXNLLZav.jpg";
import igBluebirdTweets from "./assets/instagram-art/CSsVNcvrBqb.jpg";
import igKingfisherPrismacolor from "./assets/instagram-art/CIy9qYhHpPi.jpg";

const projects = [
  {
    title: "PyTorch Bird Images Classifier",
    subtitle: "Transfer learning for fine‑grained bird species recognition",
    summary:
      "Built a reproducible transfer-learning baseline on CUB-200-2011 and reached 55.19% validation accuracy in 3 epochs while shipping reusable model artifacts.",
    details: [
      "Dataset: Kaggle 200 Bird Species (11,788 images, CUB‑200‑2011)",
      "Data split: reproducible 80/20 train/validation with class‑preserving folders",
      "Transforms: resize to 224×224, random horizontal flip for training",
      "Optimization: Adam with a smaller fine‑tuning LR and frozen early layers",
      "Training loop: 3 epochs with accuracy tracking, saved model + class map"
    ],
    outputs: ["image_model.pth", "class index mapping"],
    stack: ["PyTorch", "torchvision", "Python", "Apple MPS"],
    visualInspiration: "Kingfisher color contrast and fast silhouette recognition.",
    link: "https://github.com/sarajmcghee/research-portfolio/blob/main/notebooks/pytorch_birdimages.ipynb",
    linkLabel: "Notebook: pytorch_birdimages.ipynb",
    tone: "river"
  },
  {
    title: "Multimodal Bird ID (Audio + Image Fusion)",
    subtitle: "Cross‑checking top‑k predictions to boost confidence",
    summary:
      "Shipped a single recommendation flow by fusing top-k audio and image predictions with label mapping, reusing validated model artifacts without retraining.",
    details: [
      "Image model: ResNet18 loaded from saved PyTorch weights",
      "Audio model: joblib‑loaded classifier with standardized features",
      "Top‑k prediction utilities for both modalities",
      "Agreement check with optional audio‑label canonical mapping",
      "Interactive helper that recommends the most confident species"
    ],
    outputs: ["image_model.pth", "audio_model.joblib", "audio_scaler.joblib"],
    stack: ["PyTorch", "torchvision", "scikit‑learn", "joblib", "Apple MPS"],
    visualInspiration: "Field-note workflow: cross-checking one observation with another.",
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
    visualInspiration: "Birdsong pattern listening translated into numeric feature rhythm.",
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
    buildFocus: "Research architecture",
    visualSpark: "Natural-history notebook pacing",
    url: "https://github.com/sarajmcghee/research-portfolio",
    tone: "river"
  },
  {
    title: "React Chat App",
    summary: "Real‑time UI exploration with modern React patterns.",
    year: "2025",
    language: "JavaScript",
    buildFocus: "React UI systems",
    visualSpark: "Clean conversational hierarchy",
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
    buildFocus: "Automation logic",
    visualSpark: "Household workflow clarity",
    url: "https://github.com/sarajmcghee/KidsChoreCalendar",
    tone: "sunset"
  },
  {
    title: "Crybaby Photo",
    summary: "JavaScript visual experimentation and image‑forward UI exploration.",
    year: "2025",
    language: "JavaScript",
    buildFocus: "React + browser APIs",
    visualSpark: "Image-first composition",
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
    buildFocus: "Web storytelling",
    visualSpark: "Atmospheric contrast and tone",
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
    buildFocus: "Creative frontend experiments",
    visualSpark: "Playful interaction language",
    url: "https://github.com/sarajmcghee/Zayzilla",
    demo: "https://sarajmcghee.github.io/Zayzilla/",
    tone: "forest"
  },
  {
    title: "Portfolio Project (HTML)",
    summary: "Early web foundations and layout practice.",
    year: "2022",
    language: "HTML",
    buildFocus: "Foundational web layout",
    visualSpark: "Early portfolio composition",
    url: "https://github.com/sarajmcghee/Portfolio-Project",
    tone: "river"
  }
];

const artworkGallery = [
  {
    title: "Kingfisher Study (Instagram)",
    image: igKingfisherStudy,
    alt: "Kingfisher drawing by Sara on Instagram",
    phase: "Observation",
    medium: "Colored pencil",
    url: "https://www.instagram.com/p/DUOWvQ3EcRL/"
  },
  {
    title: "Target Practice Sketch",
    image: igTargetPractice,
    alt: "Bird sketch artwork posted by Sara on Instagram",
    phase: "Sketch",
    medium: "Graphite",
    url: "https://www.instagram.com/p/DHRzbtpOYiC/"
  },
  {
    title: "Drawing Hobby Return",
    image: igDrawingJourney,
    alt: "Bird drawing progress artwork posted by Sara on Instagram",
    phase: "Iteration",
    medium: "Pen + marker",
    url: "https://www.instagram.com/p/DHKCTbouuDs/"
  },
  {
    title: "Red-Bellied Woodpecker Inspo",
    image: igWoodpeckerInspo,
    alt: "Red-bellied woodpecker inspired artwork post by Sara on Instagram",
    phase: "Reference study",
    medium: "Wildlife observation",
    url: "https://www.instagram.com/p/DJMpq_au-ye/"
  },
  {
    title: "Drawing Hobby Return (Detail)",
    image: igDrawingDetail,
    alt: "Bird drawing detail posted by Sara on Instagram",
    phase: "Detail pass",
    medium: "Mixed media",
    url: "https://www.instagram.com/p/DHKCTbouuDs/"
  },
  {
    title: "Blue Jay Inktober",
    image: igBlueJayInktober,
    alt: "Blue jay bird drawing posted by Sara on Instagram",
    phase: "Inktober",
    medium: "Pen + ink",
    url: "https://www.instagram.com/p/CU-s4qzrjg5/"
  },
  {
    title: "Raven Inktober",
    image: igRavenInktober,
    alt: "Raven bird drawing posted by Sara on Instagram",
    phase: "Inktober",
    medium: "Pen + ink",
    url: "https://www.instagram.com/p/CUplS_aLaQx/"
  },
  {
    title: "Bald Eagle Study",
    image: igBaldEagleStudy,
    alt: "Bald eagle drawing posted by Sara on Instagram",
    phase: "Wildlife study",
    medium: "Colored pencil",
    url: "https://www.instagram.com/p/CTnjhBXLtMH/"
  },
  {
    title: "Owl Study",
    image: igOwlStudy,
    alt: "Owl drawing posted by Sara on Instagram",
    phase: "Character study",
    medium: "Colored pencil",
    url: "https://www.instagram.com/p/CTXiXNLLZav/"
  },
  {
    title: "Bluebird 'Tweets'",
    image: igBluebirdTweets,
    alt: "Bluebird drawing posted by Sara on Instagram",
    phase: "Observation",
    medium: "Colored pencil",
    url: "https://www.instagram.com/p/CSsVNcvrBqb/"
  },
  {
    title: "Kingfisher (Prismacolor)",
    image: igKingfisherPrismacolor,
    alt: "Kingfisher drawing posted by Sara on Instagram",
    phase: "Color pass",
    medium: "Colored pencil",
    url: "https://www.instagram.com/p/CIy9qYhHpPi/"
  }
];

export default function App() {
  const canvasRef = useRef(null);
  const [activeArtIndex, setActiveArtIndex] = useState(0);
  const [isArtAutoPaused, setIsArtAutoPaused] = useState(false);
  const activeArt = artworkGallery[activeArtIndex];

  const showNextArt = () => {
    setActiveArtIndex((prev) => (prev + 1) % artworkGallery.length);
  };

  const showPrevArt = () => {
    setActiveArtIndex((prev) => (prev - 1 + artworkGallery.length) % artworkGallery.length);
  };

  useEffect(() => {
    if (isArtAutoPaused) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveArtIndex((prev) => (prev + 1) % artworkGallery.length);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [isArtAutoPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene = null;
    let camera = null;
    let renderer = null;
    let world = null;
    let sun = null;
    let joyBase = null;
    let joyStick = null;
    let observer = null;
    let frameId = 0;
    let initialized = false;
    let running = false;
    let disposed = false;

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
    const lookTarget = new THREE.Vector3();

    const isSmallScreen = () =>
      window.matchMedia("(max-width: 768px)").matches || window.innerWidth < 768;

    const resize = () => {
      if (!renderer || !camera) return;
      const width = canvas.parentElement?.clientWidth || 520;
      const height = Math.min(520, width);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen() ? 1.5 : 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (sun) {
        const shadowSize = isSmallScreen() ? 1024 : 2048;
        if (sun.shadow.mapSize.x !== shadowSize || sun.shadow.mapSize.y !== shadowSize) {
          sun.shadow.mapSize.set(shadowSize, shadowSize);
          sun.shadow.map?.dispose?.();
        }
      }
    };

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
      if (!camera) return;
      camera.position.z += event.deltaY * 0.003;
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, 3, 18);
      lastInput.time = Date.now();
    };

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

    const onKeyDown = (event) => onKey(event, true);
    const onKeyUp = (event) => onKey(event, false);
    const onResize = () => resize();

    const stopRenderLoop = () => {
      running = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const animate = () => {
      if (!running || !camera || !renderer || !scene) return;

      const speed = 0.08;
      const idle = Date.now() - lastInput.time > 1800;
      const forward = (idle ? 0.45 : movement.forward) * speed;
      const strafe = (idle ? 0.1 : movement.strafe) * speed;

      camera.position.x += Math.sin(pointer.yaw) * forward + Math.cos(pointer.yaw) * strafe;
      camera.position.z += -Math.cos(pointer.yaw) * forward + Math.sin(pointer.yaw) * strafe;

      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -10, 10);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -32, 12);

      lookTarget.set(
        camera.position.x + Math.sin(pointer.yaw),
        camera.position.y + pointer.pitch,
        camera.position.z - Math.cos(pointer.yaw)
      );
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const startRenderLoop = () => {
      if (!initialized || disposed || document.hidden || running) return;
      running = true;
      frameId = requestAnimationFrame(animate);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopRenderLoop();
      else startRenderLoop();
    };

    const createForest = async () => {
      if (!world || disposed) return;
      const tree = new FLORASYNTH.Tree(FLORASYNTH.Presets.OAK);
      const meshes = await tree.generate();
      if (disposed || !world) return;

      const treeGroup = new THREE.Group();
      if (meshes.mesh) {
        meshes.mesh.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.computeVertexNormals?.();
            child.material = new THREE.MeshStandardMaterial({
              color: "#5e3f2d",
              roughness: 0.82,
              metalness: 0.03
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        treeGroup.add(meshes.mesh);
      }
      if (meshes.foliageMesh) {
        meshes.foliageMesh.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.computeVertexNormals?.();
            child.material = new THREE.MeshStandardMaterial({
              color: "#be4237",
              roughness: 0.72,
              metalness: 0.0,
              flatShading: false
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        treeGroup.add(meshes.foliageMesh);
      }
      if (meshes.fruitMesh) treeGroup.add(meshes.fruitMesh);

      const rows = 5;
      const cols = 6;
      const spacing = 6;
      for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < cols; j += 1) {
          const clone = treeGroup.clone(true);
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

    const initScene = async () => {
      if (initialized || disposed) return;
      initialized = true;

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog("#f4f0ea", 8, 32);
      scene.background = new THREE.Color("#f7f3eb");

      camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
      camera.position.set(0, 2.6, 12);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      world = new THREE.Group();
      scene.add(world);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshStandardMaterial({ color: "#e7e1d6", roughness: 0.95, metalness: 0.0 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.6;
      ground.receiveShadow = true;
      scene.add(ground);

      sun = new THREE.DirectionalLight("#ffe5c2", 1.1);
      sun.position.set(8, 12, 6);
      sun.castShadow = true;
      sun.shadow.camera.near = 0.1;
      sun.shadow.camera.far = 60;
      sun.shadow.camera.left = -18;
      sun.shadow.camera.right = 18;
      sun.shadow.camera.top = 18;
      sun.shadow.camera.bottom = -18;
      scene.add(sun);
      scene.add(new THREE.HemisphereLight("#eef4ff", "#7f6b55", 0.45));

      const fill = new THREE.DirectionalLight("#b8d7ff", 0.4);
      fill.position.set(-7, 5, -4);
      scene.add(fill);

      const rim = new THREE.DirectionalLight("#ffd6b0", 0.28);
      rim.position.set(-3, 3, 9);
      scene.add(rim);

      joyBase = document.getElementById("joystick-base");
      joyStick = document.getElementById("joystick-stick");

      window.addEventListener("resize", onResize);
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

      resize();
      await createForest();
      startRenderLoop();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const isVisible = entries.some((entry) => entry.isIntersecting);
          if (!isVisible) return;
          observer?.disconnect();
          observer = null;
          initScene();
        },
        { root: null, threshold: 0.15 }
      );
      observer.observe(canvas);
    } else {
      initScene();
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      stopRenderLoop();

      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
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

      if (scene) {
        scene.traverse((node) => {
          if (!node.isMesh) return;
          node.geometry?.dispose?.();
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach((material) => {
            if (!material) return;
            Object.values(material).forEach((value) => {
              if (value?.isTexture) value.dispose();
            });
            material.dispose?.();
          });
        });
      }

      renderer?.dispose();
      renderer?.renderLists?.dispose?.();
      renderer?.forceContextLoss?.();
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
              <span>Full-Stack Engineer transitioning into AI/ML</span>
            </h1>
            <p className="lead">
              I build production-ready full-stack systems in React and Node, and I am extending that
              foundation into practical AI/ML workflows. My portfolio shows how I turn research
              prototypes into clear, shippable product experiences.
            </p>
            <div className="hero-actions">
              <a className="button" href="#tech-builds">Explore Tech Builds</a>
              <a className="button ghost" href="#art-practice">See Art Practice</a>
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
          <h2>Research Systems</h2>
          <p>Machine-learning case studies built from field-note precision.</p>
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
              <span className="label">Visual inspiration</span>
              <p className="small">{project.visualInspiration}</p>
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
            I use drawing as a systems-thinking practice: framing, hierarchy, and edge detection in art
            transfer directly into how I design interfaces and model pipelines. Birds are my constant
            benchmark for detail, motion, and clarity.
          </p>
        </div>
        <div className="panel">
          <h3>How I Build in React</h3>
          <div className="chips">
            <span className="chip">Component-first architecture</span>
            <span className="chip">State-driven interaction design</span>
            <span className="chip">Accessible defaults + responsive polish</span>
          </div>
          <p className="small">
            I treat React as a sketchbook for behavior: prototype quickly, refine composition, then
            ship maintainable UI systems.
          </p>
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

      <section id="tech-builds" className="section">
        <div className="section-title">
          <h2>Tech Builds</h2>
          <p>React interfaces, creative web experiments, and ML tooling with visual intent.</p>
        </div>
        <div className="grid">
          {highlights.map((item) => {
            const primaryUrl = item.demo || item.url;

            return (
              <article className="highlight-card" key={item.title}>
                <a className="highlight-media-link" href={primaryUrl} target="_blank" rel="noreferrer">
                  {item.image ? (
                    <img className="shot" src={item.image} alt={`${item.title} screenshot`} />
                  ) : (
                    <div className={`thumb ${item.tone}`} aria-hidden="true" />
                  )}
                </a>
                <div>
                  <div className="highlight-head">
                    <h3>{item.title}</h3>
                    <span className="pill">{item.year}</span>
                  </div>
                  <p>{item.summary}</p>
                  <div className="highlight-meta">
                    <span className="chip">{item.language}</span>
                    <span className="chip">{item.buildFocus}</span>
                    {item.demo ? (
                      <a className="demo" href={item.demo} target="_blank" rel="noreferrer">
                        Live
                      </a>
                    ) : null}
                    <a className="repo-link" href={item.url} target="_blank" rel="noreferrer">
                      Repo
                    </a>
                  </div>
                  <p className="small">Visual spark: {item.visualSpark}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="art-practice" className="section art">
        <div className="section-title">
          <h2>Art Practice</h2>
          <p>Observation to sketch to composition studies that guide my interface decisions.</p>
        </div>
        <div className="art-feed-link">
          <a
            className="button ghost"
            href="https://www.instagram.com/mcberalance/"
            target="_blank"
            rel="noreferrer"
          >
            More art + stories on Instagram
          </a>
        </div>
        <div
          className="art-carousel"
          onMouseEnter={() => setIsArtAutoPaused(true)}
          onMouseLeave={() => setIsArtAutoPaused(false)}
          onFocusCapture={() => setIsArtAutoPaused(true)}
          onBlurCapture={() => setIsArtAutoPaused(false)}
        >
          <div className="art-stage">
            <button
              className="carousel-control"
              type="button"
              onClick={showPrevArt}
              aria-label="Previous artwork"
            >
              ←
            </button>
            <figure className="art-card">
              <a href={activeArt.url} target="_blank" rel="noreferrer">
                <img src={activeArt.image} alt={activeArt.alt} />
              </a>
              <figcaption>
                <a className="link" href={activeArt.url} target="_blank" rel="noreferrer">
                  {activeArt.title}
                </a>
                <div className="art-meta">
                  <span className="chip">{activeArt.phase}</span>
                  <span className="chip">{activeArt.medium}</span>
                </div>
              </figcaption>
            </figure>
            <button
              className="carousel-control"
              type="button"
              onClick={showNextArt}
              aria-label="Next artwork"
            >
              →
            </button>
          </div>
          <div className="art-thumbs" aria-label="Artwork thumbnails">
            {artworkGallery.map((piece, idx) => (
              <button
                key={piece.title}
                type="button"
                className={`art-thumb${idx === activeArtIndex ? " is-active" : ""}`}
                onClick={() => setActiveArtIndex(idx)}
                aria-label={`Show ${piece.title}`}
              >
                <img src={piece.image} alt={piece.alt} />
              </button>
            ))}
          </div>
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
