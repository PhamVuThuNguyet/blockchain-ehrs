import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './styles';
import { NavigationContext } from '@react-navigation/native';

export default function NormalHeader({ title = '', handlePress }) {
  const navigation = useContext(NavigationContext);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileWrap}>
        <Icon
          name='arrow-back'
          type='material'
          color='#858585'
          iconStyle={{
            padding: 4,
          }}
          size={24}
          onPress={handlePress}
        />
        <Text style={styles.fullname}>{title}</Text>
      </View>
    </View>
  );
}