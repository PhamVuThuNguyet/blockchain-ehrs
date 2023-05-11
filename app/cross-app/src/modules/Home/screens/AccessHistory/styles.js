import { StyleSheet } from "react-native";
import COLORS from "@src/constants/colors";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 36,
    paddingRight: 36,
  },
  infoList: {
    marginTop: 20,
    backgroundColor: COLORS.INPUT_COLOR,
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  infoWrap: {
    display: 'flex',
    flexDirection: 'column'
  },
  infoText: {
    color: COLORS.WHITE_COLOR,
    marginBottom: 12
  },
  infoTime: {
    color: COLORS.PLACEHOLDER_TEXT_COLOR,
    marginBottom: 0
  }
});
