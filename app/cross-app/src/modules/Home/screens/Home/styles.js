import { StyleSheet } from "react-native";
import COLORS from "@src/constants/colors";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingLeft: 36,
    paddingRight: 36,
  },
  logoImg: {
    height: 118,
    width: 118,
    marginBottom: 36,
  },
  itemList: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  item: {
    width: "45%",
    height: 100,
    backgroundColor: COLORS.INPUT_COLOR,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.WHITE_COLOR,
    textTransform: 'uppercase'
  },
});
