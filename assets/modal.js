import tag from "https://deno.land/x/tag@v0.2.0/mod.js";

function renderModal() {
  const { body, isOpen } = $.read();

  if (!isOpen) return "";

  const modalClose = `
    <button class="close">
      Close
    </button>
  `;

  return `
    <div class="modal">
      ${modalClose}
      ${body}
    </div>
  `;
}

const $ = tag("ctx-modal", {
  label: null,
  children: null,
  isOpen: null
});

export default $;

export function showModal(body) {
  document.body.classList.add("overlay");
  const context = `<ctx-modal></ctx-modal>`;
  document.body.insertAdjacentHTML("beforeend", context);
  $.write({
    body,
    isOpen: true
  });
}

export function hideModal() {
  document.body.classList.remove("overlay");
  document.querySelector('ctx-modal').remove()
  $.write({
    isOpen: false
  });
}

$.on("click", ".close", hideModal);

$.render(renderModal);

$.style(`
  body.overlay {
    overflow: hidden;
  }

  body.overlay:before {
    animation: fadein 250ms ease-in-out forwards;
    content: '';
    background: var(--bg);
    position: fixed;
    opacity: .66;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    filter: blur(10vh);
    z-index: 2;
  }

  @keyframes fadein {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  & {
    position: fixed;
    display: none;
    place-items: center;
    padding: 1rem;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    z-index: 2;
  }

  body.overlay & {
    display: grid;
  }

  & .modal {
    animation: modal-in 250ms ease-in-out forwards;
    background: var(--bg);
    color: var(--fg);
    border-radius: var(--space-4);
    box-sizing: border-box;
    position: relative;
    padding: var(--space-9) var(--space-9) var(--space-9) var(--space-8);
    max-width: 640px;
    width: 100%;
    z-index: -1;
    opacity: 0;
  }

  @keyframes modal-in {
    0% {
      opacity: 0;
      z-index: -1;
    }

    100% {
      opacity: 1;
      z-index: 3;
    }
  }

  & .close {
    background: none;
    border: none;
    padding: none;
    opacity: .8;
    transition: opacity: 200ms;
    position: absolute;
    top: var(--space-6);
    right: var(--space-6);
  }

  & .close:hover,
  & .close:focus {
    cursor: pointer;
    opacity: 1;
  }

  & .close * {
    pointer-events: none;
  }
`);

