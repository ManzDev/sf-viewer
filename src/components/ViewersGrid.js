import "@/components/UserGrid.js";
import "@/components/UserData.js";
import { getViewers } from "@/modules/getViewers.js";
import { playSound } from "@/modules/playSound.js";

const USERS_PER_ROW = 10;

class ViewersGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.selected = 0;
  }

  static get styles() {
    return /* css */ `
      :host {
        --user-size: 70px;    /* 70, 150, 300 */
        --users-per-row: ${USERS_PER_ROW};
      }

      .grid-container {
        display: flex;
        gap: 25px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(var(--users-per-row), var(--user-size));
      }
    `;
  }

  async connectedCallback() {
    this.users = await getViewers();
    this.render();
    addEventListener("keydown", (ev) => this.pressKey(ev.key));
  }

  pressKey(key) {
    const isLeft = key === "ArrowLeft";
    const isRight = key === "ArrowRight";
    const isUp = key === "ArrowUp";
    const isDown = key === "ArrowDown";
    const isEnter = key === "Enter";
    const isAllowedKeys = isLeft || isRight || isUp || isDown;

    if (isEnter) {
      playSound("select");
      return;
    }

    if (isLeft) {
      this.selected = Math.max(0, this.selected - 1);
    } else if (isRight) {
      this.selected = Math.min(this.users.length - 1, this.selected + 1);
    } else if (isUp) {
      this.selected = this.selected >= USERS_PER_ROW ? this.selected - USERS_PER_ROW : this.users.length - (this.users.length % USERS_PER_ROW) + this.selected;
    } else if (isDown) {
      this.selected = this.selected < this.users.length - USERS_PER_ROW ? this.selected + USERS_PER_ROW : this.selected % USERS_PER_ROW;
    }

    if (!isAllowedKeys) {
      return;
    }

    const users = [...this.shadowRoot.querySelectorAll(".grid user-grid")];

    users.forEach(user => user.classList.remove("active"));
    const selectedUser = users[this.selected];
    selectedUser.classList.add("active");

    const event = new CustomEvent("SELECTED_USER", {
      detail: { ...selectedUser.userdata },
      composed: true,
      bubbles: true
    });
    this.dispatchEvent(event);

    playSound("beep");
  }

  fillUsers() {
    return this.users
      .map((username, index) => /* html */ `<user-grid class="${index === 0 ? "active" : ""}" username="${username}"></user-grid>`)
      .join("");
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${ViewersGrid.styles}</style>
    <div class="grid-container">
      <div class="grid">
        ${this.fillUsers()}
      </div>
      <user-data></user-data>
    </div>`;
  }
}

customElements.define("viewers-grid", ViewersGrid);
