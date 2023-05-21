import { getFilteredAvatar } from "@/modules/getFilteredAvatar.js";

class UserData extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        --size: 300px;
      }

      .container {
        width: var(--size);
        height: var(--size);
        background: black;
        border: 1px solid #fff;
      }

      .avatar {
        position: relative;
        width: var(--size);
        height: var(--size);
        overflow: hidden;
      }

      .avatar::after {
        content: "";
        display: block;
        width: 150%;
        height: 150%;
        inset: 0;
        position: absolute;
        background: linear-gradient(
          -45deg,
          transparent 45%,
          #fff5 49% 51%,
          transparent 55%
        );
        z-index: 5;
        transform: translate(-250px, -250px);
      }

      :host(.shine) .avatar::after {
        animation: shine 2s ease 1 forwards;
      }

      @keyframes shine {
        0% { transform: translate(-250px, -250px); }
        100% { transform: translate(200px, 200px); }
      }

      .avatar img {
        width: 300px;
        height: 300px;
      }

      h1 {
        font-family: Jost, sans-serif;
        text-transform: capitalize;
        font-size: 2rem;
        text-align: center;
        color: #fff;
      }
    `;
  }

  connectedCallback() {
    this.render();
    document.addEventListener("SELECTED_USER", (ev) => this.selectedUser(ev.detail));
  }

  setImage(image, text) {
    const avatar = this.shadowRoot.querySelector(".avatar");
    const src = getFilteredAvatar(image).replace("70x70", "300x300");
    avatar.innerHTML = /* html */`<img src="${src}" alt="${text}">`;
  }

  setText(text) {
    const h1 = this.shadowRoot.querySelector("h1");
    h1.textContent = text;
  }

  shine() {
    this.classList.add("shine");
  }

  selectedUser(userdata) {
    this.setImage(userdata.picture, userdata.name);
    this.setText(userdata.name);
    this.shine();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${UserData.styles}</style>
    <div class="container">
      <div class="avatar">
      </div>
      <h1></h1>
      <div class="userstats">
      </div>
    </div>`;
  }
}

customElements.define("user-data", UserData);
