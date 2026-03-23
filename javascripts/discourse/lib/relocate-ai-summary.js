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

/**
 * Creates an AI summarize button in `.timeline-controls`.
 * On click, opens AiSummaryModal directly via the modal service —
 * no dependency on topic map being in the DOM.
 *
 * @param {Object} options
 * @param {Object} options.container - Discourse app container (for service lookups)
 * @param {Document} [options.rootDocument=document]
 */
export function addButtonToTimeline({ container, rootDocument = document }) {
  const timeline = rootDocument.querySelector(".timeline-controls");
  if (!timeline) {
    return;
  }

  if (timeline.querySelector(".ai-summary-timeline-btn")) {
    return;
  }

  const topicController = container.lookup("controller:topic");
  if (!topicController?.model?.summarizable) {
    return;
  }

  const btn = rootDocument.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-icon-text btn-default ai-summary-timeline-btn";
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

  timeline.appendChild(btn);
}
