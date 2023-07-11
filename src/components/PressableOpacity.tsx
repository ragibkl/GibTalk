import { ReactNode } from 'react';
import { Pressable, StyleProp, ViewStyle, PressableStateCallbackType, GestureResponderEvent } from 'react-native';

type Props = {
    children: ReactNode | ReactNode[],
    style?: StyleProp<ViewStyle>,
    onPress?: (event: GestureResponderEvent) => void,
    onLongPress?: (event: GestureResponderEvent) => void,
}

export default function PressableOpacity({ children, style, onPress, onLongPress }: Props) {
    const styleCallback = (state: PressableStateCallbackType) => {
        const opacity = state.pressed ? 0.5 : 1;
        return [{ opacity }, style]
    }
    return (
        <Pressable style={styleCallback} onPress={onPress} onLongPress={onLongPress}>
            {children}
        </Pressable>
    )
}
