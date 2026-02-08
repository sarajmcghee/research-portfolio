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
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-top">
          <div className="badge">Sara McGhee Portfolio</div>
          <a className="link" href="https://github.com/sarajmcghee" target="_blank" rel="noreferrer">
            github.com/sarajmcghee
          </a>
        </div>
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
