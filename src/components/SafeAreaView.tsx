import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
  style?: StyleProp<ViewStyle>;
  minPadding?: number;
  minPaddingTop?: number;
  minPaddingBottom?: number;
  minPaddingLeft?: number;
  minPaddingRight?: number;
};

function max(value: number, ...values: (number | undefined)[]): number {
  const filtered = values.filter(Boolean) as number[];
  return Math.max(value, ...filtered);
}

export default function SafeAreaView(props: Props) {
  const {
    minPadding,
    minPaddingTop,
    minPaddingBottom,
    minPaddingLeft,
    minPaddingRight,
  } = props;
  const insets = useSafeAreaInsets();

  const insetStyle = {
    paddingTop: max(insets.top, minPadding, minPaddingTop),
    paddingBottom: max(insets.bottom, minPadding, minPaddingBottom),
    paddingLeft: max(insets.left, minPadding, minPaddingLeft),
    paddingRight: max(insets.right, minPadding, minPaddingRight),
  };

  return <View style={[props.style, insetStyle]}>{props.children}</View>;
}
