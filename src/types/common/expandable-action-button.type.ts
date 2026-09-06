import { IconAction } from "./icon-action.type";

export type ExpandableActionButtonProps = {
  actions: IconAction[];
  baseBottom?: number;
  bottomStep?: number;
  staggerMs?: number;
};
