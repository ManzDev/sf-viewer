import { getFilteredAvatar, isCustomAvatar } from "@/modules/getFilteredAvatar.js";
import { getRandomColorClassName } from "@/modules/getRandomColorClassName.js";
import { getUserInfo } from "@/modules/getUserInfo.js";
import "@/components/LoadingBox.js";

class UserGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      :host {
        border: 1px solid #fff;
        background: black;
        display: flex;
        width: var(--user-size);
        height: var(--user-size);
        position: relative;
      }

      :host(.active)::before {
        content: "1P";
        font-family: EnterCommand;
        font-size: 2.5rem;
        color: white;
        position: absolute;
        top: -21px;
        left: 32%;
        text-shadow:
          0 0 8px black,
          0 0 4px black,
          0 0 2px black,
          0 0 1px black;
        z-index: 5;
      }

      :host(.active) {
        box-shadow: 0 0 0 5px gold;
        scale: 1.35;
        z-index: 5;
      }

      .blue { filter: hue-rotate(294deg); }
      .green { filter: hue-rotate(207deg); }
      .red { filter: hue-rotate(49deg); }
      .yellow { filter: hue-rotate(144deg); }

      .container {

      }

      .container img {
        width: 100%;
        height: 100%;
      }
    `;
  }

  getRandomColor(picture) {
    return !isCustomAvatar(picture) ? getRandomColorClassName() : "";
  }

  removeLoading() {
    const loadingBox = this.shadowRoot.querySelector("loading-box");
    loadingBox.remove();
  }

  async getUserData() {
    this.userdata = await getUserInfo(this.username);

    const container = this.shadowRoot.querySelector(".container");
    const filteredPicture = getFilteredAvatar(this.userdata.picture);
    const className = this.getRandomColor(this.userdata.picture);
    const html = /* html */`<img class="${className}" src="${filteredPicture}" alt="${this.username}" title="${this.username}" />`;
    this.removeLoading();
    container.insertAdjacentHTML("beforeend", html);
  }

  async connectedCallback() {
    this.username = this.getAttribute("username");
    console.log(this.userdata);
    this.render();

    const time = Math.floor(Math.random() * 4000);
    setTimeout(async () => {
      await this.getUserData();
    }, time);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${UserGrid.styles}</style>
    <div class="container">
      <loading-box></loading-box>
    </div>`;
  }
}

customElements.define("user-grid", UserGrid);
