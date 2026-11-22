export type TabEnterFrom = "left" | "right" | null;

/** One-shot signal so the destination tab can enter from the swipe direction. */
let pendingEnterFrom: TabEnterFrom = null;

export function armTabEnterFrom(from: Exclude<TabEnterFrom, null>) {
  pendingEnterFrom = from;
}

export function takeTabEnterFrom(): TabEnterFrom {
  const value = pendingEnterFrom;
  pendingEnterFrom = null;
  return value;
}
