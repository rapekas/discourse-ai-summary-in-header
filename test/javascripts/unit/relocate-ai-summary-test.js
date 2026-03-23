import { module, test } from "qunit";
import { cloneButtonToTimeline } from "discourse/theme/lib/relocate-ai-summary";

function buildTopicPageDoc() {
  const doc = document.implementation.createHTMLDocument("topic");

  const topicMap = doc.createElement("div");
  topicMap.className = "topic-map";

  const section = doc.createElement("section");
  section.className = "topic-map__additional-contents toggle-summary";

  const button = doc.createElement("button");
  button.type = "button";
  button.className = "btn ai-summarization-button";
  button.textContent = "Summarize";

  section.appendChild(button);
  topicMap.appendChild(section);
  doc.body.appendChild(topicMap);

  const timelineControls = doc.createElement("div");
  timelineControls.className = "timeline-controls";

  const readerBtn = doc.createElement("button");
  readerBtn.className = "btn reader-mode-toggle";
  timelineControls.appendChild(readerBtn);

  const adminBtn = doc.createElement("button");
  adminBtn.className = "btn toggle-admin-menu";
  timelineControls.appendChild(adminBtn);

  doc.body.appendChild(timelineControls);

  return { doc, button, topicMap, timelineControls, readerBtn, adminBtn };
}

module(
  "AI Summary In Topic Header | cloneButtonToTimeline",
  function () {
    test("clones button into timeline-controls after existing buttons", function (assert) {
      const { doc, timelineControls, adminBtn } = buildTopicPageDoc();

      cloneButtonToTimeline(doc);

      const btn = timelineControls.querySelector(".ai-summarization-button");
      assert.ok(btn, "button cloned into timeline");
      assert.ok(
        btn.classList.contains("ai-summary-timeline-btn"),
        "marker class applied"
      );
      assert.strictEqual(
        adminBtn.nextElementSibling,
        btn,
        "appended after existing buttons"
      );
    });

    test("timeline button proxies click to original", function (assert) {
      const { doc, button } = buildTopicPageDoc();
      let clicked = false;
      button.addEventListener("click", () => {
        clicked = true;
      });

      cloneButtonToTimeline(doc);

      const timelineBtn = doc.querySelector(
        ".timeline-controls .ai-summarization-button"
      );
      timelineBtn.click();
      assert.ok(clicked, "click on timeline button triggered original");
    });

    test("idempotent — does not insert a second button", function (assert) {
      const { doc, timelineControls } = buildTopicPageDoc();

      cloneButtonToTimeline(doc);
      cloneButtonToTimeline(doc);

      assert.strictEqual(
        timelineControls.querySelectorAll(".ai-summarization-button").length,
        1,
        "only one button in timeline"
      );
    });

    test("no-op when timeline-controls is missing", function (assert) {
      const { doc } = buildTopicPageDoc();
      doc.querySelector(".timeline-controls").remove();

      cloneButtonToTimeline(doc);

      assert.ok(true, "no error thrown");
    });

    test("no-op when original button is missing", function (assert) {
      const { doc } = buildTopicPageDoc();
      doc.querySelector(".ai-summarization-button").remove();

      cloneButtonToTimeline(doc);

      assert.strictEqual(
        doc.querySelectorAll(".timeline-controls .ai-summarization-button")
          .length,
        0,
        "nothing cloned"
      );
    });
  }
);
