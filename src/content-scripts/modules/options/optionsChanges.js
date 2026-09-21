import {
  KeyChannelPageWideLayout,
  KeyDisplayFullTitle,
  KeyHideChannelProfile,
  KeyHideShort,
  KeyHidePlayables,
  KeyShelfItemPerRow,
  KeyVideoPerRow,
} from "../../../data/storage-key";
import { optionDisplayFullTitle } from "./displayFullTitle";
import { optionHideChannelProfile } from "./hideChannelProfile";
import { optionHideShort } from "./hideShort";
import { optionHidePlayables } from "./hidePlayables";
import { optionShortsPerRow } from "./shortsPerRow";
import { optionSkeletonPerRow } from "./skeletonPerRow";
import { optionWideChannelLayout } from "./wideChannleLayout";

export const injectAllChanges = (data) => {
  optionHideChannelProfile(data[KeyHideChannelProfile]);
  optionDisplayFullTitle(data[KeyDisplayFullTitle]);
  optionSkeletonPerRow(data[KeyVideoPerRow]);
  optionHideShort(data[KeyHideShort]);
  optionHidePlayables(data[KeyHidePlayables]);
  optionWideChannelLayout(data[KeyChannelPageWideLayout]);
  optionShortsPerRow(data[KeyShelfItemPerRow]);
};
