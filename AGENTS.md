# Context for AI / future sessions

- **Repo:** `discourse-ai-summary-in-header` — Discourse **theme component** that moves the discourse-ai summarize control from the topic map into `#topic-title .title-wrapper` (next to `h1`). Does not fork discourse-ai.
- **JS:** `javascripts/discourse/lib/relocate-ai-summary.js` (`relocateSummarizeSection`), `javascripts/discourse/initializers/move-ai-summary-to-header.js` (debounced `MutationObserver` on `#main-outlet`, `api.onPageChange`).
- **SCSS:** `common/common.scss` — flex row for title + button; use **`@use "lib/viewport"`** and **`@include viewport.until(md)` / `viewport.until(sm)`**, not `@include breakpoint(...)`. **`@discourse/lint-configs`** enables **`discourse/no-breakpoint-mixin`** (Stylelint exit 2 on CI if `breakpoint()` is used).
- **Tests:** QUnit `test/javascripts/unit/relocate-ai-summary-test.js`; system `spec/system/topic_page_spec.rb` (checks `#topic-title .title-wrapper h1`).
- **Core features system spec:** `spec/system/core_features_spec.rb` follows **Horizon** pattern: `skip_examples: [:"search:quick_search", :"topics:create"]` and a separate **«creates a new topic»** via **`/new-topic`**. Ruby requires **quoted symbols** when the name contains a colon: `:"topics:create"` (not `:topics:create`).
- **Settings:** `settings.yml` defines `keep_original_button` (bool, default `false`). When enabled, the initializer skips relocation and the button stays in the topic map. Accessed in JS as `settings.keep_original_button` (global, no import needed).
- **Locales:** `locales/en.yml` and `locales/ru.yml` — setting descriptions under `theme_metadata.settings`. Theme description under `theme_metadata.description`.
- **CI:** `.github/workflows/discourse-theme.yml` reuses `discourse/.github` workflow; lint job uses `discourse/discourse_test:slim`, system tests use `slim-browsers`.
- **Cursor:** `.cursor/rules/commit-message-after-changes.mdc` — after edits in this repo, suggest a **Commit message** in chat (Conventional Commits when appropriate).
