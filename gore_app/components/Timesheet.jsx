import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const TimeSheet = ({ tasks }) => {
  // Convert a time in "hours:minutes" format to "Xh Ym" format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours}h ${minutes}m`;
  };

  // Calculate total time by summing the duration of each task
  const calculateTotalTime = () => {
    let totalHours = 0;
    let totalMinutes = 0;

    tasks.forEach(task => {
      const [hours, minutes] = task.time.split(':').map(Number);
      totalHours += hours;
      totalMinutes += minutes;
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return `${totalHours}h ${totalMinutes}m`;
  };

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Start</Text>
        <Text style={styles.headerCell}>Finish</Text>
        <Text style={styles.headerCell}>Time</Text>
        <Text style={styles.headerCell}>Job</Text>
        <Text style={styles.headerCell}>Plant</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.startTime}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.startTime}</Text>
            <Text style={styles.cell}>{item?.finishTime}</Text>
            <Text style={styles.cell}>TODO</Text>
            <Text style={styles.cell}>{item.jobNo}</Text>
            <Text style={styles.cell}>{item.plant}</Text>
          </View>
        )}
      />

      {/* Total Time Row */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel} colSpan={2}>Total Time</Text>
        <Text style={styles.totalValue}>TODO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderTopWidth: 2,
    borderColor: '#ddd',
  },
  totalLabel: {
    flex: 2,  // Span across two columns
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalValue: {
    flex: 3, // Span remaining columns
    textAlign: 'center',
    color: '#333',
  },
});

export default TimeSheet;
