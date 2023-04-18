import React from "react";
import { Alert } from "react-native";

export const showAlertMessage = (title = 'Message', msg = 'An error has been occur') => Alert.alert(title, msg);
