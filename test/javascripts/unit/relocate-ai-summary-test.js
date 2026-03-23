import { module, test } from "qunit";
import {
  relocateSummarizeSection,
  cloneButtonToTimeline,
} from "discourse/theme/lib/relocate-ai-summary";

function buildTopicPageDoc() {
  const doc = document.implementation.createHTMLDocument("topic");

  const topicTitle = doc.createElement("div");
  topicTitle.id = "topic-title";

  const titleWrapper = doc.createElement("div");
  titleWrapper.className = "title-wrapper";

  const h1 = doc.createElement("h1");
  h1.textContent = "Topic title";

  const category = doc.createElement("div");
  category.className = "topic-category";

  titleWrapper.appendChild(h1);
  titleWrapper.appendChild(category);
  topicTitle.appendChild(titleWrapper);
  doc.body.appendChild(topicTitle);

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
  doc.body.appendChild(timelineControls);

  return { doc, titleWrapper, h1, section, button, topicMap, timelineControls };
}

module(
  "AI Summary In Topic Header | relocateSummarizeSection",
  function () {
    test("clones section into title wrapper and hides original by default", function (assert) {
      const { doc, titleWrapper, h1, section, topicMap } = buildTopicPageDoc();

      relocateSummarizeSection(doc);

      assert.ok(
        topicMap.contains(section),
        "original section stays in topic map"
      );
      assert.ok(
        section.classList.contains("ai-summary-original-hidden"),
        "original is marked hidden"
      );

      const clone = titleWrapper.querySelector(
        "section.ai-summary-in-topic-header"
      );
      assert.ok(clone, "clone is in title wrapper");
      assert.notStrictEqual(clone, section, "clone is not the original node");
      assert.strictEqual(
        clone.previousElementSibling,
        h1,
        "clone is placed after h1"
      );
    });

    test("keeps original visible when keepOriginal is true", function (assert) {
      const { doc, titleWrapper, section, topicMap } = buildTopicPageDoc();

      relocateSummarizeSection(doc, { keepOriginal: true });

      assert.ok(topicMap.contains(section), "original stays in topic map");
      assert.notOk(
        section.classList.contains("ai-summary-original-hidden"),
        "original is not hidden"
      );

      const clone = titleWrapper.querySelector(
        "section.ai-summary-in-topic-header"
      );
      assert.ok(clone, "clone is in title wrapper");
    });

    test("cloned button proxies click to the original button", function (assert) {
      const { doc, button } = buildTopicPageDoc();
      let clicked = false;
      button.addEventListener("click", () => {
        clicked = true;
      });

      relocateSummarizeSection(doc);

      const clonedBtn = doc.querySelector(
        "#topic-title .ai-summarization-button"
      );
      assert.ok(clonedBtn, "cloned button exists in header");

      clonedBtn.click();
      assert.ok(clicked, "click on clone triggered original button");
    });

    test("no-op when there is no summarize button in the topic map", function (assert) {
      const { doc, titleWrapper } = buildTopicPageDoc();
      doc.querySelector(".ai-summarization-button").remove();

      relocateSummarizeSection(doc);

      assert.strictEqual(
        titleWrapper.querySelectorAll("section.topic-map__additional-contents")
          .length,
        0
      );
    });

    test("no-op when #topic-title .title-wrapper is missing", function (assert) {
      const { doc, section } = buildTopicPageDoc();
      doc.getElementById("topic-title").remove();

      relocateSummarizeSection(doc);

      assert.ok(doc.querySelector(".topic-map").contains(section));
    });

    test("idempotent — does not insert a second clone", function (assert) {
      const { doc, titleWrapper } = buildTopicPageDoc();

      relocateSummarizeSection(doc);
      const childrenAfterFirst = [...titleWrapper.children];

      relocateSummarizeSection(doc);

      assert.deepEqual(
        [...titleWrapper.children],
        childrenAfterFirst,
        "no duplicate clone inserted"
      );
    });
  }
);

module(
  "AI Summary In Topic Header | cloneButtonToTimeline",
  function () {
    test("clones button into timeline-controls before existing buttons", function (assert) {
      const { doc, timelineControls } = buildTopicPageDoc();

      cloneButtonToTimeline(doc);

      const btn = timelineControls.querySelector(".ai-summarization-button");
      assert.ok(btn, "button cloned into timeline");
      assert.ok(
        btn.classList.contains("ai-summary-timeline-btn"),
        "marker class applied"
      );
      assert.strictEqual(
        timelineControls.firstChild,
        btn,
        "inserted before existing buttons"
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
