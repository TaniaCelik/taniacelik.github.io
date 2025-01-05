class EmailLink extends HTMLElement {
    connectedCallback() {
      const encodedEmail = this.getAttribute("data-email") || "";
      const email = atob(encodedEmail);
      this.innerHTML = `
        <a href="mailto:${email}">${email}</a>
      `;
    }
  }
  
  customElements.define("email-link", EmailLink);
  