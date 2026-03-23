import { iconHTML } from "discourse-common/lib/icon-library";
import I18n from "discourse-i18n";

let AiSummaryModalCached = null;

function loadAiSummaryModal() {
  if (AiSummaryModalCached) {
    return AiSummaryModalCached;
  }

  const moduleName =
    "discourse/plugins/discourse-ai/discourse/components/modal/ai-summary-modal";

  try {
    const m = requirejs(moduleName);
    AiSummaryModalCached = m?.default || m;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      "discourse-ai plugin not available — AI summary button disabled"
    );
  }
  return AiSummaryModalCached;
}

function createSummaryButton(container, rootDocument, extraClass) {
  const topicController = container.lookup("controller:topic");
  if (!topicController?.model?.summarizable) {
    return null;
  }

  const btn = rootDocument.createElement("button");
  btn.type = "button";
  btn.className = `btn btn-icon-text btn-default ai-summary-btn ${extraClass}`;
  btn.title = I18n.t("summary.buttons.generate");

  const icon = iconHTML("discourse-sparkles");
  const label = I18n.t("summary.buttons.generate");
  btn.innerHTML = `${icon} <span class="d-button-label">${label}</span>`;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const AiSummaryModal = loadAiSummaryModal();
    if (!AiSummaryModal) {
      return;
    }

    const modalService = container.lookup("service:modal");
    const topic = topicController.model;
    const postStream = topic.postStream;

    modalService.show(AiSummaryModal, {
      model: { topic, postStream },
    });
  });

  return btn;
}

/**
 * Creates an AI summarize button in `.timeline-controls`.
 */
export function addButtonToTimeline({ container, rootDocument = document }) {
  const timeline = rootDocument.querySelector(".timeline-controls");
  if (!timeline) {
    return;
  }

  if (timeline.querySelector(".ai-summary-timeline-btn")) {
    return;
  }

  const btn = createSummaryButton(container, rootDocument, "ai-summary-timeline-btn");
  if (btn) {
    timeline.appendChild(btn);
  }
}

/**
 * Creates AI summarize buttons at the top and bottom of the Table of Contents
 * (`.d-toc-main` from the discourse-table-of-contents theme component).
 */
export function addButtonToToc({ container, rootDocument = document }) {
  const toc = rootDocument.querySelector(".d-toc-main");
  if (!toc) {
    return;
  }

  if (toc.querySelector(".ai-summary-toc-btn")) {
    return;
  }

  const btn = createSummaryButton(container, rootDocument, "ai-summary-toc-btn");
  if (btn) {
    toc.insertBefore(btn, toc.firstChild);
  }
}
