import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default function Profile() {

  const profile = {
    name: 'Nguyen Quang Chung',
    info: [
      [
        {
          key: 'Birth',
          value: '09/01/2001'
        },
        {
          key: 'Gender',
          value: 'Male'
        },
        {
          key: 'Address',
          value: '40 cao hong lanh, hoa quy, ngu hanh son, da nang'
        },
        {
          key: 'Phone',
          value: '0377829114'
        },
        {
          key: 'Email',
          value: 'chung@gmail.com'
        },
      ],
      [
        {
          key: 'Blood type',
          value: 'O'
        },
        {
          key: 'Weight',
          value: '100kg'
        },
        {
          key: 'Height',
          value: '100cm'
        },
      ],
      [
        {
          key: 'EHR Create date',
          value: '09/01/2023'
        },
        {
          key: 'Last update',
          value: '4/4/2023'
        },
       
      ]
    ]
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.name}</Text>
      {profile.info.map((item, index) => (
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
