import React from "react";
import { Text, View } from "react-native";
import styles from "./styles.js";

export default function AccessHistory() {

  const histories = [
    {
      text: 'Doctor Chung thich nau an Updated your EHR',
      time: '2hrs ago'
    },
    {
      text: 'Doctor Chung thich nau an Updated your EHR',
      time: '3hrs ago'
    }
  ]

  return (
    <View style={styles.container}>
      {histories.map(({text, time}, index) => (
        <View style={styles.infoList} key={index}>
          <View style={styles.infoWrap}>
            <Text style={styles.infoText}>{text}</Text>
            <Text style={[styles.infoText, styles.infoTime]}>{time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
