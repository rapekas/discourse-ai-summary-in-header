/**
 * Moves (or clones) the discourse-ai summarize control from the topic map
 * into the topic title area.
 *
 * @param {Document} [rootDocument=document]
 * @param {{ keepOriginal?: boolean }} [options]
 */
export function relocateSummarizeSection(
  rootDocument = document,
  { keepOriginal = false } = {}
) {
  const target = rootDocument.querySelector("#topic-title .title-wrapper");
  if (!target) {
    return;
  }

  const btnInMap = rootDocument.querySelector(
    ".topic-map .ai-summarization-button"
  );
  if (!btnInMap) {
    return;
  }

  const section = btnInMap.closest("section.topic-map__additional-contents");
  if (!section || !section.classList.contains("toggle-summary")) {
    return;
  }

  if (target.contains(section)) {
    return;
  }

  target
    .querySelectorAll("section.topic-map__additional-contents.toggle-summary")
    .forEach((node) => node.remove());

  const nodeToInsert = keepOriginal ? section.cloneNode(true) : section;
  nodeToInsert.classList.add("ai-summary-in-topic-header");

  const h1 = target.querySelector("h1");
  if (h1?.nextSibling) {
    target.insertBefore(nodeToInsert, h1.nextSibling);
  } else {
    target.appendChild(nodeToInsert);
  }
}
