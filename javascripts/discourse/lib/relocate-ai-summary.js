/**
 * Clones the discourse-ai summarize control from the topic map into the topic
 * title area. The clone proxies clicks back to the original Glimmer-rendered
 * button so that all Ember action bindings keep working.
 *
 * @param {Document} [rootDocument=document]
 * @param {{ keepOriginal?: boolean }} [options]
 *        keepOriginal — when false (default) the original section in the topic
 *        map is visually hidden; when true it stays visible.
 */
export function relocateSummarizeSection(
  rootDocument = document,
  { keepOriginal = false } = {}
) {
  const target = rootDocument.querySelector("#topic-title .title-wrapper");
  if (!target) {
    return;
  }

  const originalBtn = rootDocument.querySelector(
    ".topic-map .ai-summarization-button"
  );
  if (!originalBtn) {
    return;
  }

  const section = originalBtn.closest(
    "section.topic-map__additional-contents"
  );
  if (!section || !section.classList.contains("toggle-summary")) {
    return;
  }

  const alreadyCloned = target.querySelector(
    "section.topic-map__additional-contents.toggle-summary.ai-summary-in-topic-header"
  );
  if (alreadyCloned) {
    return;
  }

  target
    .querySelectorAll("section.topic-map__additional-contents.toggle-summary")
    .forEach((node) => node.remove());

  const clone = section.cloneNode(true);
  clone.classList.add("ai-summary-in-topic-header");

  const clonedBtn = clone.querySelector(".ai-summarization-button");
  if (clonedBtn) {
    clonedBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      originalBtn.click();
    });
  }

  if (!keepOriginal) {
    section.classList.add("ai-summary-original-hidden");
  }

  const h1 = target.querySelector("h1");
  if (h1?.nextSibling) {
    target.insertBefore(clone, h1.nextSibling);
  } else {
    target.appendChild(clone);
  }
}
