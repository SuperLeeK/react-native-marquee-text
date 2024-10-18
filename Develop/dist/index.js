import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from 'react-native-reanimated';
var MarqueeText = function (_a) {
    var loop = _a.loop, _b = _a.direction, direction = _b === void 0 ? 'left' : _b, _c = _a.speed, speed = _c === void 0 ? 50 : _c, children = _a.children, containerStyle = _a.containerStyle, contentContainerStyle = _a.contentContainerStyle, style = _a.style, _d = _a.space, space = _d === void 0 ? 0 : _d;
    var isLeftDirection = direction === 'left';
    var _e = useState(0), containerWidth = _e[0], setContainerWidth = _e[1];
    var _f = useState(0), textWidth = _f[0], setTextWidth = _f[1];
    var translateX = useSharedValue(0);
    var _g = useState(false), isFinished = _g[0], setIsFinished = _g[1];
    var isOverContainer = useMemo(function () {
        return textWidth > containerWidth - speed;
    }, [textWidth, containerWidth]);
    useEffect(function () {
        if (textWidth <= 0 || !isOverContainer)
            return;
        translateX.value = isLeftDirection ? -containerWidth : -textWidth;
        translateX.value = withRepeat(withTiming(isLeftDirection ? textWidth : containerWidth, {
            duration: (textWidth * 1000) / speed,
            easing: Easing.linear,
        }), loop ? -1 : 1, false, function (finished) {
            if (typeof finished !== 'undefined')
                runOnJS(setIsFinished)(finished);
        });
        return function () {
            translateX.value = 0;
            setIsFinished(false);
        };
    }, [textWidth, isOverContainer, containerWidth, loop, direction, isLeftDirection, speed]);
    var animatedStyle = useAnimatedStyle(function () { return ({
        transform: [{ translateX: isLeftDirection ? -translateX.value : translateX.value }],
    }); });
    var loopedText = (loop && space > 0 ? Array.from({ length: 100 }, function () { return children; }).join(' '.repeat(space)) : children) +
        ' '.repeat(space);
    return (<View style={[styles.container, containerStyle]} onLayout={function (event) { return setContainerWidth(event.nativeEvent.layout.width); }}>
      {isFinished ? (<Text style={style} numberOfLines={1}>
          {children}
        </Text>) : (<ScrollView horizontal style={styles.scrollView} contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}>
          <Animated.Text onLayout={function (event) { return setTextWidth(event.nativeEvent.layout.width); }} style={[animatedStyle, style]} numberOfLines={1}>
            {loop ? loopedText : children}
          </Animated.Text>
        </ScrollView>)}
    </View>);
};
export default MarqueeText;
var styles = StyleSheet.create({
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
//# sourceMappingURL=index.js.map