import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import TimeSheet from "@/components/Timesheet";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import { dummyTasks } from "@/dummy-data";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import HomeDateTime from "@/components/HomeDateTime";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownMenu from "@/components/DropdownMenu";
import { useTasks } from "@/hooks/useTasks";
import ActionButtons from "@/components/ActionButtons";

const MainScreen = () => {
  const router = useRouter();
  const { userData } = useUser();
  const { tasks, viewPastTimeSheet, setViewPastTimeSheet, pastTSLoading } =
    useTasks();

  const [comment, setComment] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text>Task: {item.description}</Text>
      <Text>Start: {item.startTime.toLocaleTimeString()}</Text>
      <Text>
        Finish:{" "}
        {item.finishTime ? item.finishTime.toLocaleTimeString() : "In Progress"}
      </Text>
    </View>
  );

  const handleCommentEdit = () => {
    setIsEditingComment(true);
  };

  const handleCommentSave = () => {
    Alert.alert(
      "Save Comment",
      "Do you want to save changes to your comment?",
      [
        {
          text: "Cancel",
          onPress: () => setIsEditingComment(false),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // Save changes
            setIsEditingComment(false);
          },
        },
      ]
    );
  };

  if (pastTSLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <DropdownMenu
        viewPastTimeSheet={viewPastTimeSheet}
        setViewPastTimeSheet={setViewPastTimeSheet}
      />

      {/* <DropdownMenu viewPastTimeSheet={viewPastTimeSheet} setViewPastTimeSheet={setViewPastTimeSheet} /> */}

      {/* Time Dashboard Heading */}
      <Text style={styles.heading}>Time Dashboard</Text>

      {/* Site Name */}
      <Text style={styles.siteName}>{userData?.siteName}</Text>

      {/* Operator Name */}
      <View style={styles.operatorContainer}>
        <Text style={styles.operatorText}>
          Operator: {userData?.displayName}
        </Text>
      </View>

      {/* Current Date */}
      <HomeDateTime />

      {/* Time Entry Buttons */}
      <ActionButtons />

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
    backgroundColor: "#fff",
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    top: 20, // Adjust for status bar
    right: 20,
    backgroundColor: "#6200ee",
    borderRadius: 50,
    padding: 10,
    elevation: 3,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: 200,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  triggerStyle: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "",
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 16,
  },
  menuButton: {
    position: "absolute", // This will position it relative to the container
    top: 16, // Adjust for distance from the top
    right: 16, // Adjust for distance from the right
    backgroundColor: "#007BFF",
    borderRadius: 50, // Make the button circular
    padding: 10,
    zIndex: 10, // Ensure it's on top of other elements
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 32, // Increased font size for prominence
    fontWeight: "700", // Bold font weight
    marginBottom: 20,
    textAlign: "center",
    color: "#3498db", // Attractive blue color
  },
  siteName: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
    textAlign: "center",
    color: "#2c3e50",
  },
  operatorContainer: {
    padding: 12,
    backgroundColor: "#2980b9",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  operatorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  clockOnButton: {
    backgroundColor: "#2ecc71",
  },
  clockOffButton: {
    backgroundColor: "#e74c3c",
  },
  addButton: {
    backgroundColor: "#3498db",
  },
  submitButton: {
    backgroundColor: "#f39c12",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  taskItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  commentBox: {
    borderColor: "#bdc3c7",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#27ae60",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default MainScreen;
