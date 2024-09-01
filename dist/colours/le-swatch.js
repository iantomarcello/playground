// @ts-ignore
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class leSwatch extends LitElement {
  static styles = css`
    :host {
      --cell_size: 56px;
      display: block;
    }

    button {
      background-color: transparent;
      border: 0;
      cursor: pointer;
    }

    .swatch {
      anchor-name: --actions-anchor;
      width: var(--cell_size);
      height: var(--cell_size);
      border-radius: 8px;
      outline: 3px solid cornsilk;
      box-shadow: 0 0 8px rgb(204, 204, 204);
      position: relative;
    }

    .swatch-colour {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
    }

    .swatch-actions {
      position: fixed;
      position-anchor: --actions-anchor;
      top: calc(anchor(center));
      justify-self: anchor-center;
      margin: 0;
      padding: 0;
      z-index: 0;
      border: 0;
      overflow: visible;
    }

    .swatch-action-button {
      --radius: 80px;
      --degree: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(var(--cell_size) * 0.7);
      aspect-ratio: 1;
      padding: 0;
      border-radius: 50%;
      position: absolute;
      z-index: -1;
      translate: -50% -50%;
      left: calc(var(--radius) * sin(pi / 180 * var(--degree)));
      top: calc(var(--radius) * cos(pi / 180 * var(--degree)));
      transition-property: var(--radius), opacity, scale;
      transition-duration: 0.3s;
      transition-behavior: allow-discrete;
      box-shadow: 0 0 3px 0.5px rgb(255 255 255);

      @starting-style {
        .swatch-actions:popover-open & {
          --radius: 0px;
          opacity: 0;
          scale: 0.3;
        }
      }

      svg {
        width: 55%;
        height: auto;
      }

      &:nth-child(1) {
        --degree: -45;
        transition-delay: 0s;
      }
      &:nth-child(2) {
        --degree: 0;
        transition-delay: 0.05s;
      }
      &:nth-child(3) {
        --degree: 45;
        transition-delay: 0.1s;
      }

      input[type="color"] {
        width: 100%;
        height: 100%;
        opacity: 1;
        position: absolute;
        inset: 0;
        background-color: transparent;
        border-radius: 50%;
        border: none;

        &::-webkit-color-swatch {
          opacity: 0;
        }
      }
    }
  `;

  static properties = {
    colour: { type: String, attribute: true },
  };

  constructor() {
    super();
    this.colour = "transparent";
  }

  async copyColour() {
    await navigator.clipboard.writeText(this.colour);
    alert("Copied " + this.colour);
  }

  updated(changes) {
    if (changes.has("colour")) {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { colour: this.colour },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <div class="swatch" style="background-color: ${this.colour};">
        <button
          class="swatch-colour"
          title="open actions"
          popovertarget="actions"
        ></button>
        <div id="actions" class="swatch-actions" popover>
          <div
            class="swatch-action-button"
            title="Edit"
            style="background-color: hsl(from ${this.colour} h calc(s + 10) l);"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
            <input
              type="color"
              @input="${(event) => (this.colour = event.currentTarget.value)}"
            />
          </div>
          <button
            class="swatch-action-button"
            title="Copy"
            @click="${this.copyColour}"
            style="background-color: hsl(from ${this
              .colour} calc(h + 10) s calc(l + 10));"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </svg>
          </button>
          <button
            class="swatch-action-button"
            title="Clear"
            @click="${(event) => (this.colour = "transparent")}"
            style="background-color: hsl(from ${this
              .colour} h calc(s * 0.2) 55%);"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"
              />
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}
customElements.define("le-swatch", leSwatch);
