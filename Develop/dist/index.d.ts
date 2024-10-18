import React from 'react';
import { TextProps, ViewStyle } from 'react-native';
declare type MarqueeDirection = 'left' | 'right';
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
declare const MarqueeText: ({ loop, direction, speed, children, containerStyle, contentContainerStyle, style, space, }: MarqueeProps) => React.JSX.Element;
export default MarqueeText;
//# sourceMappingURL=index.d.ts.map