import React from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

type KeyboardDismissScrollViewProps = ScrollViewProps & {
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/**
 * ScrollView that keeps tap-outside-to-dismiss keyboard without blocking scroll.
 * (Wrapping ScrollView in TouchableWithoutFeedback steals vertical gestures on Android.)
 * On web, skip the Pressable wrapper — it steals mouse focus from TextInputs
 * so you have to click-and-hold to type.
 */
export default function KeyboardDismissScrollView({
  children,
  contentContainerStyle,
  keyboardShouldPersistTaps = "handled",
  keyboardDismissMode = "on-drag",
  showsVerticalScrollIndicator = false,
  ...props
}: KeyboardDismissScrollViewProps) {
  const isWeb = Platform.OS === "web";

  return (
    <ScrollView
      {...props}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode={keyboardDismissMode}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {isWeb ? (
        children
      ) : (
        <Pressable
          onPress={Keyboard.dismiss}
          accessible={false}
          style={styles.pressable}
        >
          {children}
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  pressable: {
    flexGrow: 1,
  },
});
