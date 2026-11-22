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
import { ThemeColors } from "../constants/ThemeColors";
import { useAppTheme } from "../contexts/ThemeContext";
import { armTabEnterFrom, takeTabEnterFrom } from "../utils/tabSwipeSignal";

const TAB_ROUTES: Href[] = ["/", "/ranking", "/more"];
/** Never drag far enough to empty the scene into blank NativeTabs chrome. */
const MAX_PEEK = 0.34;
/** Destination enters from this fraction of width, then settles. */
const ENTER_FROM = 0.22;
const ENTER_MS = 170;
const SNAP_BACK_MS = 150;
const settleEasing = Easing.out(Easing.cubic);

type SwipeableTabWrapperProps = {
  tabIndex: 0 | 1 | 2;
  children: React.ReactNode;
};

/**
 * Directional tab swipe without a blank flash: peek with the finger, navigate
 * immediately on commit, destination settles in from the swipe side (<200ms).
 * NativeTabs keep scenes mounted — never slide a tab fully off-screen.
 */
export default function SwipeableTabWrapper({
  tabIndex,
  children,
}: SwipeableTabWrapperProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const backgroundColor = ThemeColors[theme].background;
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

  const playEnterIfArmed = useCallback(() => {
    const from = takeTabEnterFrom();
    if (!from) {
      resetPosition();
      return;
    }
    const width = widthRef.current;
    const startX = from === "right" ? width * ENTER_FROM : -width * ENTER_FROM;
    navigatingRef.current = false;
    translateX.stopAnimation();
    translateX.setValue(startX);
    Animated.timing(translateX, {
      toValue: 0,
      duration: ENTER_MS,
      easing: settleEasing,
      useNativeDriver: true,
    }).start();
  }, [resetPosition, translateX]);

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      widthRef.current = window.width;
    });
    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      playEnterIfArmed();
      return () => {
        // Leaving: park at rest so a remounted/refocused scene is never blank.
        translateX.stopAnimation();
        translateX.setValue(0);
        navigatingRef.current = false;
      };
    }, [playEnterIfArmed, translateX])
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
          const width = widthRef.current;
          const max = width * MAX_PEEK;
          let dx = gestureState.dx;
          if ((index === 0 && dx > 0) || (index === TAB_ROUTES.length - 1 && dx < 0)) {
            dx *= 0.28;
          }
          if (dx > max) {
            dx = max + (dx - max) * 0.18;
          } else if (dx < -max) {
            dx = -max + (dx + max) * 0.18;
          }
          translateX.setValue(dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (navigatingRef.current) {
            return;
          }
          const index = tabIndexRef.current;
          const swipedLeft =
            gestureState.dx < -64 || gestureState.vx < -0.55;
          const swipedRight =
            gestureState.dx > 64 || gestureState.vx > 0.55;

          const goNext = swipedLeft && index < TAB_ROUTES.length - 1;
          const goPrev = swipedRight && index > 0;

          if (goNext || goPrev) {
            navigatingRef.current = true;
            // Destination enters from the side we swiped toward.
            armTabEnterFrom(goNext ? "right" : "left");
            router.navigate(TAB_ROUTES[goNext ? index + 1 : index - 1]);
            // Keep this scene at rest — never slide it into blank chrome.
            resetPosition();
            return;
          }

          Animated.timing(translateX, {
            toValue: 0,
            duration: SNAP_BACK_MS,
            easing: settleEasing,
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
            easing: settleEasing,
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
      style={[styles.container, { backgroundColor, transform: [{ translateX }] }]}
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
