import React from "react";
import styles from "../styles";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";

const data = {
  tableHead: ["ID", "NAME", "ACTION"],
  tableData: [
    ["doctor123", "yeu nau an", ""],
  ],
};

export default function Revoke() {
  const handlePress = () => {
    console.log("press");
  };
  return (
    <View style={styles.container}>
      <Table borderStyle={styles.tableBorder}>
        <Row
          data={data.tableHead}
          style={styles.head}
          textStyle={styles.text}
        />
        {data.tableData.map((rowData, index) => (
          <TableWrapper key={index} style={styles.row}>
            {rowData.map((cellData, cellIndex) => (
              <Cell
                key={cellIndex}
                data={
                  cellIndex != 2 ? (
                    cellData
                  ) : (
                    <View style={styles.btnWrap}>
                      <TouchableOpacity onPress={handlePress}>
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
        ))}
      </Table>
    </View>
  );
}
