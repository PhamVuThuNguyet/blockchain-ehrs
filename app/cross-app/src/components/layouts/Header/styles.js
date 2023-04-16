import { StyleSheet, StatusBar } from 'react-native';
import COLORS from '@src/constants/colors';

export default styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    marginTop: StatusBar.currentHeight,
    backgroundColor: COLORS.PRIMARY_COLOR,
    paddingLeft: 8,
    paddingRight: 12,
  },
  profileWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullname: {
    marginLeft: 8,
    fontSize: 18,
    color: '#858585',
  },
  controlWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});