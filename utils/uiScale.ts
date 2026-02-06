import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 390; // iPhone 15 Pro width
const BASE_HEIGHT = 844; // iPhone 15 Pro height

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const scaleSize = (size: number) => {
  const widthScale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * widthScale));
};

export const scaleFont = (size: number) => {
  const widthScale = SCREEN_WIDTH / BASE_WIDTH;
  const scaled = size * widthScale;
  return Math.round(PixelRatio.roundToNearestPixel(clamp(scaled, size * 0.9, size * 1.1)));
};

export const scaleSpacing = (size: number) => {
  const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(PixelRatio.roundToNearestPixel(size * heightScale));
};
