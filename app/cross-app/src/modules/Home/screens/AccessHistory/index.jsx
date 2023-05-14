import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import styles from "./styles.js";
import { useSelector } from "react-redux";
import { showAlertMessage } from "@src/utils/alert";
import notificationApi from "@src/api/notification";
import { timeAgo } from "@src/utils/timeAgo";
import COLORS from '@src/constants/colors'

export default function AccessHistory() {
  const user = useSelector((state) => state.auth.user);
  const [notificationList, setNotificationList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchNotification = async () => {
    try {
      const { data } = await notificationApi.getNotification(user.patientId);
      setNotificationList(data);
    } catch (error) {
      showAlertMessage("Error", "An error has been occur!");
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchNotification();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchNotification();
  }, [user]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl tintColor={`${COLORS.BOTTOM_BAR_FOCUSED_ICON_COLOR}`} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notificationList.map(({ content, createdAt }, index) => (
          <View style={styles.infoList} key={index}>
            <View style={styles.infoWrap}>
              <Text style={styles.infoText}>{content}</Text>
              <Text style={[styles.infoText, styles.infoTime]}>
                {timeAgo(new Date(createdAt).getTime())}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
