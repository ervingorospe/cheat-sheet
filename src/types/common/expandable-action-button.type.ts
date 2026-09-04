import { IconAction } from "./icon-action";

export type ExpandableActionButtonProps = {
  actions: IconAction[];
  baseBottom?: number;
  bottomStep?: number;
  staggerMs?: number;
};
