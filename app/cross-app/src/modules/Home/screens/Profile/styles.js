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
  name: {
    textTransform: 'uppercase',
    color:  COLORS.WHITE_COLOR,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 40
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
    flexDirection: 'row'
  },
  infoText: {
    marginTop: 12,
    color: COLORS.WHITE_COLOR,
    width: '50%'
  },
  infoTextLabel: {
    fontWeight: 'bold'
  }
});
