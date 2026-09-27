import { Href, useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import { PanResponder, Platform, StyleSheet, View } from "react-native";

const TAB_ROUTES: Href[] = ["/", "/ranking", "/more"];

type SwipeableTabWrapperProps = {
  tabIndex: 0 | 1 | 2;
  children: React.ReactNode;
};

/**
 * Edge-biased horizontal swipe between tabs. Stricter thresholds so vertical
 * scrolling in forms (especially Rankings) does not get stolen.
 */
export default function SwipeableTabWrapper({
  tabIndex,
  children,
}: SwipeableTabWrapperProps) {
  const router = useRouter();
  const tabIndexRef = useRef(tabIndex);
  tabIndexRef.current = tabIndex;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          // Require a clear horizontal intent and enough travel.
          return (
            Math.abs(dx) > 40 &&
            Math.abs(dx) > Math.abs(dy) * 2.4 &&
            Math.abs(dy) < 28
          );
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderRelease: (_, gestureState) => {
          const index = tabIndexRef.current;
          const swipedLeft =
            gestureState.dx < -72 || gestureState.vx < -0.65;
          const swipedRight =
            gestureState.dx > 72 || gestureState.vx > 0.65;

          if (swipedLeft && index < TAB_ROUTES.length - 1) {
            router.navigate(TAB_ROUTES[index + 1]);
          } else if (swipedRight && index > 0) {
            router.navigate(TAB_ROUTES[index - 1]);
          }
        },
      }),
    [router]
  );

  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
