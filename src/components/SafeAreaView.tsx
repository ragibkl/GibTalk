import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
  style?: StyleProp<ViewStyle>;
};

export default function SafeAreaView(props: Props) {
  const insets = useSafeAreaInsets();

  const insetStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return <View style={[props.style, insetStyle]}>{props.children}</View>;
}
