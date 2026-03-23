import { apiInitializer } from "discourse/lib/api";
import { schedule } from "@ember/runloop";
import { cloneButtonToTimeline } from "../lib/relocate-ai-summary";

function debounce(fn, waitMs) {
  let handle;
  return () => {
    clearTimeout(handle);
    handle = setTimeout(fn, waitMs);
  };
}

export default apiInitializer("2.0.0", (api) => {
  let observer;

  if (settings.keep_in_reader_mode) {
    document.documentElement.classList.add("ai-summary-keep-in-reader-mode");
  }

  const run = debounce(() => {
    if (!settings.show_in_timeline) {
      return;
    }
    schedule("afterRender", () => cloneButtonToTimeline());
  }, 120);

  function attachObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    const root = document.querySelector("#main-outlet");
    if (!root) {
      return;
    }

    observer = new MutationObserver(run);
    observer.observe(root, { childList: true, subtree: true });
  }

  api.onPageChange(() => {
    run();
    attachObserver();
  });

  schedule("afterRender", () => {
    run();
    attachObserver();
  });
});
