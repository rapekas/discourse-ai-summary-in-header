import { apiInitializer } from "discourse/lib/api";
import { schedule } from "@ember/runloop";
import {
  addButtonToTimeline,
  addButtonToTitle,
  addButtonToToc,
} from "../lib/relocate-ai-summary";

function debounce(fn, waitMs) {
  let handle;
  return () => {
    clearTimeout(handle);
    handle = setTimeout(fn, waitMs);
  };
}

export default apiInitializer("2.0.0", (api) => {
  const container = api.container;
  let mainObserver;
  let bodyObserver;

  if (settings.keep_in_reader_mode) {
    document.documentElement.classList.add("ai-summary-keep-in-reader-mode");
  }

  const site = container.lookup("service:site");

  const run = debounce(() => {
    schedule("afterRender", () => {
      if (site.mobileView && settings.show_on_mobile) {
        addButtonToTitle({ container });
        return;
      }

      if (!settings.show_in_timeline) {
        return;
      }

      if (document.querySelector(".d-toc-main")) {
        addButtonToToc({ container });
      } else {
        addButtonToTimeline({ container });
      }
    });
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
