# AI Summary In Topic Header

Discourse **theme component**: adds a **discourse-ai** topic summarize button for **summarizable** topics to the **topic sidebar** (timeline controls or Table of Contents) on desktop, and to the **topic title area** on mobile and narrow screens, according to the settings below.

![Screen recording: AI summarize button in topic sidebar and title area](./images/README/dasih.gif)

## Requirements

- [discourse-ai](https://github.com/discourse/discourse-ai) with topic summarization enabled for your users.
- The button appears only when the topic is summarizable for the viewer (same rules as the default discourse-ai summarize control).

## Compatibility

- **[DiscoTOC](https://github.com/discourse/DiscoTOC)** — when active, the button appears in the ToC instead of the timeline (no duplicates).
- **[Reader Mode](https://github.com/discourse/reader-mode)** — optional `Keep in reader mode` setting keeps the button visible.

## Install

1. Admin → **Customize** → **Themes** → install this component (Git URL or upload).
2. Enable the component on your active theme(s).

## Settings

| Setting                 | Default | Description                                                                                                                                 |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Show in timeline**    | On      | **On:** show the button in the sidebar (timeline or ToC). On narrow desktop where the sidebar is not in the DOM, fall back to the topic title area. **Off:** no button on non-mobile layouts (including narrow desktop). |
| **Show on mobile**      | On      | **On:** show the button in the topic title area on mobile. **Off:** no button on mobile.                                                  |
| **Keep in reader mode** | Off     | Keep the button visible when [Reader Mode](https://github.com/discourse/reader-mode) is active.                                             |

## How it works

The component creates its own DOM button and opens the discourse-ai summary modal through the Discourse **modal** service. It does **not** clone or move the original summarize control from the topic map, which avoids broken Glimmer component handlers.

Placement adapts to the layout (when the relevant setting above is **On**):

1. **Desktop (wide)** — sidebar is visible → button in **ToC** (if [DiscoTOC](https://github.com/discourse/DiscoTOC) is present) or **timeline controls**.
2. **Desktop (narrow)** — sidebar hidden by Discourse → button in the **topic title area** (below the title and category/tags).
3. **Mobile** — button in the **topic title area**.

When the browser window is resized, buttons from the previous placement are removed and a new one is inserted where the layout requires, so you do not get duplicates.

## License

MIT — see [LICENSE.txt](LICENSE.txt).
