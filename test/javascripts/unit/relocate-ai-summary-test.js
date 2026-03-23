import { module, test } from "qunit";
import {
  addButtonToTimeline,
  addButtonsToToc,
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

  return { doc, timelineControls, tocMain };
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
  "AI Summary In Topic Header | addButtonsToToc",
  function () {
    test("creates buttons at top and bottom of ToC", function (assert) {
      const { doc, tocMain } = buildDoc();
      const container = buildContainer();

      addButtonsToToc({ container, rootDocument: doc });

      const buttons = tocMain.querySelectorAll(".ai-summary-toc-btn");
      assert.strictEqual(buttons.length, 2, "two buttons in ToC");
      assert.ok(
        tocMain.firstElementChild.classList.contains("ai-summary-toc-top"),
        "top button is first child"
      );
      assert.ok(
        tocMain.lastElementChild.classList.contains("ai-summary-toc-bottom"),
        "bottom button is last child"
      );
    });

    test("idempotent — does not insert duplicate buttons", function (assert) {
      const { doc, tocMain } = buildDoc();
      const container = buildContainer();

      addButtonsToToc({ container, rootDocument: doc });
      addButtonsToToc({ container, rootDocument: doc });

      assert.strictEqual(
        tocMain.querySelectorAll(".ai-summary-toc-btn").length,
        2,
        "still only two buttons"
      );
    });

    test("no-op when .d-toc-main is missing", function (assert) {
      const { doc } = buildDoc();
      doc.querySelector(".d-toc-main").remove();
      const container = buildContainer();

      addButtonsToToc({ container, rootDocument: doc });

      assert.ok(true, "no error thrown");
    });

    test("no-op when topic is not summarizable", function (assert) {
      const { doc, tocMain } = buildDoc();
      const container = buildContainer({ summarizable: false });

      addButtonsToToc({ container, rootDocument: doc });

      assert.strictEqual(
        tocMain.querySelectorAll(".ai-summary-toc-btn").length,
        0,
        "no buttons when not summarizable"
      );
    });
  }
);
