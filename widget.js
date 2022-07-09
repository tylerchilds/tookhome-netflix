import tag from "https://deno.land/x/tag@v0.2.0/mod.js";
import { showModal } from "./assets/modal.js";
import "https://deno.land/x/tag@v0.2.0/src/tags/rainbow-button.js"

// In our widget we have rows we want to animate.
// To keep performance tight, we'll transform the row
// the length of the first child, remove it and restart
function animate({ target }) {
  // width of the first child
  const { offsetWidth } = target.firstElementChild;
  // calculate styles of the row for getting access to values
  const styles = getComputedStyle(target);

  // get the speed of the current row
  const speed = parseFloat(styles.getPropertyValue("--speed"));

  // account for the gap between items in the row
  const gap = parseFloat(styles.getPropertyValue("gap"));

  // calculate width
  const width = offsetWidth + gap;

  // calculate duration
  const duration = (width / speed) * 1000;

  // set how far we want to transform our row
  target.style.setProperty("--first-child-width", width + "px");

  // set how long our duration should last
  target.style.setProperty("--duration", duration + "ms");

  // go time
  target.classList.add("run");
}

// after the row has transitioned, we need to do some cleanup
function iterate(event) {
  // transition is over
  event.target.classList.remove("run");
  // move the first item to the end
  event.target.appendChild(event.target.firstElementChild);

  // restart the process
  animate(event);
}

// this is my helper library, for scoping components
// think react meets jQuery
// docs: https://tylerchilds.com/tag/examples
const $ = tag(".sliding-pills");

// delegate click events on the pill buttons in this scope
$.on("click", ".pill", (event) => {
  // open a modal with some content
  showModal(`
    <H2>
      Built on a game engine.
    </H2>
    <P>
      Were anyone to admire the demonstration, they should befriend:
    </P>
    <BR/>
    <BR/>
    <rainbow-button>
      <A href="https://tychi.me">The Author</A>
    </rainbow-button>
  `);
});

// delegate transition events for the rows
$.on("transitionstart", ".sliding-pills__row", animate);
$.on("transitionend", ".sliding-pills__row", iterate);

// scope some styles, the & is .sliding-pills in this scenario
$.style(`
  & {
    --speed: 30;
    transform: translateX(0);
  }

  &:nth-child(even) {
    --speed: 15;
  }

  & .sliding-pills__row.run {
    transition: transform linear var(--duration);
    transform: translateX(calc(-1 * var(--first-child-width)));
  }
`);

window.hackday = function() {
  showModal(`
    <iframe width="560" height="315" src="https://www.youtube.com/embed/e-91MO-CzrU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  `)
}

tag('[onclick="hackday()"]')
  .on('click', '', (event) => event.preventDefault())

// manually kick off the animate function for each row to start
const elems = document.querySelectorAll(".sliding-pills__row");
elems.forEach((target) => animate({ target }));
