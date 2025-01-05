import { animate } from "motion";

class Introduction extends HTMLElement {
  connectedCallback() {
    this.style.opacity = "0";
    this.style.transform = "translateY(40px)"; 

    this.innerHTML = `
      <style>
        p {
          line-height: 1.5; 
          font-size: clamp(1.4rem, 2.5vw, 3rem);
          margin-top: 48px;
          margin-bottom: 48px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          max-width: 500px;
        }
        @media (min-width: 1100px) {
          div {
            max-width: 100%;
          }
          p {
            text-align: left;
            margin-top: 33vh;
            margin-left: 0;
            max-width: 100%;
          }
        }
      </style>
      <div>
        <p>
          <strong>Gary's Fencing</strong> has been providing quality aluminum fences, gates, and railings to the Windsor and Essex county area since 1983.
        </p>
      </div>
    `;

    requestAnimationFrame(() => {
      animate(
        this,
        {
          opacity: [0, 1],
          transform: ["translateY(40px)", "translateY(0px)"],
        },
        {
          ease: [0.39, 0.24, 0.3, 1],
          duration: 3,
        },
      );
    });
  }
}

customElements.define("gf-intro", Introduction);
