import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { ThemeColors } from "../constants/ThemeColors";
import { useAppTheme } from "../contexts/ThemeContext";
import { getTabScreen } from "./tabs/tabScreenRegistry";

const TAB_ROUTES: Href[] = ["/", "/ranking", "/more"];
const COMMIT_MS = 220;
const SNAP_BACK_MS = 180;
const settleEasing = Easing.out(Easing.cubic);

type SwipeableTabWrapperProps = {
  tabIndex: 0 | 1 | 2;
  children: React.ReactNode;
};

/**
 * Dual-panel tab swipe on a fixed 3-page strip (prev | current | next).
 * Mid-gesture always shows real adjacent content beside the current tab —
 * never empty NativeTabs chrome.
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
  const [pageWidth, setPageWidth] = useState(widthRef.current);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const baseOffset = useRef(new Animated.Value(-widthRef.current)).current;

  const resetStrip = useCallback(() => {
    navigatingRef.current = false;
    translateX.stopAnimation();
    translateX.setValue(0);
    baseOffset.setValue(-widthRef.current);
    setShowPrev(false);
    setShowNext(false);
  }, [baseOffset, translateX]);

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      widthRef.current = window.width;
      setPageWidth(window.width);
      baseOffset.setValue(-window.width);
    });
    return () => sub.remove();
  }, [baseOffset]);

  useFocusEffect(
    useCallback(() => {
      resetStrip();
      return () => {
        resetStrip();
      };
    }, [resetStrip])
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
            Math.abs(dx) > 24 &&
            Math.abs(dx) > Math.abs(dy) * 2.2 &&
            Math.abs(dy) < 28
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
          let dx = gestureState.dx;

          if (dx < -8 && index < TAB_ROUTES.length - 1) {
            setShowNext(true);
          } else if (dx > 8 && index > 0) {
            setShowPrev(true);
          }

          if ((index === 0 && dx > 0) || (index === TAB_ROUTES.length - 1 && dx < 0)) {
            dx *= 0.28;
          } else if (dx < -width) {
            dx = -width;
          } else if (dx > width) {
            dx = width;
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
            gestureState.dx < -width * 0.22 || gestureState.vx < -0.55;
          const swipedRight =
            gestureState.dx > width * 0.22 || gestureState.vx > 0.55;

          const goNext = swipedLeft && index < TAB_ROUTES.length - 1;
          const goPrev = swipedRight && index > 0;

          if (goNext || goPrev) {
            navigatingRef.current = true;
            if (goNext) {
              setShowNext(true);
            } else {
              setShowPrev(true);
            }
            Animated.timing(translateX, {
              toValue: goNext ? -width : width,
              duration: COMMIT_MS,
              easing: settleEasing,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (!finished) {
                resetStrip();
                return;
              }
              router.navigate(TAB_ROUTES[goNext ? index + 1 : index - 1]);
              resetStrip();
            });
            return;
          }

          Animated.timing(translateX, {
            toValue: 0,
            duration: SNAP_BACK_MS,
            easing: settleEasing,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) {
              setShowPrev(false);
              setShowNext(false);
            }
          });
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
          }).start(({ finished }) => {
            if (finished) {
              setShowPrev(false);
              setShowNext(false);
            }
          });
        },
      }),
    [resetStrip, router, translateX]
  );

  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  const index = tabIndex;
  const Prev = showPrev && index > 0 ? getTabScreen(index - 1) : null;
  const Next =
    showNext && index < TAB_ROUTES.length - 1 ? getTabScreen(index + 1) : null;
  const stripTranslate = Animated.add(baseOffset, translateX);

  return (
    <View style={[styles.clip, { backgroundColor }]} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.strip,
          {
            width: pageWidth * 3,
            backgroundColor,
            transform: [{ translateX: stripTranslate }],
          },
        ]}
      >
        <View style={[styles.page, { width: pageWidth, backgroundColor }]}>
          {Prev ? <Prev /> : null}
        </View>
        <View style={[styles.page, { width: pageWidth, backgroundColor }]}>
          {children}
        </View>
        <View style={[styles.page, { width: pageWidth, backgroundColor }]}>
          {Next ? <Next /> : null}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    flex: 1,
    overflow: "hidden",
  },
  strip: {
    flex: 1,
    flexDirection: "row",
  },
  page: {
    height: "100%",
    overflow: "hidden",
  },
});
