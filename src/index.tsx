import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type MarqueeDirection = 'left' | 'right';
interface MarqueeProps extends TextProps {
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  direction?: MarqueeDirection;
  speed?: number;
  children: string;
  loop?: boolean;
  loopDelay?: number;
  startDelay?: number;
  space?: number;
}

const MarqueeText = ({
  loop,
  direction = 'left',
  speed = 50,
  children,
  containerStyle,
  contentContainerStyle,
  style,
  space = 0,
}: MarqueeProps) => {
  const isLeftDirection = direction === 'left';
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useSharedValue(0);
  const [isFinished, setIsFinished] = useState(false);
  const isOverContainer = useMemo(() => {
    return textWidth > containerWidth - speed;
  }, [textWidth, containerWidth]);

  useEffect(() => {
    if (textWidth <= 0 || !isOverContainer) return;
    translateX.value = isLeftDirection ? -containerWidth : -textWidth;
    translateX.value = withRepeat(
      withTiming(isLeftDirection ? textWidth : containerWidth, {
        duration: (textWidth * 1000) / speed,
        easing: Easing.linear,
      }),
      loop ? -1 : 1,
      false,
      (finished?: boolean) => {
        if (typeof finished !== 'undefined') runOnJS(setIsFinished)(finished);
      },
    );
    return () => {
      translateX.value = 0;
      setIsFinished(false);
    };
  }, [textWidth, isOverContainer, containerWidth, loop, direction, isLeftDirection, speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: isLeftDirection ? -translateX.value : translateX.value }],
  }));

  const loopedText =
    (loop && space > 0 ? Array.from({ length: 100 }, () => children).join(' '.repeat(space)) : children) +
    ' '.repeat(space);

  return (
    <View
      style={[styles.container, containerStyle]}
      onLayout={event => setContainerWidth(event.nativeEvent.layout.width)}>
      {isFinished ? (
        <Text style={style} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        <ScrollView
          horizontal
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}>
          <Animated.Text
            onLayout={event => setTextWidth(event.nativeEvent.layout.width)}
            style={[animatedStyle, style]}
            numberOfLines={1}>
            {loop ? loopedText : children}
          </Animated.Text>
        </ScrollView>
      )}
    </View>
  );
};

export default MarqueeText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
});
