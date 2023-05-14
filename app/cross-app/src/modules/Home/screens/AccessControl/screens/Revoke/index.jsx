import React, { useState, useEffect } from "react";
import styles from "../styles";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import doctorApi from "@src/api/doctor";
import patientApi from "@src/api/patient";
import { useSelector, useDispatch } from "react-redux";
import { showAlertMessage } from "@src/utils/alert";
import { update } from "@src/app/slices/authSlice";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorageService from "@src/services/AsyncStorageService";
import notificationApi from "@src/api/notification";

export default function Revoke() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState({
    tableHead: ["ID", "NAME", "ACTION"],
    tableData: [],
  });
  const [refreshing, setRefreshing] = React.useState(false);

  const sendNotification = async (patientId, doctorName) => {
    let content = `You has been revoked access control EHRs from doctor ${doctorName}`;
    await notificationApi.createNotification({
      patientId,
      content,
    });
  };

  const fetchListDoctor = async () => {
    try {
      setIsLoading(true);
      const [res1, res2] = await Promise.all([
        doctorApi.getDoctorsByHospitalId(1),
        doctorApi.getDoctorsByHospitalId(2),
      ]);

      const listDoctor = [...res1.data, ...res2.data]
        .filter((doctor) => user.permissionGranted.includes(doctor.id))
        .map((doctor) => [
          doctor.id,
          `${doctor.firstName} ${doctor.lastName}`,
          "",
        ]);
      const newTableData = { ...tableData };
      newTableData.tableData = listDoctor;
      setTableData(newTableData);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchListDoctor();
    setRefreshing(false);
  }, []);

  const handleRevoke = async (doctorId, doctorName) => {
    try {
      setIsLoading(true);
      await Promise.allSettled([
        patientApi.revokeAccessFromDoctor(user.patientId, doctorId, {
          proof: user.proof,
        }),
        sendNotification(user.patientId, doctorName),
      ]);
      const permissionGranted = user.permissionGranted.filter(
        (doctor) => doctor !== doctorId
      );
      const newUser = { ...user, permissionGranted };
      await AsyncStorageService.setUser(newUser);
      dispatch(update(newUser));
      setIsLoading(false);
    } catch (error) {
      showAlertMessage("Error", "An error has been occur!");
      console.log("error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListDoctor();
  }, [user]);

  return (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        overlayColor="rgba(0, 0, 0, 0.8)"
        textStyle={styles.spinnerTextStyle}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Table borderStyle={styles.tableBorder}>
          <Row
            data={tableData.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {tableData.tableData.length === 0 ? (
            <TableWrapper style={styles.row}>
              <Cell textStyle={styles.text} data="No Data"></Cell>
            </TableWrapper>
          ) : (
            tableData.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    data={
                      cellIndex != 2 ? (
                        cellData
                      ) : (
                        <View style={styles.btnWrap}>
                          <TouchableOpacity
                            onPress={() => handleRevoke(rowData[0], rowData[1])}
                          >
                            <View style={[styles.btn, styles.btnReject]}>
                              <Text style={styles.btnText}>X</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )
                    }
                    textStyle={styles.text}
                  />
                ))}
              </TableWrapper>
            ))
          )}
        </Table>
      </ScrollView>
    </View>
  );
}
