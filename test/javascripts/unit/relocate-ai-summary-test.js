import { module, test } from "qunit";
import { relocateSummarizeSection } from "discourse/theme/lib/relocate-ai-summary";

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

  return { doc, titleWrapper, h1, section, button, topicMap };
}

module(
  "discourse-ai-summary-in-header | relocateSummarizeSection",
  function () {
    test("moves summarize section from topic map after the h1", function (assert) {
      const { doc, titleWrapper, h1, section } = buildTopicPageDoc();

      relocateSummarizeSection(doc);

      assert.ok(
        titleWrapper.contains(section),
        "section is under .title-wrapper"
      );
      assert.strictEqual(
        section.previousElementSibling,
        h1,
        "section is inserted immediately after h1"
      );
      assert.ok(
        section.classList.contains("ai-summary-in-topic-header"),
        "marker class applied"
      );
      assert.notOk(
        doc.querySelector(".topic-map").contains(section),
        "section no longer under .topic-map"
      );
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

    test("replaces a previously moved section when a new one appears in the map", function (assert) {
      const { doc, titleWrapper, h1, section, topicMap } = buildTopicPageDoc();

      relocateSummarizeSection(doc);
      const first = section;

      const section2 = doc.createElement("section");
      section2.className = "topic-map__additional-contents toggle-summary";
      const btn2 = doc.createElement("button");
      btn2.className = "ai-summarization-button";
      section2.appendChild(btn2);
      topicMap.appendChild(section2);

      relocateSummarizeSection(doc);

      assert.notOk(titleWrapper.contains(first), "stale section removed");
      assert.ok(titleWrapper.contains(section2), "new section moved");
      assert.strictEqual(section2.previousElementSibling, h1);
    });

    test("clones section when keepOriginal is true", function (assert) {
      const { doc, titleWrapper, h1, section, topicMap } = buildTopicPageDoc();

      relocateSummarizeSection(doc, { keepOriginal: true });

      assert.ok(
        topicMap.contains(section),
        "original section stays in topic map"
      );

      const cloned = titleWrapper.querySelector(
        "section.topic-map__additional-contents.toggle-summary"
      );
      assert.ok(cloned, "cloned section is in title wrapper");
      assert.notStrictEqual(cloned, section, "cloned node is not the original");
      assert.strictEqual(cloned.previousElementSibling, h1, "placed after h1");
      assert.ok(
        cloned.classList.contains("ai-summary-in-topic-header"),
        "marker class applied to clone"
      );
    });

    test("idempotent when section is already in the title wrapper", function (assert) {
      const { doc, titleWrapper, section } = buildTopicPageDoc();

      relocateSummarizeSection(doc);
      const order = [...titleWrapper.children];

      relocateSummarizeSection(doc);

      assert.deepEqual([...titleWrapper.children], order);
    });
  }
);
