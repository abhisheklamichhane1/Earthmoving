import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import TimeSheet from '@/components/Timesheet';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { dummyTasks } from '@/dummy-data';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import HomeDateTime from '@/components/HomeDateTime';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropdownMenu, { MenuOption } from '@/components/DropdownMenu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { FlatList } from 'react-native';




const fetchTodayEntries = async (userID, siteID) => {
  const { data } = await axios.get(`/TimeEntry/Today/${userID}/${siteID}`);
  return data;
};




const MainScreen = () => {
  const { userData } = useUser();
  const [currentTask, setCurrentTask] = useState(null);
  const router = useRouter();
  const [manualEntry, setManualEntry] = useState(false); // State to toggle manual entry
  const [comment, setComment] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);

  const [visible, setVisible] = useState(false);
  const [viewPastTimeSheet, setViewPastTimeSheet] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const { data: tasks, isLoading, isError, error } = useQuery({
    queryKey: ['todayEntries', userData?.userID, userData?.siteID],
    queryFn: () => fetchTodayEntries(userData?.userID, userData?.siteID),
    enabled: !!userData?.userID && !!userData?.siteID, // Fetch only if userId and siteId are provided
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (userData?.timeEntryType === 'M') {
      setManualEntry(true);
    } else {
      setManualEntry(false);
    }
  }, [userData]); // Re-run when userData changes

  const handleClockOn = () => {
    // TODO: clock off the incomplete task if any

    if (currentTask) {
      Alert.alert("Error", "Finish the current task before starting a new one.");
      return;
    }

    router.push('/time-entry?mode=clock_on');

    // const newTask = { startTime: new Date(), finishTime: null, description: 'New Task' };
    // setCurrentTask(newTask);
    // setTasks([...tasks, newTask]);
  };

  const checkUnfinishedTask = () => {
    const startTimeWithEmptyFinishTime = tasks.find(task => task.finishTime === null)?.timeSheetTasksID;

    return startTimeWithEmptyFinishTime; // Output: "16:45"
  }

  const handleClockOff = () => {
    const unfinishedTask = checkUnfinishedTask();

    if (tasks.length < 1 || !unfinishedTask) {
      Alert.alert("Info", "No task to clock off.");
      return;
    }

    router.push(`/time-entry?mode=clock_off&task=${unfinishedTask}`);
    // currentTask.finishTime = new Date();
    // setTasks([...tasks]);
    // setCurrentTask(null);
  };

  const handleAddTime = () => {
    router.push('/time-entry?mode=manual');
    const newTask = { startTime: new Date(), finishTime: new Date(), description: 'Manual Task' };
    setTasks([...tasks, newTask]);
  };

  const handleSubmitTimesheet = () => {
    Alert.alert("Timesheet Submitted", "Your timesheet has been successfully submitted.");
  };


  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text>Task: {item.description}</Text>
      <Text>Start: {item.startTime.toLocaleTimeString()}</Text>
      <Text>Finish: {item.finishTime ? item.finishTime.toLocaleTimeString() : 'In Progress'}</Text>
    </View>
  );

  const handleCommentEdit = () => {
    setIsEditingComment(true);
  };

  const handleCommentSave = () => {
    Alert.alert("Save Comment", "Do you want to save changes to your comment?", [
      {
        text: "Cancel",
        onPress: () => setIsEditingComment(false),
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => {
          // Save changes
          setIsEditingComment(false);
        }
      }
    ]);
  };

  const menuOptions = ['Past Timesheets', 'Log Out'];
  

  return (
    <SafeAreaView style={styles.container}>

     {/* Menu Button */}
     <TouchableOpacity style={styles.menuButton} onPress={toggleModal}>
        <Icon name="menu" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Menu Options */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal} // Close when clicking outside
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0.5}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={menuOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* <DropdownMenu viewPastTimeSheet={viewPastTimeSheet} setViewPastTimeSheet={setViewPastTimeSheet} /> */}

      {/* Menu Button */}
      <DropdownMenu
        visible={visible}
        handleOpen={() => setVisible(true)}
        handleClose={() => setVisible(false)}
        trigger={
          <View style={styles.triggerStyle}>
            <Text style={styles.triggerText}>Menu</Text>
          </View>
        }
      >
        <MenuOption onSelect={() => {

          setVisible(false);
        }}>
          <Text>View Details</Text>
        </MenuOption>
        <MenuOption onSelect={() => {

          setVisible(false);
        }}>
          <Text>Delete</Text>
        </MenuOption>
      </DropdownMenu>

      {/* Time Dashboard Heading */}
      <Text style={styles.heading}>Time Dashboard</Text>

      {/* Site Name */}
      <Text style={styles.siteName}>{userData?.siteName}</Text>

      {/* Operator Name */}
      <View style={styles.operatorContainer}>
        <Text style={styles.operatorText}>Operator: {userData?.displayName}</Text>
      </View>

      {/* Current Date */}
      <HomeDateTime />

      {/* Time Entry Buttons */}
      <View style={styles.buttonRow}>
        {viewPastTimeSheet ? (
          <>
            <TouchableOpacity style={[styles.button, styles.addButton]}>
              <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {manualEntry ? (
              <>
                <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddTime}>
                  <Text style={styles.buttonText}>Add Time</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmitTimesheet}>
                  <Text style={styles.buttonText}>Day Off</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.clockOnButton]}
                  onPress={handleClockOn}
                  disabled={currentTask !== null}
                >
                  <Text style={styles.buttonText}>Clock on</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.clockOffButton]}
                  onPress={handleClockOff}
                // disabled={currentTask === null}
                >
                  <Text style={styles.buttonText}>Clock off</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmitTimesheet}>
                  <Text style={styles.buttonText}>Day off</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>

      {/* Timesheet Table */}
      <TimeSheet tasks={tasks} renderTaskItem={renderTaskItem} />

      {/* Comments Section */}
      <TouchableOpacity onPress={handleCommentEdit}>
        <TextInput
          style={styles.commentBox}
          placeholder="Add comments here"
          multiline
          numberOfLines={4}
          value={comment}
          editable={isEditingComment} // Set to editable based on state
          onChangeText={setComment}
        />
      </TouchableOpacity>
      {isEditingComment && (
        <TouchableOpacity style={styles.saveButton} onPress={handleCommentSave}>
          <Text style={styles.saveButtonText}>Save Comment</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative',
  },
 menuButton: {
    position: 'absolute',
    top: 20, // Adjust for status bar
    right: 20,
    backgroundColor: '#6200ee',
    borderRadius: 50,
    padding: 10,
    elevation: 3,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: 200,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  triggerStyle: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: '',
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 16,
  },
  menuButton: {
    position: 'absolute',  // This will position it relative to the container
    top: 16,               // Adjust for distance from the top
    right: 16,             // Adjust for distance from the right
    backgroundColor: '#007BFF',
    borderRadius: 50,      // Make the button circular
    padding: 10,
    zIndex: 10,            // Ensure it's on top of other elements
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 32,         // Increased font size for prominence
    fontWeight: '700',    // Bold font weight
    marginBottom: 20,
    textAlign: 'center',
    color: '#3498db',     // Attractive blue color
  },
  siteName: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  operatorContainer: {
    padding: 12,
    backgroundColor: '#2980b9',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  operatorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  clockOnButton: {
    backgroundColor: '#2ecc71',
  },
  clockOffButton: {
    backgroundColor: '#e74c3c',
  },
  addButton: {
    backgroundColor: '#3498db',
  },
  submitButton: {
    backgroundColor: '#f39c12',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  taskItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  commentBox: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MainScreen;