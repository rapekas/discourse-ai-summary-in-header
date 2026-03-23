import { iconHTML } from "discourse-common/lib/icon-library";
import I18n from "discourse-i18n";

let modalModule = null;

async function loadAiSummaryModal() {
  if (!modalModule) {
    try {
      modalModule = await import(
        "discourse/plugins/discourse-ai/discourse/components/modal/ai-summary-modal"
      );
    } catch {
      // eslint-disable-next-line no-console
      console.warn(
        "discourse-ai plugin not available — AI summary button disabled"
      );
    }
  }
  return modalModule?.default;
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

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const AiSummaryModal = await loadAiSummaryModal();
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
export function addButtonsToToc({ container, rootDocument = document }) {
  const toc = rootDocument.querySelector(".d-toc-main");
  if (!toc) {
    return;
  }

  if (toc.querySelector(".ai-summary-toc-btn")) {
    return;
  }

  const topBtn = createSummaryButton(container, rootDocument, "ai-summary-toc-btn ai-summary-toc-top");
  const bottomBtn = createSummaryButton(container, rootDocument, "ai-summary-toc-btn ai-summary-toc-bottom");

  if (topBtn) {
    toc.insertBefore(topBtn, toc.firstChild);
  }
  if (bottomBtn) {
    toc.appendChild(bottomBtn);
  }
}
