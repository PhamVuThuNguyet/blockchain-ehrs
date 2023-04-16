import { StyleSheet, StatusBar, View } from "react-native";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import COLORS from '@src/constants/colors';


// const STATUSBAR_HEIGHT = StatusBar.currentHeight;
// const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default function CustomStatusBar({
  backgroundColor,
  barStyle = "light-content",
  //add more props StatusBar
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: insets.top, backgroundColor: COLORS.PRIMARY_COLOR }}>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};