import type { ComponentType } from "react";

type TabIndex = 0 | 1 | 2;

const screens: Array<ComponentType | null> = [null, null, null];

/** Register tab body so swipe can render the adjacent screen live. */
export function registerTabScreen(index: TabIndex, Comp: ComponentType) {
  screens[index] = Comp;
}

export function getTabScreen(index: number): ComponentType | null {
  if (index < 0 || index > 2) {
    return null;
  }
  return screens[index];
}
