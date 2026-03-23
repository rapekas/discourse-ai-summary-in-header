import { module, test } from "qunit";
import {
  addButtonToTimeline,
  addButtonToTitle,
  addButtonToToc,
} from "discourse/theme/lib/relocate-ai-summary";

function buildDoc() {
  const doc = document.implementation.createHTMLDocument("topic");

  const timelineControls = doc.createElement("div");
  timelineControls.className = "timeline-controls";

  const readerBtn = doc.createElement("button");
  readerBtn.className = "btn reader-mode-toggle";
  timelineControls.appendChild(readerBtn);

  const adminBtn = doc.createElement("button");
  adminBtn.className = "btn toggle-admin-menu";
  timelineControls.appendChild(adminBtn);

  doc.body.appendChild(timelineControls);

  const tocMain = doc.createElement("div");
  tocMain.className = "d-toc-main";

  const tocInner = doc.createElement("div");
  tocInner.id = "d-toc";
  tocMain.appendChild(tocInner);

  const tocFooter = doc.createElement("div");
  tocFooter.className = "d-toc-footer-icons";
  tocMain.appendChild(tocFooter);

  doc.body.appendChild(tocMain);

  const topicTitle = doc.createElement("div");
  topicTitle.id = "topic-title";
  const titleWrapper = doc.createElement("div");
  titleWrapper.className = "title-wrapper";
  const h1 = doc.createElement("h1");
  h1.textContent = "Test Topic";
  titleWrapper.appendChild(h1);
  topicTitle.appendChild(titleWrapper);
  doc.body.appendChild(topicTitle);

  return { doc, timelineControls, tocMain, titleWrapper };
}

function buildContainer({ summarizable = true } = {}) {
  return {
    lookup(name) {
      if (name === "controller:topic") {
        return {
          model: {
            summarizable,
            postStream: {},
          },
        };
      }
      if (name === "service:modal") {
        return { show() {} };
      }
      return null;
    },
  };
}

module(
  "AI Summary In Topic Header | addButtonToTimeline",
  function () {
    test("creates button in timeline-controls", function (assert) {
      const { doc, timelineControls } = buildDoc();
      const container = buildContainer();

      addButtonToTimeline({ container, rootDocument: doc });

      const btn = timelineControls.querySelector(".ai-summary-timeline-btn");
      assert.ok(btn, "button created in timeline");
      assert.strictEqual(
        timelineControls.lastElementChild,
        btn,
        "appended after existing buttons"
      );
    });

    test("idempotent — does not insert a second button", function (assert) {
      const { doc, timelineControls } = buildDoc();
      const container = buildContainer();

      addButtonToTimeline({ container, rootDocument: doc });
      addButtonToTimeline({ container, rootDocument: doc });

      assert.strictEqual(
        timelineControls.querySelectorAll(".ai-summary-timeline-btn").length,
        1,
        "only one button in timeline"
      );
    });

    test("no-op when timeline-controls is missing", function (assert) {
      const { doc } = buildDoc();
      doc.querySelector(".timeline-controls").remove();
      const container = buildContainer();

      addButtonToTimeline({ container, rootDocument: doc });

      assert.ok(true, "no error thrown");
    });

    test("no-op when topic is not summarizable", function (assert) {
      const { doc, timelineControls } = buildDoc();
      const container = buildContainer({ summarizable: false });

      addButtonToTimeline({ container, rootDocument: doc });

      assert.strictEqual(
        timelineControls.querySelectorAll(".ai-summary-timeline-btn").length,
        0,
        "no button when not summarizable"
      );
    });
  }
);

module(
  "AI Summary In Topic Header | addButtonToToc",
  function () {
    test("creates button at the top of ToC", function (assert) {
      const { doc, tocMain } = buildDoc();
      const container = buildContainer();

      addButtonToToc({ container, rootDocument: doc });

      const buttons = tocMain.querySelectorAll(".ai-summary-toc-btn");
      assert.strictEqual(buttons.length, 1, "one button in ToC");
      assert.ok(
        tocMain.firstElementChild.classList.contains("ai-summary-toc-btn"),
        "button is first child"
      );
    });

    test("idempotent — does not insert a second button", function (assert) {
      const { doc, tocMain } = buildDoc();
      const container = buildContainer();

      addButtonToToc({ container, rootDocument: doc });
      addButtonToToc({ container, rootDocument: doc });

      assert.strictEqual(
        tocMain.querySelectorAll(".ai-summary-toc-btn").length,
        1,
        "still only one button"
      );
    });

    test("no-op when .d-toc-main is missing", function (assert) {
      const { doc } = buildDoc();
      doc.querySelector(".d-toc-main").remove();
      const container = buildContainer();

      addButtonToToc({ container, rootDocument: doc });

      assert.ok(true, "no error thrown");
    });

    test("no-op when topic is not summarizable", function (assert) {
      const { doc, tocMain } = buildDoc();
      const container = buildContainer({ summarizable: false });

      addButtonToToc({ container, rootDocument: doc });

      assert.strictEqual(
        tocMain.querySelectorAll(".ai-summary-toc-btn").length,
        0,
        "no button when not summarizable"
      );
    });
  }
);

module(
  "AI Summary In Topic Header | addButtonToTitle",
  function () {
    test("creates button in title-wrapper", function (assert) {
      const { doc, titleWrapper } = buildDoc();
      const container = buildContainer();

      addButtonToTitle({ container, rootDocument: doc });

      const btn = titleWrapper.querySelector(".ai-summary-title-btn");
      assert.ok(btn, "button created in title-wrapper");
      assert.strictEqual(
        titleWrapper.lastElementChild,
        btn,
        "appended after existing children"
      );
    });

    test("idempotent — does not insert a second button", function (assert) {
      const { doc, titleWrapper } = buildDoc();
      const container = buildContainer();

      addButtonToTitle({ container, rootDocument: doc });
      addButtonToTitle({ container, rootDocument: doc });

      assert.strictEqual(
        titleWrapper.querySelectorAll(".ai-summary-title-btn").length,
        1,
        "only one button in title-wrapper"
      );
    });

    test("no-op when #topic-title is missing", function (assert) {
      const { doc } = buildDoc();
      doc.querySelector("#topic-title").remove();
      const container = buildContainer();

      addButtonToTitle({ container, rootDocument: doc });

      assert.ok(true, "no error thrown");
    });

    test("no-op when topic is not summarizable", function (assert) {
      const { doc, titleWrapper } = buildDoc();
      const container = buildContainer({ summarizable: false });

      addButtonToTitle({ container, rootDocument: doc });

      assert.strictEqual(
        titleWrapper.querySelectorAll(".ai-summary-title-btn").length,
        0,
        "no button when not summarizable"
      );
    });
  }
);
