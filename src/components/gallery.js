import { animate } from "motion";
import "./nav.js";
import "./lightbox.js";

class Gallery extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.galleryData = {};
    this.categoryCache = new Map();
  }

  static get observedAttributes() {
    return ["category"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "category" && oldValue !== newValue) {
      this.transitionCategory(newValue);
    }
  }

  async connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .gallery {
          display: flex;
          flex-wrap: wrap;
          margin: -0.5rem;
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transform-origin: top center;
          min-height: 400px;
        }
        
        .gallery img {
          width: calc(33.333% - 1rem);
          margin: 0.5rem;
          cursor: pointer;
          border-radius: 4px;
          transition: transform 0.3s ease;
        }

        .gallery img:hover,
        .gallery img.active {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .gallery img {
            width: calc(50% - 1rem);
          }
        }
      </style>
      <gallery-nav></gallery-nav>
      <div class="gallery"></div>
      <gf-lightbox></gf-lightbox>
    `;

    const initialCategory = this.getAttribute("category") || "Fences";
    await this.loadPhotos(initialCategory);
    this.setupListeners();

    const galleryEl = this.shadowRoot.querySelector(".gallery");
    setTimeout(() => {
      animate(
        galleryEl,
        {
          opacity: [0, 1],
          transform: ["translateY(30px)", "translateY(0px)"],
        },
        {
          duration: 1,
          easing: "ease-in-out",
        },
      );
    }, 1000);
  }

  async loadPhotos(category) {
    if (this.categoryCache.has(category)) {
      this.renderGallery(category, this.categoryCache.get(category));
      return;
    }

    if (!Object.keys(this.galleryData).length) {
      const response = await fetch("/photos.json");
      this.galleryData = await response.json();
    }

    const photos = this.galleryData[category.toLowerCase()] || [];
    this.categoryCache.set(category, photos);
    this.renderGallery(category, photos);
  }

  renderGallery(category, photos) {
    const galleryEl = this.shadowRoot.querySelector(".gallery");
    const lightbox = this.shadowRoot.querySelector("gf-lightbox");
    const formattedCategory = category.toLowerCase();
    const photoSources = photos.map(
      (photo) => `/images/gallery/pictures/${formattedCategory}/${photo}`
    );

    galleryEl.innerHTML = photos
      .map(
        (photo, index) => `
          <img 
            src="/images/gallery/thumbnails/${formattedCategory}/${photo}" 
            alt="${category} image ${index + 1}" 
            data-full="/images/gallery/pictures/${formattedCategory}/${photo}" 
            tabindex="0"
            role="button"
            aria-label="View enlarged image ${index + 1} of ${category}"
          />
        `
      )
      .join("");

    galleryEl.querySelectorAll("img").forEach((img) => {
      img.addEventListener("click", () => {
        const fullSrc = img.getAttribute("data-full");
        if (lightbox) lightbox.openLightbox(fullSrc, photoSources);
      });
    });
  }

  async transitionCategory(newCategory) {
    const galleryEl = this.shadowRoot.querySelector(".gallery");

    await this.loadPhotos(newCategory);

    animate(
      galleryEl,
      {
        opacity: [0, 1],
        transform: ["scale(0.98)", "scale(1)"],
        filter: ["blur(2px)", "blur(0px)"],
      },
      {
        duration: 0.2,
        easing: "ease-out",
      },
    );
  }

  setupListeners() {
    const galleryEl = this.shadowRoot.querySelector(".gallery");
    const images = galleryEl.querySelectorAll("img");
    const nav = this.shadowRoot.querySelector("gallery-nav");
    const lightbox = this.shadowRoot.querySelector("gf-lightbox");

    nav.addEventListener("category-changed", (event) => {
      const { category } = event.detail;
      this.setAttribute("category", category);
    });

    images.forEach((img) => {
      img.addEventListener("click", () => {
        const fullSrc = img.getAttribute("data-full");
        if (lightbox) {
          images.forEach((image) => image.classList.remove("active"));
          img.classList.add("active");
          lightbox.openLightbox(fullSrc);
        }
      });

      lightbox.addEventListener("lightbox-closed", () => {
        if (!img.matches(":hover")) {
          img.classList.remove("active");
        }
      });

      img.addEventListener("mouseleave", () => {
        if (!lightbox.classList.contains("open")) {
          img.classList.remove("active");
        }
      });
    });
  }
}

customElements.define("gf-gallery", Gallery);
