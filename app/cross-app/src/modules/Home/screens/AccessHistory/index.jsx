import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styles.js";
import { useSelector } from "react-redux";
import { showAlertMessage } from "@src/utils/alert";
import notificationApi from "@src/api/notification";
import { timeAgo } from '@src/utils/timeAgo';

export default function AccessHistory() {

  const user = useSelector((state) => state.auth.user);
  const [notificationList, setNotificationList] = useState([]);

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

  const fetchNotification = async () => {
    try {
      const { data } = await notificationApi.getNotification(user.patientId);
      setNotificationList(data);
    } catch (error) {
      showAlertMessage("Error", "An error has been occur!");
    }
  }

  useEffect(() => {
    fetchNotification();
  }, [user]);

  return (
    <View style={styles.container}>
      {notificationList.map(({content, createdAt}, index) => (
        <View style={styles.infoList} key={index}>
          <View style={styles.infoWrap}>
            <Text style={styles.infoText}>{content}</Text>
            <Text style={[styles.infoText, styles.infoTime]}>{timeAgo(new Date(createdAt).getTime())}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
