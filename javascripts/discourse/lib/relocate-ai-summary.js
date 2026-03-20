/**
 * Moves the discourse-ai summarize control from the topic map into the topic
 * title area. Accepts an optional Document for unit tests.
 *
 * @param {Document} [rootDocument=document]
 */
export function relocateSummarizeSection(rootDocument = document) {
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

  section.classList.add("ai-summary-in-topic-header");

  const h1 = target.querySelector("h1");
  if (h1?.nextSibling) {
    target.insertBefore(section, h1.nextSibling);
  } else {
    target.appendChild(section);
  }
}
