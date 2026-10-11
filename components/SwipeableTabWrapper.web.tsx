import React from "react";

type SwipeableTabWrapperProps = {
  tabIndex: 0 | 1 | 2;
  children: React.ReactNode;
};

/** Web: no swipe between tabs — avoid PanResponder work. */
export default function SwipeableTabWrapper({
  children,
}: SwipeableTabWrapperProps) {
  return <>{children}</>;
}
