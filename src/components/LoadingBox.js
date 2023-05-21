const COLORS = [
  "#ff8274",
  "#d53c6a",
  "#7c183c",
  "#460e2b",
  "#31051e"
];

class LoadingBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return /* css */`
      .container {
        --box-size: 16px;

        width: var(--user-size);
        height: var(--user-size);
        background: black;
        display: grid;
        grid-template-columns: repeat(3, var(--box-size));
        grid-template-rows: repeat(3, var(--box-size));
        place-content: center;
        gap: 5px;
      }

      .box {
        background: var(--color, white);
        animation: scale 0.5s ease-out infinite alternate var(--delay, 0s);
      }

      @keyframes scale {
        0% { scale: 1; }
        100% { scale: 0.2; }
      }
    `;
  }

  setRandomColor() {
    const n = Math.floor(Math.random() * COLORS.length);
    const colorName = COLORS[n];
    this.style.setProperty("--color", colorName);
  }

  setRandomDelay() {
    const boxes = [...this.shadowRoot.querySelectorAll(".box")];
    boxes.forEach(box => {
      const delay = Math.random() * 2;
      box.style.setProperty("--delay", `${delay}s`);
    });
  }

  connectedCallback() {
    this.setRandomColor();
    this.render();
    this.setRandomDelay();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${LoadingBox.styles}</style>
    <div class="container">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </div>`;
  }
}

customElements.define("loading-box", LoadingBox);
