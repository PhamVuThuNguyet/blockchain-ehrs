import { StyleSheet } from "react-native";
import COLORS from "@src/constants/colors";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    display: "flex",
    flexDirection: "coloumn",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    flex: 1,
  },
  logoImg: {
    height: 118,
    width: 118,
    marginBottom: 36,
  },
  input: {
    height: 52,
    width: "100%",
    backgroundColor: COLORS.INPUT_COLOR,
    color: COLORS.WHITE_COLOR,
    padding: 12,
    borderRadius: 5,
    marginTop: 24,
  },
  forgotPassLabelWrap: {
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
  },
  forgotPassLabel: {
    color: COLORS.BLUE_COLOR,
    fontSize: 12,
    marginTop: 12,
    marginBottom: 80,
  },
  loginBtn: {
    height: 52,
    width: "100%",
    backgroundColor: COLORS.BLUE_COLOR,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBtnText: {
    color: COLORS.WHITE_COLOR,
  },
});
