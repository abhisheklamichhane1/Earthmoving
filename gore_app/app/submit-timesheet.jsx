import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SubmitTimesheetScreen = () => {
  const [campAllowance, setCampAllowance] = useState('No');
  const [nightShift, setNightShift] = useState('No');
  const [comments, setComments] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [totalTime, setTotalTime] = useState('');

  // Function to get the current day and date
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(date);
  };

  // Calculate total time between start and finish time
  const calculateTotalTime = (startTime, finishTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const finish = new Date(`1970-01-01T${finishTime}`);
    const diffMs = finish - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  // Update the total time on component mount
  useEffect(() => {
    getCurrentDate();
    const startTime = '06:00';
    const finishTime = '17:30';
    setTotalTime(calculateTotalTime(startTime, finishTime));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Instructions */}
      <Text style={styles.instructions}>
        Finished for the day. Please complete the questions below and, if necessary, add any further comments. Then press
        the "Submit Timesheet" button above to submit this day’s timesheet.
      </Text>

      {/* Live Day Information */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>DAY: {currentDate}</Text>
      </View>

      {/* Time Entry Section */}
      <View style={styles.timeEntryContainer}>
        <Text style={styles.sectionTitle}>Time Entry</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeField}>
            <Text style={styles.label}>Start Time:</Text>
            <Text style={styles.value}>6:00am</Text>
          </View>
          <View style={styles.timeField}>
            <Text style={styles.label}>Finish Time:</Text>
            <Text style={styles.value}>5:30pm</Text>
          </View>
          <View style={styles.timeField}>
            <Text style={styles.label}>Total Time:</Text>
            <Text style={styles.value}>{totalTime}</Text>
          </View>
        </View>
      </View>

      {/* Eligibility Section */}
      <View style={styles.eligibilityContainer}>
        <Text style={styles.sectionTitle}>Eligibility</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Eligible for Camp Allowance</Text>
          <Picker
            selectedValue={campAllowance}
            onValueChange={(itemValue) => setCampAllowance(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="No" value="No" />
            <Picker.Item label="Yes" value="Yes" />
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Night Shift</Text>
          <Picker
            selectedValue={nightShift}
            onValueChange={(itemValue) => setNightShift(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="No" value="No" />
            <Picker.Item label="Yes" value="Yes" />
          </Picker>
        </View>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsContainer}>
        <Text style={styles.sectionTitle}>Comments</Text>
        <TextInput
          style={styles.textArea}
          value={comments}
          onChangeText={setComments}
          placeholder="Add any additional notes here..."
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Timesheet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f4f6f8',
  },
  instructions: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d6efd',
    textAlign: 'center',
  },
  timeEntryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderColor: '#ced4da',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeField: {
    alignItems: 'flex-start',
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    color: '#495057',
  },
  value: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
    marginTop: 4,
  },
  eligibilityContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderColor: '#ced4da',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  picker: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    color: '#212529',
  },
  commentsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderColor: '#ced4da',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  textArea: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#212529',
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#0d6efd',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SubmitTimesheetScreen;
