import "./src/style.css";
import "./src/components/app.js";
import "./src/components/gallery.js";
import "./src/components/sidebar.js";
import "./src/components/introduction.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").innerHTML = `
    <gf-app></gf-app>
    </div>
  `;
});
