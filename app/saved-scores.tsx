import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassCloseButton from "../components/GlassCloseButton";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { Radius, ScreenLayout } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import {
  SavedScoresStorageError,
  deleteScore,
  getEventTypeDisplayName,
  getSavedScores,
  reorderSavedScores,
  SavedScore,
} from "../utils/scoreStorage";
import { scaleFont, scaleSpacing } from "../utils/uiScale";
import { useSafePush } from "../utils/useSafePush";

const TRACK_COLOR = "#D35400";
const FALLBACK_STRIDE = scaleSpacing(148);
const SNAP_MS = 120;
const SHIFT_MS = 90;
const EDGE_SCROLL_ZONE = scaleSpacing(64);
const EDGE_SCROLL_MAX_SPEED = scaleSpacing(18);
const snapEasing = Easing.out(Easing.cubic);

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type ScoreCardProps = {
  item: SavedScore;
  index: number;
  colors: (typeof ThemeColors)["dark"];
  dragging: boolean;
  shiftY: number;
  getStride: () => number;
  getListLength: () => number;
  getScrollDelta: () => number;
  onHandleGrant: (index: number, id: string) => void;
  onHandleMove: (translationY: number, moveY: number) => void;
  onHandleRelease: (from: number, to: number) => void;
  onRegisterDragVisual: (
    updater: ((scrollDelta: number) => void) | null
  ) => void;
  onOpen: () => void;
  onDelete: () => void;
  onLayoutHeight: (height: number) => void;
  formatDate: (dateString: string) => string;
};

function ScoreCard({
  item,
  index,
  colors,
  dragging,
  shiftY,
  getStride,
  getListLength,
  getScrollDelta,
  onHandleGrant,
  onHandleMove,
  onHandleRelease,
  onRegisterDragVisual,
  onOpen,
  onDelete,
  onLayoutHeight,
  formatDate,
}: ScoreCardProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const draggingLocalRef = useRef(false);
  const settlingRef = useRef(false);
  const pendingResidualRef = useRef(0);
  const lastGestureDyRef = useRef(0);
  const [elevated, setElevated] = useState(false);
  const indexRef = useRef(index);
  const idRef = useRef(item.id);
  const onHandleGrantRef = useRef(onHandleGrant);
  const onHandleMoveRef = useRef(onHandleMove);
  const onHandleReleaseRef = useRef(onHandleRelease);
  const onRegisterDragVisualRef = useRef(onRegisterDragVisual);
  const getStrideRef = useRef(getStride);
  const getListLengthRef = useRef(getListLength);
  const getScrollDeltaRef = useRef(getScrollDelta);
  indexRef.current = index;
  idRef.current = item.id;
  onHandleGrantRef.current = onHandleGrant;
  onHandleMoveRef.current = onHandleMove;
  onHandleReleaseRef.current = onHandleRelease;
  onRegisterDragVisualRef.current = onRegisterDragVisual;
  getStrideRef.current = getStride;
  getListLengthRef.current = getListLength;
  getScrollDeltaRef.current = getScrollDelta;

  // While a drag is active, animate siblings into the open slot.
  useEffect(() => {
    if (draggingLocalRef.current || settlingRef.current || !dragging) {
      return;
    }
    Animated.timing(translateY, {
      toValue: shiftY,
      duration: SHIFT_MS,
      easing: snapEasing,
      useNativeDriver: true,
    }).start();
  }, [shiftY, dragging, translateY]);

  // On release/reorder: sync transforms before paint so layout + offset never disagree.
  useLayoutEffect(() => {
    if (draggingLocalRef.current) {
      return;
    }

    if (settlingRef.current) {
      const residual = pendingResidualRef.current;
      pendingResidualRef.current = 0;
      translateY.stopAnimation();
      translateY.setValue(residual);
      scale.setValue(1);
      settlingRef.current = false;

      Animated.timing(translateY, {
        toValue: 0,
        duration: SNAP_MS,
        easing: snapEasing,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          translateY.setValue(0);
        }
        setElevated(false);
      });
      return;
    }

    if (!dragging) {
      translateY.stopAnimation();
      translateY.setValue(shiftY);
    }
  }, [index, shiftY, dragging, translateY, scale]);

  useEffect(() => {
    return () => {
      onRegisterDragVisualRef.current(null);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        settlingRef.current = false;
        pendingResidualRef.current = 0;
        lastGestureDyRef.current = 0;
        draggingLocalRef.current = true;
        setElevated(true);
        translateY.stopAnimation();
        translateY.setValue(0);
        onRegisterDragVisualRef.current((scrollDelta) => {
          if (!draggingLocalRef.current) {
            return;
          }
          translateY.setValue(lastGestureDyRef.current + scrollDelta);
        });
        onHandleGrantRef.current(indexRef.current, idRef.current);
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 80,
          easing: snapEasing,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_event, gestureState) => {
        if (!draggingLocalRef.current) {
          return;
        }
        lastGestureDyRef.current = gestureState.dy;
        const translationY =
          gestureState.dy + getScrollDeltaRef.current();
        translateY.setValue(translationY);
        onHandleMoveRef.current(translationY, gestureState.moveY);
      },
      onPanResponderRelease: (_event, gestureState) => {
        onRegisterDragVisualRef.current(null);
        const from = indexRef.current;
        const step = getStrideRef.current() || FALLBACK_STRIDE;
        const translationY =
          gestureState.dy + getScrollDeltaRef.current();
        const to = clamp(
          from + Math.round(translationY / step),
          0,
          Math.max(0, getListLengthRef.current() - 1)
        );

        draggingLocalRef.current = false;

        if (from === to) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: SNAP_MS,
              easing: snapEasing,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: SNAP_MS,
              easing: snapEasing,
              useNativeDriver: true,
            }),
          ]).start(() => {
            translateY.setValue(0);
            scale.setValue(1);
            setElevated(false);
            onHandleReleaseRef.current(from, from);
          });
          return;
        }

        // FLIP: commit the new order now. Residual keeps the card visually
        // where the finger left it; useLayoutEffect then eases that to 0.
        pendingResidualRef.current = translationY - (to - from) * step;
        settlingRef.current = true;
        Animated.timing(scale, {
          toValue: 1,
          duration: SNAP_MS,
          easing: snapEasing,
          useNativeDriver: true,
        }).start();
        onHandleReleaseRef.current(from, to);
      },
      onPanResponderTerminate: () => {
        onRegisterDragVisualRef.current(null);
        settlingRef.current = false;
        pendingResidualRef.current = 0;
        draggingLocalRef.current = false;
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: SNAP_MS,
            easing: snapEasing,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: SNAP_MS,
            easing: snapEasing,
            useNativeDriver: true,
          }),
        ]).start(() => {
          translateY.setValue(0);
          scale.setValue(1);
          setElevated(false);
          onHandleReleaseRef.current(indexRef.current, indexRef.current);
        });
      },
    })
  ).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    if (draggingLocalRef.current || settlingRef.current) {
      return;
    }
    onLayoutHeight(event.nativeEvent.layout.height);
  };

  return (
    <Animated.View
      style={[
        styles.scoreCardWrapper,
        {
          transform: [{ translateY }, { scale }],
          zIndex: dragging || elevated ? 20 : 1,
          elevation: dragging || elevated ? 8 : 0,
        },
      ]}
      onLayout={handleLayout}
    >
      <View
        style={[
          styles.scoreCard,
          {
            backgroundColor: colors.surfaceSolid,
            borderWidth: 1,
            borderColor: colors.border,
            opacity: dragging || elevated ? 0.98 : 1,
          },
        ]}
      >
        <View
          style={styles.dragHandle}
          {...panResponder.panHandlers}
          accessibilityRole="button"
          accessibilityLabel={`Reorder ${item.title}`}
        >
          <Ionicons
            name="menu"
            size={scaleFont(22)}
            color={colors.textMuted}
            pointerEvents="none"
          />
        </View>
        <Pressable style={styles.scoreBody} onPress={onOpen}>
          <View style={styles.scoreHeader}>
            <View style={styles.scoreTitleContainer}>
              <Text style={[styles.scoreTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.eventType, { color: TRACK_COLOR }]}>
                {getEventTypeDisplayName(item.eventType)}
              </Text>
            </View>
          </View>
          <View style={[styles.scoreDetails, { borderTopColor: colors.border }]}>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Total Score:</Text>
              <Text style={[styles.scoreValue, { color: colors.text }]}>
                {item.totalScore} Points
              </Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Result Score:</Text>
              <Text style={[styles.resultScoreValue, { color: TRACK_COLOR }]}>
                {item.resultScore}
              </Text>
            </View>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>
              Saved on {formatDate(item.dateSaved)}
            </Text>
          </View>
        </Pressable>
      </View>
      <GlassCloseButton
        onPress={onDelete}
        textColor={colors.text}
        surfaceColor={colors.buttonSecondary}
        size={scaleSpacing(28)}
        accessibilityLabel={`Delete ${item.title}`}
        style={styles.deleteButton}
      />
    </Animated.View>
  );
}

export default function SavedScoresScreen() {
  const safePush = useSafePush();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const [scores, setScores] = useState<SavedScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragFromIndex, setDragFromIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [stride, setStride] = useState(FALLBACK_STRIDE);
  const scoresRef = useRef(scores);
  const dragFromRef = useRef(-1);
  const strideRef = useRef(FALLBACK_STRIDE);
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const scrollYAtGrantRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const scrollViewPageYRef = useRef(0);
  const autoScrollRafRef = useRef<number | null>(null);
  const lastMoveYRef = useRef(0);
  const lastTranslationYRef = useRef(0);
  const dragVisualUpdaterRef = useRef<((scrollDelta: number) => void) | null>(
    null
  );
  scoresRef.current = scores;
  strideRef.current = stride;

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRafRef.current != null) {
      cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
  }, []);

  const getScrollDelta = useCallback(
    () => scrollYRef.current - scrollYAtGrantRef.current,
    []
  );

  const updateHoverFromTranslation = useCallback((translationY: number) => {
    const from = dragFromRef.current;
    const step = strideRef.current || FALLBACK_STRIDE;
    const nextHover = clamp(
      from + Math.round(translationY / step),
      0,
      Math.max(0, scoresRef.current.length - 1)
    );
    setHoverIndex((previous) => (previous === nextHover ? previous : nextHover));
  }, []);

  const loadScores = useCallback(async () => {
    try {
      setLoading(true);
      const savedScores = await getSavedScores();
      setScores(savedScores);
    } catch (error) {
      const message =
        error instanceof SavedScoresStorageError
          ? error.message
          : "Failed to load saved scores.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadScores();
      return () => {
        stopAutoScroll();
      };
    }, [loadScores, stopAutoScroll])
  );

  const handleDelete = (id: string, title: string) => {
    Alert.alert("Delete Score", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteScore(id);
            setScores((previous) => previous.filter((score) => score.id !== id));
          } catch {
            Alert.alert("Error", "Failed to delete score.");
          }
        },
      },
    ]);
  };

  const handleHandleGrant = useCallback((index: number, id: string) => {
    dragFromRef.current = index;
    scrollYAtGrantRef.current = scrollYRef.current;
    lastMoveYRef.current = 0;
    lastTranslationYRef.current = 0;
    setDraggingId(id);
    setDragFromIndex(index);
    setHoverIndex(index);
    scrollRef.current?.measureInWindow((_x, y) => {
      scrollViewPageYRef.current = y;
    });
  }, []);

  const runEdgeAutoScroll = useCallback(() => {
    if (autoScrollRafRef.current != null) {
      return;
    }

    const step = () => {
      autoScrollRafRef.current = null;
      if (dragFromRef.current < 0) {
        return;
      }

      const viewportHeight = viewportHeightRef.current;
      if (viewportHeight <= 0) {
        return;
      }

      const localY = lastMoveYRef.current - scrollViewPageYRef.current;
      let speed = 0;
      if (localY < EDGE_SCROLL_ZONE) {
        const intensity = 1 - clamp(localY / EDGE_SCROLL_ZONE, 0, 1);
        speed = -EDGE_SCROLL_MAX_SPEED * intensity;
      } else if (localY > viewportHeight - EDGE_SCROLL_ZONE) {
        const intensity =
          1 - clamp((viewportHeight - localY) / EDGE_SCROLL_ZONE, 0, 1);
        speed = EDGE_SCROLL_MAX_SPEED * intensity;
      }

      if (Math.abs(speed) > 0.1) {
        const maxScroll = Math.max(
          0,
          contentHeightRef.current - viewportHeight
        );
        const nextScrollY = clamp(scrollYRef.current + speed, 0, maxScroll);
        if (nextScrollY === scrollYRef.current) {
          return;
        }
        scrollYRef.current = nextScrollY;
        scrollRef.current?.scrollTo({ y: nextScrollY, animated: false });
        const scrollDelta = nextScrollY - scrollYAtGrantRef.current;
        dragVisualUpdaterRef.current?.(scrollDelta);
        const translationY = lastTranslationYRef.current + scrollDelta;
        updateHoverFromTranslation(translationY);
        autoScrollRafRef.current = requestAnimationFrame(step);
      }
    };

    autoScrollRafRef.current = requestAnimationFrame(step);
  }, [updateHoverFromTranslation]);

  const handleHandleMove = useCallback(
    (translationY: number, moveY: number) => {
      // translationY already includes scroll delta from the card.
      // Store gesture-only portion for auto-scroll compensation.
      lastTranslationYRef.current = translationY - getScrollDelta();
      lastMoveYRef.current = moveY;
      updateHoverFromTranslation(translationY);

      const viewportHeight = viewportHeightRef.current;
      const localY = moveY - scrollViewPageYRef.current;
      const nearEdge =
        viewportHeight > 0 &&
        (localY < EDGE_SCROLL_ZONE ||
          localY > viewportHeight - EDGE_SCROLL_ZONE);

      if (nearEdge) {
        runEdgeAutoScroll();
      } else {
        stopAutoScroll();
      }
    },
    [getScrollDelta, runEdgeAutoScroll, stopAutoScroll, updateHoverFromTranslation]
  );

  const handleHandleRelease = useCallback(
    (from: number, to: number) => {
      stopAutoScroll();
      const list = scoresRef.current;

      setDraggingId(null);
      setDragFromIndex(-1);
      setHoverIndex(-1);
      dragFromRef.current = -1;
      dragVisualUpdaterRef.current = null;

      if (from < 0 || from >= list.length || from === to) {
        return;
      }

      const previous = list;
      const next = moveItem(list, from, to);
      setScores(next);

      void (async () => {
        try {
          await reorderSavedScores(next.map((score) => score.id));
        } catch {
          setScores(previous);
          Alert.alert("Error", "Failed to save the new order.");
        }
      })();
    },
    [stopAutoScroll]
  );

  const handleCardLayout = useCallback((height: number) => {
    const next = height + scaleSpacing(12);
    if (next > 0) {
      setStride((previous) => (Math.abs(previous - next) > 1 ? next : previous));
    }
  }, []);

  const getStride = useCallback(() => strideRef.current || FALLBACK_STRIDE, []);
  const getListLength = useCallback(() => scoresRef.current.length, []);

  const handleRegisterDragVisual = useCallback(
    (updater: ((scrollDelta: number) => void) | null) => {
      dragVisualUpdaterRef.current = updater;
    },
    []
  );

  const shiftForIndex = (index: number) => {
    if (draggingId == null || dragFromIndex < 0 || hoverIndex < 0) {
      return 0;
    }
    if (dragFromIndex < hoverIndex && index > dragFromIndex && index <= hoverIndex) {
      return -stride;
    }
    if (dragFromIndex > hoverIndex && index >= hoverIndex && index < dragFromIndex) {
      return stride;
    }
    return 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if ((Platform.OS as string) === "web") {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.webTitle, { color: colors.text }]}>Saved Scores</Text>
          <Text style={[styles.webMessage, { color: colors.textMuted }]}>
            This feature is only available on iOS and Android.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const listBody = loading ? (
    <View style={styles.centerContainer}>
      <Text style={[styles.emptyText, { color: colors.text }]}>Loading...</Text>
    </View>
  ) : scores.length === 0 ? (
    <View style={styles.centerContainer}>
      <Text style={[styles.emptyText, { color: colors.text }]}>No saved scores yet</Text>
      <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
        Save scores from any calculator screen to see them here
      </Text>
    </View>
  ) : (
    <ScrollView
      ref={scrollRef}
      scrollEnabled={draggingId === null}
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      onLayout={(event) => {
        viewportHeightRef.current = event.nativeEvent.layout.height;
        scrollRef.current?.measureInWindow((_x, y) => {
          scrollViewPageYRef.current = y;
        });
      }}
      onContentSizeChange={(_width, height) => {
        contentHeightRef.current = height;
      }}
      onScroll={(event) => {
        scrollYRef.current = event.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
    >
      {scores.map((item, index) => (
        <ScoreCard
          key={item.id}
          item={item}
          index={index}
          colors={colors}
          dragging={draggingId === item.id}
          shiftY={draggingId === item.id ? 0 : shiftForIndex(index)}
          getStride={getStride}
          getListLength={getListLength}
          getScrollDelta={getScrollDelta}
          onHandleGrant={handleHandleGrant}
          onHandleMove={handleHandleMove}
          onHandleRelease={handleHandleRelease}
          onRegisterDragVisual={handleRegisterDragVisual}
          onOpen={() =>
            safePush({
              pathname: "/saved-score-detail",
              params: { id: item.id },
            } as any)
          }
          onDelete={() => handleDelete(item.id, item.title)}
          onLayoutHeight={handleCardLayout}
          formatDate={formatDate}
        />
      ))}
    </ScrollView>
  );

  if (USE_NATIVE_HEADER) {
    return (
      <>
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        {listBody}
      </>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <View style={styles.webTitleRow}>
        <Text style={[styles.webTitle, { color: colors.text }]}>Saved Scores</Text>
      </View>
      {listBody}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: scaleSpacing(20),
  },
  webTitleRow: {
    alignItems: "center",
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: ScreenLayout.horizontalPadding,
  },
  webTitle: {
    fontSize: scaleFont(17),
    fontWeight: "600",
    textAlign: "center",
  },
  webMessage: {
    fontSize: scaleFont(16),
    textAlign: "center",
    marginTop: scaleSpacing(20),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: scaleSpacing(280),
  },
  emptyText: {
    fontSize: scaleFont(18),
    fontWeight: "600",
    marginBottom: scaleSpacing(8),
  },
  emptySubtext: {
    fontSize: scaleFont(14),
    textAlign: "center",
    paddingHorizontal: scaleSpacing(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ScreenLayout.horizontalPadding,
    paddingTop: scaleSpacing(12),
    paddingBottom: scaleSpacing(20),
  },
  scoreCardWrapper: {
    position: "relative",
    marginBottom: scaleSpacing(12),
  },
  scoreCard: {
    borderRadius: Radius.md,
    padding: scaleSpacing(16),
    paddingRight: scaleSpacing(50),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dragHandle: {
    paddingRight: scaleSpacing(14),
    paddingLeft: scaleSpacing(2),
    paddingVertical: scaleSpacing(18),
    justifyContent: "center",
    alignItems: "center",
    minWidth: scaleSpacing(36),
  },
  scoreBody: {
    flex: 1,
  },
  scoreHeader: {
    marginBottom: scaleSpacing(12),
  },
  scoreTitleContainer: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    marginBottom: scaleSpacing(4),
  },
  eventType: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  deleteButton: {
    position: "absolute",
    top: scaleSpacing(16),
    right: scaleSpacing(16),
    zIndex: 10,
  },
  scoreDetails: {
    borderTopWidth: 1,
    paddingTop: scaleSpacing(12),
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleSpacing(8),
  },
  scoreLabel: {
    fontSize: scaleFont(14),
  },
  scoreValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  resultScoreValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  dateText: {
    fontSize: scaleFont(12),
    marginTop: scaleSpacing(4),
  },
});
