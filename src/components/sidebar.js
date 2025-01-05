import './email-link';

class Sidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        section {
          display: flex;
          gap: 32px; 
          position: sticky;
          justify-content: center;
          width: 100vw;
          background: linear-gradient(118deg, #000000 0%, #111111 16%, #1c1c1c 33%, #262626 50%, #313131 66%, #3c3c3c 83%, #474747 100%);
          color: var(--text--on-sidebar, #ffffff);
          font-family: var(--monospace, monospace);
          padding: 1rem; 
          
          @media (min-width: 1100px) {            
            padding: 4rem; 
            width: 40vw;
            height: 100vh;
            flex-direction: column;
            overflow: auto;
            align-items: center;
          }  
        }
        img.the-boys {
          max-width: 140px; 
          height: auto;
          filter: grayscale(100%);

          @media (min-width: 1100px) {
            max-width: 320px;
          }  
        }

        ul {
          list-style: none;
          line-height: 1.5; 
          margin: 0;
          padding: 0;
          text-align: center; 
          font-size: clamp(12px, 2vw, 18px);
          
          li { margin-bottom: 16px; }
        }


        a {
          color: #fff;
          text-decoration: none;
          position: relative; 
          display: inline-block;

          &::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -2px; 
            height: 2px; 
            background-image: radial-gradient(circle, #fff 25%, transparent 25%);
            background-size: 4px 4px; 
            background-repeat: repeat-x;
            transform-origin: left;
            transition: transform 0.3s ease; /* Smooth animation */
          }  
        }
      </style>
      <section>
        <img class="the-boys" src="/images/theboys.jpg" alt="Gary and his son" width="319" height="434"/>
        <ul>
          <li><strong>Call for a free quote</strong></li>
          <li><a href="tel:519-971-9450">(519) 971-9450</a></li>
          <li><a href="https://www.google.com/maps/search/?api=1&query=6970+Cantelon+Drive,+Windsor,+ON+N8T+3J9">6970 Cantelon Drive <br/> Windsor, ON N8T 3J9 🇨🇦</a></li>
          <li><email-link data-email="Z2FyeXNmZW5jaW5nQGhvdG1haWwuY29t"></email-link></li>
        </ul>
      </section>
    `;
  }
}

customElements.define("gf-sidebar", Sidebar);
