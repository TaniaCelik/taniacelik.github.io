class AppContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>

          .containers {
            display: flex;
            flex-wrap: wrap;
            height: 100vh;
          }

          main {
            overflow-y: scroll;
            padding: 1rem; 
            @media (min-width: 1100px) {
              height: 100vh;
              flex: 0 0 60%;
              padding: 2rem; 
            }
          }
        </style>
        <div class="containers flex wrap">
          <main>
            <gf-intro></gf-intro>
            <gf-gallery category="Fences"></gf-gallery>
          </main>
          <gf-sidebar></gf-sidebar>
        </div>
      `;
    }
  }
  
  // Define the custom element
  customElements.define("gf-app", AppContainer);
  