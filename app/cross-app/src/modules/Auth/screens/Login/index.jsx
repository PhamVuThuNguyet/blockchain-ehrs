import React, { useState, useRef, useContext } from "react";
import {
  TextInput,
  View,
  Image,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import styles from "./styles";
import COLORS from "@src/constants/colors";
import { showAlertMessage } from '@src/utils/alert';
import { login } from '@src/app/slices/authSlice';
import { useDispatch } from 'react-redux';

const logo = {
  uri: "https://res.cloudinary.com/htphong02/image/upload/v1681573975/EHRs/logo_mhtefa.png",
};
export default function Login() {
  const dispatch = useDispatch();

  const [username, onChangeUserName] = useState("");
  const [password, onChangePassword] = useState("");

  const inputRef = useRef(null);

  const handleOnPress = () => {
    if(!username) {
      showAlertMessage('Error', 'Input your username');
      return;
    };
    if(!password) {
      showAlertMessage('Error', 'Input your password');
      return;
    };
    // AsyncStorageService.setToken({
    //   accessToken: '',
    //   user: { username, password },
    // });
    dispatch(login({ username, password }));
  }

  const handleInputFocus = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Image style={styles.logoImg} source={logo} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={username}
          placeholder="Username"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT_COLOR}
          onChangeText={onChangeUserName}
          onFocus={handleInputFocus}
        />

        <TextInput
          ref={inputRef}
          style={styles.input}
          secureTextEntry={true}
          value={password}
          placeholder="Password"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT_COLOR}
          onChangeText={onChangePassword}
          onFocus={handleInputFocus}
        />

        <View style={styles.forgotPassLabelWrap}>
          <Text style={styles.forgotPassLabel}>Forgot Password</Text>
        </View>

        <TouchableNativeFeedback onPress={handleOnPress}>
          <View style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>LOG IN NOW</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </KeyboardAvoidingView>
  );
}
