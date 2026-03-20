# AI Summary in topic header

Discourse **theme component**: moves the **discourse-ai** topic summarize button from the topic map into the topic title area (`#topic-title`), next to the heading.

![dasih_horizon](./images/README/dasih_horizon.png)

## Requirements

- [discourse-ai](https://github.com/discourse/discourse-ai) with topic summarization enabled for your users.

## Install

1. Admin → **Customize** → **Themes** → install this component (Git URL or upload).
2. Enable the component on your active theme(s).

## Verification

On a site with **discourse-ai** summarization enabled:

1. Open a **summarizable** topic — the control should appear in the **title** row (after `h1`), not only inside the topic map.
2. **Navigate** to another topic and back (or hard refresh) — the button should still appear and open the summary modal.
3. **Expand/collapse** the topic map — the control should stay in the header (the theme re-runs the move when the map re-renders).
4. **Narrow / mobile** viewport — title and button should wrap; on small widths the button uses full width (see `common/common.scss`).

If you see Ember/Glimmer console errors or a disappearing button after a Discourse upgrade, use the **fallback**: move the `discourse-ai` connector from `topic-map-expanded-after` to a title-related outlet (see discourse-ai source) instead of DOM relocation.

## License

MIT — see [LICENSE.txt](LICENSE.txt).
