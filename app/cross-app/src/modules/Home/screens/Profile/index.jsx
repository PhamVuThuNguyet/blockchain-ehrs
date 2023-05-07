import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';
import convertProfile from '@src/utils/convertProfile';

export default function Profile() {
  const profile = useSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{convertProfile(profile).name}</Text>
      {convertProfile(profile)?.info?.map((item, index) => (
        <View style={styles.infoList} key={index}>
          {item.map(({key, value}, i) => (
            <View key={i} style={styles.infoWrap}>
              <Text style={[styles.infoText, styles.infoTextLabel]}>{key}</Text>
              <Text style={styles.infoText}>{value}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
