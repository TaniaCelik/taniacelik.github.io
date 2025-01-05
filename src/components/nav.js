import { animate } from "motion";

class GalleryNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.categories = ["Fences", "Gates", "Railings"]; // Default categories
  }

  connectedCallback() {
    this.style.opacity = "0"; // Start hidden
    this.style.transform = "translateY(20px)"; // Initial position for animation

    this.shadowRoot.innerHTML = `
      <style>
        nav {
          display: flex;
          gap: var(--spacing-1);
          font-family: var(--monospace);
          margin-bottom: var(--spacing-1);
          justify-content: center;

          @media (min-width: 1100px) {
            justify-content: left;
          }
        }

        ul {
          list-style: none;
          display: flex;
          gap: var(--spacing-1, 0.5rem);
          padding: 0;
          margin: 0;
        }

        li {
          cursor: pointer;
          padding: 8px;
          font-size: 1rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          text-align: center;
          transition:0s;
          user-select: none
        }

        li:hover {
          background: lightgrey;
          user-select: none;
          /* color: white; */
        }

        .active, .active:hover {
          background: black;
          color: white;
          pointer-events: none;
        }
      </style>

      <nav role="navigation" aria-label="Gallery categories">
        <ul role="menu">
          ${this.categories
            .map(
              (category, index) =>
                `<li 
                  role="menuitem" 
                  tabindex="${index === 0 ? "0" : "-1"}"
                  class="${index === 0 ? "active" : ""}" 
                  data-category="${category}">
                  ${category}
                </li>`,
            )
            .join("")}
        </ul>
      </nav>
    `;

    // Animate the navigation
    setTimeout(() => {
      animate(
        this,
        {
          opacity: [0, 1],
          transform: ["translateY(20px)", "translateY(0px)"],
        },
        {
          duration: 0.8,
          easing: "ease-in-out",
        },
      );
    }, 1000);

    this.setupListeners();
  }

  setupListeners() {
    const navItems = this.shadowRoot.querySelectorAll("nav li");
    const gallery = document
      .querySelector("gf-gallery")
      .shadowRoot.querySelector(".gallery");

    navItems.forEach((item) => {
      // Hover animation
      item.addEventListener("mouseenter", () => {
        animate(
          item,
          {
            scale: 1.02,
          },
          {
            duration: 0.2,
            easing: "ease-out",
          },
        );
      });

      item.addEventListener("mouseleave", () => {
        animate(
          item,
          {
            scale: 1,
          },
          {
            duration: 0.2,
            easing: "ease-out",
          },
        );
        animate(
          gallery,
          {
            scale: 1,
            filter: ["blur(0px)"],
          },
          {
            duration: 0.2,
            easing: "ease-out",
          },
        );
      });

      // Click animation
      item.addEventListener("mousedown", () => {
        animate(
          item,
          {
            scale: 0.99,
          },
          {
            duration: 0.2,
            easing: "ease-out",
          },
        );
        // Scale down the gallery along with the nav item
        animate(
          gallery,
          {
            opacity: 0.1,
            scale: 0.99,
            filter: ["blur(1px)"],
          },
          {
            duration: 0.2,
            easing: "ease-out",
          },
        );
      });

      item.addEventListener("mouseup", () => {
        animate(
          item,
          {
            scale: 1.02,
          },
          {
            duration: 0.2,
            easing: "ease-out",
          },
        );
        // Restore gallery scale
        animate(
          gallery,
          {
            scale: 1,
          },
          {
            duration: 0.2,
            easing: "ease-out",
          },
        );
      });

      // Navigation item activation
      item.addEventListener("click", () => {
        this.setActiveItem(item, navItems);
        const category = item.getAttribute("data-category");
        this.dispatchEvent(
          new CustomEvent("category-changed", { detail: { category } }),
        );
      });

      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.setActiveItem(item, navItems);
          const category = item.getAttribute("data-category");
          this.dispatchEvent(
            new CustomEvent("category-changed", { detail: { category } }),
          );
        }
      });
    });
  }

  setActiveItem(selectedItem, navItems) {
    navItems.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("tabindex", "-1");
    });
    selectedItem.classList.add("active");
    selectedItem.setAttribute("tabindex", "0");
    selectedItem.focus();
  }
}

customElements.define("gallery-nav", GalleryNav);
