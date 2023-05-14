import { getViewers } from "@/modules/getViewers.js";
import { getFilteredAvatar, isCustomAvatar } from "@/modules/getFilteredAvatar.js";

const SOUNDS = {
  beep: new Audio("sounds/beep.ogg"),
  select: new Audio("sounds/select.ogg")
};

const playSound = (sound = "beep") => {
  SOUNDS[sound].currentTime = 0;
  SOUNDS[sound].play();
};

const getRandomColorClassName = () => {
  const COLORS = ["red", "yellow", "green", "blue"];

  const n = ~~(Math.random() * COLORS.length);
  return COLORS[n];
};

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
        --users-per-row: 10;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(var(--users-per-row), var(--user-size));
        grid-template-rows: repeat(2, var(--user-size));
      }

      .user {
        box-sizing: border-box;
        border: 1px solid #fff;
        background: black;
        display: flex;
        width: var(--user-size);
        height: var(--user-size);
        position: relative;
      }

      .user.active::before {
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

      .user.active {
        border: 5px solid gold;
      }

      .user .blue { filter: hue-rotate(294deg); }
      .user .green { filter: hue-rotate(207deg); }
      .user .red { filter: hue-rotate(49deg); }
      .user .yellow { filter: hue-rotate(144deg); }
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
    const isEnter = key === "Enter";
    const isAllowedKeys = isLeft || isRight;

    if (isEnter) {
      playSound("select");
      return;
    }

    if (isLeft) {
      this.selected = Math.max(0, this.selected - 1);
    } else if (isRight) {
      this.selected = Math.min(this.users.length, this.selected + 1);
    }

    if (!isAllowedKeys) {
      return;
    }

    const users = [...this.shadowRoot.querySelectorAll(".grid .user")];

    users.forEach(user => user.classList.remove("active"));
    users[this.selected].classList.add("active");

    playSound("beep");
    console.log(this.selected);
  }

  getRandomColor(picture) {
    return !isCustomAvatar(picture) ? getRandomColorClassName() : "";
  }

  fillUsers() {
    return this.users
      .map((person, index) => /* html */ `<div class="user ${index === 0 ? "active" : ""}">
        <img class="${this.getRandomColor(person.picture)}"
              src="${getFilteredAvatar(person.picture)}"
              alt="${person.username}"
              title="${person.username}">
      </div>`)
      .join("");
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${ViewersGrid.styles}</style>
    <div class="grid">
      ${this.fillUsers()}
    </div>`;
  }
}

customElements.define("viewers-grid", ViewersGrid);
