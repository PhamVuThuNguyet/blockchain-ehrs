import React from "react";
import {
  TextInput,
  View,
  Image,
  TouchableNativeFeedback,
  Text,
} from "react-native";
import styles from "./styles";
import COLORS from "@src/constants/colors";
import { showAlertMessage } from "@src/utils/alert";

const logo = {
  uri: "https://res.cloudinary.com/htphong02/image/upload/v1681573975/EHRs/logo_mhtefa.png",
};

const itemList = ["Profile", "Requests", "Access", "History"];

export default function Home() {

  const handleOnPress = () => {
    console.log('press');
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logoImg} source={logo} />
      <View style={styles.itemList}>
        {itemList.map((item, index) => (
          <TouchableNativeFeedback key={index} onPress={handleOnPress}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          </TouchableNativeFeedback>
        ))}
      </View>
    </View>
  );
}
