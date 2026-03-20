/* =============================================
   script.js – Lab 05(a): All behaviour lives here
   Separation of Concerns: BEHAVIOUR layer
   ============================================= */

const CLICK_LIMIT = 3;
let count = 0;

const btn    = document.getElementById("actionBtn");
const status = document.getElementById("status");

/* --- HOVER: replaces inline onmouseover / onmouseout --- */
btn.addEventListener("mouseover", function () {
  btn.classList.add("hovered");
});

btn.addEventListener("mouseout", function () {
  btn.classList.remove("hovered");
});

/* --- CLICK: replaces inline onclick + all inline style changes --- */
btn.addEventListener("click", performAction);

function performAction() {
  count++;

  /* FEEDBACK – yellow scale-down flash */
  btn.classList.add("click-feedback");
  setTimeout(function () {
    btn.classList.remove("click-feedback");
  }, 200);

  if (count >= CLICK_LIMIT) {
    /* CONSTRAINT + SIGNIFIER – disable and restyle */
    btn.disabled = true;
    btn.classList.add("constrained", "disabled-signifier");
    status.classList.add("limit-reached");
    status.innerHTML = "⛔ Limit reached (" + CLICK_LIMIT + " clicks max)";
  } else {
    /* Normal feedback */
    status.innerHTML =
      "✅ Processed " + count + " time" + (count > 1 ? "s" : "");
  }
}
