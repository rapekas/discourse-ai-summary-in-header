/**
 * Clones the AI summarize button into `.timeline-controls`, appended after
 * the existing control buttons. Proxy-clicks the original Glimmer button
 * so that all Ember action bindings keep working.
 *
 * @param {Document} [rootDocument=document]
 */
export function cloneButtonToTimeline(rootDocument = document) {
  const timeline = rootDocument.querySelector(".timeline-controls");
  if (!timeline) {
    return;
  }

  if (timeline.querySelector(".ai-summarization-button")) {
    return;
  }

  const originalBtn = rootDocument.querySelector(
    ".topic-map .ai-summarization-button"
  );
  if (!originalBtn) {
    return;
  }

  const btn = originalBtn.cloneNode(true);
  btn.classList.add("ai-summary-timeline-btn");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    originalBtn.click();
  });

  timeline.appendChild(btn);
}
