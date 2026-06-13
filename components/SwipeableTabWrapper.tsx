import { Href, useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import { PanResponder, Platform, StyleSheet, View } from "react-native";

const TAB_ROUTES: Href[] = ["/", "/ranking", "/more"];

type SwipeableTabWrapperProps = {
  tabIndex: 0 | 1 | 2;
  children: React.ReactNode;
};

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
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.4 &&
          Math.abs(gestureState.dx) > 18,
        onPanResponderRelease: (_, gestureState) => {
          const index = tabIndexRef.current;
          const swipedLeft =
            gestureState.dx < -50 || gestureState.vx < -0.45;
          const swipedRight =
            gestureState.dx > 50 || gestureState.vx > 0.45;

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
