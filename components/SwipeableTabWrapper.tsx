import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Platform,
  StyleSheet,
} from "react-native";

const TAB_ROUTES: Href[] = ["/", "/ranking", "/more"];
const COMMIT_MS = 180;
const SNAP_BACK_MS = 160;
const commitEasing = Easing.out(Easing.cubic);

type SwipeableTabWrapperProps = {
  tabIndex: 0 | 1 | 2;
  children: React.ReactNode;
};

/**
 * Horizontal swipe between tabs with follow-finger slide, then a short
 * directional exit before navigate. Native tabs stay mounted, so translate
 * must reset on blur/focus — otherwise a slid-away tab comes back blank.
 */
export default function SwipeableTabWrapper({
  tabIndex,
  children,
}: SwipeableTabWrapperProps) {
  const router = useRouter();
  const tabIndexRef = useRef(tabIndex);
  tabIndexRef.current = tabIndex;
  const translateX = useRef(new Animated.Value(0)).current;
  const navigatingRef = useRef(false);
  const widthRef = useRef(Dimensions.get("window").width);

  const resetPosition = useCallback(() => {
    navigatingRef.current = false;
    translateX.stopAnimation();
    translateX.setValue(0);
  }, [translateX]);

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      widthRef.current = window.width;
    });
    return () => sub.remove();
  }, []);

  // NativeTabs keep scenes mounted — always re-center when this tab is focused.
  useFocusEffect(
    useCallback(() => {
      resetPosition();
      return () => {
        resetPosition();
      };
    }, [resetPosition])
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (navigatingRef.current) {
            return false;
          }
          const { dx, dy } = gestureState;
          return (
            Math.abs(dx) > 28 &&
            Math.abs(dx) > Math.abs(dy) * 2.2 &&
            Math.abs(dy) < 30
          );
        },
        onPanResponderTerminationRequest: () => !navigatingRef.current,
        onPanResponderGrant: () => {
          translateX.stopAnimation();
        },
        onPanResponderMove: (_, gestureState) => {
          if (navigatingRef.current) {
            return;
          }
          const index = tabIndexRef.current;
          let dx = gestureState.dx;
          if ((index === 0 && dx > 0) || (index === TAB_ROUTES.length - 1 && dx < 0)) {
            dx *= 0.28;
          }
          translateX.setValue(dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (navigatingRef.current) {
            return;
          }
          const index = tabIndexRef.current;
          const width = widthRef.current;
          const swipedLeft =
            gestureState.dx < -64 || gestureState.vx < -0.55;
          const swipedRight =
            gestureState.dx > 64 || gestureState.vx > 0.55;

          const goNext = swipedLeft && index < TAB_ROUTES.length - 1;
          const goPrev = swipedRight && index > 0;

          if (goNext || goPrev) {
            navigatingRef.current = true;
            const targetX = goNext ? -width : width;
            Animated.timing(translateX, {
              toValue: targetX,
              duration: COMMIT_MS,
              easing: commitEasing,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (!finished) {
                resetPosition();
                return;
              }
              router.navigate(TAB_ROUTES[goNext ? index + 1 : index - 1]);
              // Scene stays mounted under NativeTabs — park it back at 0
              // so returning to this tab is never a blank off-screen view.
              resetPosition();
            });
            return;
          }

          Animated.timing(translateX, {
            toValue: 0,
            duration: SNAP_BACK_MS,
            easing: commitEasing,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          if (navigatingRef.current) {
            return;
          }
          Animated.timing(translateX, {
            toValue: 0,
            duration: SNAP_BACK_MS,
            easing: commitEasing,
            useNativeDriver: true,
          }).start();
        },
      }),
    [resetPosition, router, translateX]
  );

  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
