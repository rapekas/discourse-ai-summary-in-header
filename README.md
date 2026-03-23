# AI Summary In Topic Header

Discourse **theme component**: adds a **discourse-ai** topic summarize button to the topic sidebar — either in the **timeline controls** or at the top of the **Table of Contents** ([DiscoTOC](https://github.com/discourse/DiscoTOC)), depending on which is present.

## Requirements

- [discourse-ai](https://github.com/discourse/discourse-ai) with topic summarization enabled for your users.

## Compatibility

- **[DiscoTOC](https://github.com/discourse/DiscoTOC)** — when active, the button appears in the ToC instead of the timeline (no duplicates).
- **[Reader Mode](https://github.com/discourse/reader-mode)** — optional `Keep in reader mode` setting keeps the button visible.

## Install

1. Admin → **Customize** → **Themes** → install this component (Git URL or upload).
2. Enable the component on your active theme(s).

## Settings

- **Show in timeline** — Show the summarize button in the sidebar (timeline or ToC). Enabled by default.
- **Keep in reader mode** — Keep the summarize button visible when Reader Mode is active. Disabled by default.

## License

MIT — see [LICENSE.txt](LICENSE.txt).
