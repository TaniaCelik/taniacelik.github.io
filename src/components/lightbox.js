class Lightbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.images = [];
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .open {
          visibility: visible;
          opacity: 1;
        }
  
        img.image {
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
  
        .lightbox-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          background: url('/images/x.svg') no-repeat center / contain;
          background-color: transparent;
          border: none;
          cursor: pointer;
          filter: invert(1); /* Make the icon white */
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .lightbox-close:hover {
          transform: scale(1.1); /* Slight zoom effect */
          opacity: 0.8; /* Subtle fade effect */
        }

        .arrow {          
          display: block;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0) no-repeat center / contain;
          border: none;
          width: 48px;
          height: 48px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
          filter: invert(1); /* Forces the icon to appear white */
}

.arrow.left {
  left: 1rem;
  background-image: url('/images/chevron-left.svg'); /* Use left chevron */
}

.arrow.right {
  right: 1rem;
  background-image: url('/images/chevron-right.svg'); /* Use right chevron */
}

.arrow:hover {
  /* transform: scale(1.1); */
  transform-origin: center;
}

      </style>
        <div class="lightbox" role="dialog" aria-labelledby="lightbox-title" aria-hidden="true">
        <button class="lightbox-close" aria-label="Close lightbox"></button>
        <button class="arrow left" aria-label="Previous image"></button>
<img class="image" src="" alt="Expanded view" />
<button class="arrow right" aria-label="Next image"></button>
      </div>
    `;

    this.lightboxEl = this.shadowRoot.querySelector(".lightbox");
    this.imageEl = this.shadowRoot.querySelector("img");
    this.closeButton = this.shadowRoot.querySelector(".lightbox-close");
    this.prevButton = this.shadowRoot.querySelector(".arrow.left");
    this.nextButton = this.shadowRoot.querySelector(".arrow.right");

    this.closeButton.addEventListener("click", () => this.closeLightbox());
    this.prevButton.addEventListener("click", () => this.showPreviousImage());
    this.nextButton.addEventListener("click", () => this.showNextImage());
    this.lightboxEl.addEventListener("click", (e) => {
      if (e.target === this.lightboxEl) this.closeLightbox();
    });

    document.addEventListener("keydown", (e) => this.handleKeydown(e));

    this.imageEl.addEventListener("touchstart", (e) =>
      this.handleTouchStart(e),
    );
    this.imageEl.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.imageEl.addEventListener("touchend", () => this.handleTouchEnd());
  }

  openLightbox(src, images) {
    if (!Array.isArray(images)) {
      console.error("Expected an array of images, but got:", images);
      return;
    }

    this.images = images;
    this.currentIndex = images.indexOf(src);
    if (this.currentIndex === -1) {
      console.error("Image not found in the list:", src);
      return;
    }
    this.updateImage();
    this.lightboxEl.setAttribute("aria-hidden", "false");
    this.lightboxEl.classList.add("open");
    this.closeButton.focus();
  }

  closeLightbox() {
    this.lightboxEl.setAttribute("aria-hidden", "true");
    this.lightboxEl.classList.remove("open");
    this.imageEl.src = "";
    this.images = [];
    this.currentIndex = 0;

    // Dispatch a custom event to notify the gallery that the lightbox is closed
    const event = new CustomEvent("lightbox-closed", {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  handleKeydown(e) {
    if (e.key === "Escape") {
      this.closeLightbox();
    } else if (e.key === "ArrowRight") {
      this.showNextImage();
    } else if (e.key === "ArrowLeft") {
      this.showPreviousImage();
    }
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  handleTouchMove(e) {
    this.touchEndX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    const deltaX = this.touchEndX - this.touchStartX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        this.showNextImage();
      } else {
        this.showPreviousImage();
      }
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  showNextImage() {
    if (this.images.length > 1) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.updateImage();
    }
  }

  showPreviousImage() {
    if (this.images.length > 1) {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.updateImage();
    }
  }

  updateImage() {
    this.imageEl.src = this.images[this.currentIndex];
  }
}

customElements.define("gf-lightbox", Lightbox);
