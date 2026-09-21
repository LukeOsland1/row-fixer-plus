import { addStyle } from "../utils/addStyle";
import { KeyHidePlayables } from "../../../data/storage-key";
import { removeElementById } from "../utils/removeElement";

export const optionHidePlayables = (hidePlayables) => {
  if (!hidePlayables) {
    removeElementById(KeyHidePlayables);
    return;
  }

  addStyle(
    KeyHidePlayables,
    `
    /* Hide whole shelves so their headings and empty space disappear too. */
    :is(ytd-rich-section-renderer, ytd-rich-shelf-renderer, ytd-shelf-renderer):has(
      :is([is-mini-game-card-shelf], mini-game-card-view-model, ytd-mini-game-card-view-model,
        a[href="/playables"], a[href^="/playables/"], a[href^="/playables?"])
    ),
    /* Standalone game cards, including those loaded after the initial page. */
    ytd-rich-item-renderer[is-mini-game-card-shelf],
    ytd-rich-item-renderer:has(:is(mini-game-card-view-model, ytd-mini-game-card-view-model)),
    mini-game-card-view-model,
    ytd-mini-game-card-view-model,
    /* Expanded and compact sidebar entries; independent of UI language. */
    :is(ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer):has(
      :is(a[href="/playables"], a[href^="/playables/"], a[href^="/playables?"])
    ) {
      display: none !important;
    }
  `
  );
};
