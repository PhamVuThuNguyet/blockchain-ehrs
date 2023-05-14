import React, { useEffect, useState } from "react";
import styles from "../styles";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import patientApi from "@src/api/patient";
import requestApi from "@src/api/request";
import notificationApi from "@src/api/notification";
import { useSelector, useDispatch } from "react-redux";
import { showAlertMessage } from "@src/utils/alert";
import { update } from "@src/app/slices/authSlice";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorageService from "@src/services/AsyncStorageService";

const REQUEST_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export default function Request() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState({
    tableHead: ["ID", "NAME", "ACTION"],
    tableData: [],
  });
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchListDoctor = async () => {
    try {
      setIsLoading(true);
      const { data } = await requestApi.getRequests(user.patientId);
      const listDoctor = data.map((item) => [
        item.doctor.id,
        `${item.doctor.firstName} ${item.doctor.lastName}`,
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

  const handleUpdateRequest = async (
    patientId,
    doctorId,
    doctorName,
    status
  ) => {
    try {
      await requestApi.updateRequest({
        patientId,
        doctorId,
        status,
      });
      let content = "";
      if (status === REQUEST_STATUS.ACCEPTED) {
        content = `You has been granted access control EHRs to doctor ${doctorName}`;
      } else {
        content = `You has been rejected request to access control EHRs from doctor ${doctorName}`;
      }
      await notificationApi.createNotification({
        patientId,
        content,
      });
    } catch (error) {
      showAlertMessage("Error", "An error has been occur!");
    }
  };

  const handleGrant = async (doctorId, doctorName) => {
    try {
      setIsLoading(true);
      await Promise.allSettled([
        handleUpdateRequest(
          user.patientId,
          doctorId,
          doctorName,
          REQUEST_STATUS.ACCEPTED
        ),
        patientApi.grantAccessToDoctor(user.patientId, doctorId, {
          proof: user.proof,
        }),
      ]);
      const permissionGranted = [...user.permissionGranted, doctorId];
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
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
                            onPress={() => handleGrant(rowData[0], rowData[1])}
                          >
                            <View style={[styles.btn, styles.btnAccept]}>
                              <Text style={styles.btnText}>V</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              handleUpdateRequest(
                                user.patiendId,
                                rowData[0],
                                rowData[1],
                                REQUEST_STATUS.REJECTED
                              )
                            }
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
