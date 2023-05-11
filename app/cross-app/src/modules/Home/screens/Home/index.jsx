import React from "react";
import {
  TextInput,
  View,
  Image,
  TouchableNativeFeedback,
  Text,
} from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const logo = {
  uri: "https://res.cloudinary.com/htphong02/image/upload/v1681573975/EHRs/logo_mhtefa.png",
};

const itemList = [
  {
    key: "Profile",
    value: "Profile",
  },
  {
    key: "Requests",
    value: "Request",
  },
  {
    key: "Access",
    value: "Revoke",
  },
  {
    key: "History",
    value: "AccessHistory",
  },
];

export default function Home() {
  const navigation = useNavigation();

  const handleOnPress = (value) => {
    // navigation.(value)
    navigation.navigate(value)
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logoImg} source={logo} />
      <View style={styles.itemList}>
        {itemList.map((item, index) => (
          <TouchableNativeFeedback key={index} onPress={() => handleOnPress(item.value)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.key}</Text>
            </View>
          </TouchableNativeFeedback>
        ))}
      </View>
    </View>
  );
}
