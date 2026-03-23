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
  let mainObserver;
  let bodyObserver;

  if (settings.keep_in_reader_mode) {
    document.documentElement.classList.add("ai-summary-keep-in-reader-mode");
  }

  const run = debounce(() => {
    if (!settings.show_in_timeline) {
      return;
    }
    schedule("afterRender", () => cloneButtonToTimeline());
  }, 120);

  function attachMainObserver() {
    if (mainObserver) {
      mainObserver.disconnect();
      mainObserver = null;
    }

    const root = document.querySelector("#main-outlet");
    if (!root) {
      return;
    }

    mainObserver = new MutationObserver(run);
    mainObserver.observe(root, { childList: true, subtree: true });
  }

  function attachBodyObserver() {
    if (bodyObserver) {
      return;
    }

    bodyObserver = new MutationObserver(() => {
      run();
      attachMainObserver();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: false });
  }

  api.onPageChange(() => {
    run();
    attachMainObserver();
  });

  schedule("afterRender", () => {
    run();
    attachMainObserver();
    attachBodyObserver();
  });
});
