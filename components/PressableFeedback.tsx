import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type PressableFeedbackProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. Default 0.97. */
  pressedScale?: number;
  /** Opacity while pressed. Default 0.88. */
  pressedOpacity?: number;
  children: React.ReactNode;
};

/**
 * Light press scale/opacity — confirms the tap without adding chrome.
 * Layout styles stay on the outer Pressable so flex children keep their size.
 */
export default function PressableFeedback({
  style,
  pressedScale = 0.97,
  pressedOpacity = 0.88,
  children,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: PressableFeedbackProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const animateTo = (nextScale: number, nextOpacity: number) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: nextScale,
        friction: 7,
        tension: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: nextOpacity,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      disabled={disabled}
      style={style}
      onPressIn={(event) => {
        if (!disabled) {
          animateTo(pressedScale, pressedOpacity);
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateTo(1, 1);
        onPressOut?.(event);
      }}
      {...rest}
    >
      <Animated.View
        style={{
          flex: 1,
          alignSelf: "stretch",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }],
          opacity,
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
