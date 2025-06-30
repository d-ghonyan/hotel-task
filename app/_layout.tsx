import { Stack } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import NewTaskPopup from "../components/NewTaskPopup";
import { AssigneeProvider } from "../contexts/AssigneeContext";
import { HotelProvider } from "../contexts/HotelContext";
import { TaskProvider, useTaskContext } from "../contexts/TaskContext";

function RootLayoutContent() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { addTask } = useTaskContext();

  const handleSaveTask = (taskData: any) => {
    addTask(taskData);
    console.log("New task added:", taskData);
  };

  return (
    <>
      <Stack
        screenOptions={{
          title: "Hotel Tasks",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsPopupVisible(true)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#007AFF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                +
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <NewTaskPopup
        visible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onSave={handleSaveTask}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <HotelProvider>
      <AssigneeProvider>
        <TaskProvider>
          <RootLayoutContent />
        </TaskProvider>
      </AssigneeProvider>
    </HotelProvider>
  );
}
