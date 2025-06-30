import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Task, useTaskContext } from '../contexts/TaskContext';
import NewTaskPopup from './NewTaskPopup';
import TaskItem from './TaskItem';

export default function TaskList() {
  const { state, toggleTask, deleteTask, updateTask } = useTaskContext();
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditPopupVisible(true);
  };

  const handleSaveEdit = (taskData: any) => {
    if (editingTask) {
      updateTask({
        ...editingTask,
        ...taskData,
      });
      setIsEditPopupVisible(false);
      setEditingTask(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditPopupVisible(false);
    setEditingTask(null);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={toggleTask}
      onDelete={deleteTask}
      onEdit={handleEditTask}
    />
  );

  if (state.tasks.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>Nothing to see here</Text>
        <Text style={styles.emptyStateSubtext}>
          Tap the + button to add your first task
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={state.tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      />

      <NewTaskPopup
        visible={isEditPopupVisible}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        initialData={editingTask}
        isEditing={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});