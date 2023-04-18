import { StyleSheet } from "react-native";
import COLORS from "@src/constants/colors";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 40,
  },
  tableBorder: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_COLOR,
  },
  table: {
    
  },
  head: { 
    height: 50,
    backgroundColor: COLORS.INPUT_COLOR,
  },
  text: {
    margin: 6,
    color: COLORS.WHITE_COLOR,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: COLORS.INPUT_COLOR,
    height: 50
  },
  btnWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btn: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 4,
  },
  btnText: {
    color: COLORS.WHITE_COLOR,
  },
  btnAccept: {
    backgroundColor: COLORS.BLUE_COLOR,
  },
  btnReject: {
    backgroundColor: COLORS.RED_COLOR,
  },
});
