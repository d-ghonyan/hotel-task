import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAssigneeContext } from '../contexts/AssigneeContext';
import { useHotelContext } from '../contexts/HotelContext';
import { Task } from '../contexts/TaskContext';
import Dropdown, { DropdownItem } from './Dropdown';

interface NewTaskPopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: TaskData) => void;
  initialData?: Task | null;
  isEditing?: boolean;
}

interface TaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  duration: string;
  assigneeId: string | null;
  hotelRoomId: string;
}

export default function NewTaskPopup({
  visible,
  onClose,
  onSave,
  initialData,
  isEditing = false
}: NewTaskPopupProps) {
  const { assignees } = useAssigneeContext();
  const { getHotelRoomsDropdownItems } = useHotelContext();

  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    duration: '',
    assigneeId: null,
    hotelRoomId: '',
  });

  const setEmptyTaskData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      duration: '',
      assigneeId: null,
      hotelRoomId: '',
    });
  };

  const assigneeItems: DropdownItem[] = assignees.map(assignee => ({
    id: assignee.id,
    label: assignee.name,
    subtitle: assignee.email,
  }));

  const hotelRoomItems = getHotelRoomsDropdownItems();

  useEffect(() => {
    if (initialData && isEditing) {
      setTaskData({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        dueDate: initialData.dueDate,
        duration: initialData.duration,
        assigneeId: initialData.assigneeId,
        hotelRoomId: initialData.hotelRoomId || '',
      });
    } else {
      setEmptyTaskData();
    }
  }, [initialData, isEditing, visible]);

  const handleSave = () => {
    if (!taskData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!taskData.hotelRoomId) {
      Alert.alert('Error', 'Please select a hotel room');
      return;
    }

    onSave(taskData);
    setEmptyTaskData();
    onClose();
  };

  const handleCancel = () => {
    setEmptyTaskData();
    onClose();
  };

  const fillWithDummyData = () => {
    const dummyData: TaskData = {
      title: 'Clean Room 101',
      description: 'A loooooooooooong task description to test the UIIIIIIIIIIII',
      priority: 'high',
      dueDate: '2024-12-25',
      duration: '2 hours',
      assigneeId: assigneeItems.length > 0 ? assigneeItems[0].id : null,
      hotelRoomId: hotelRoomItems.length > 0 ? hotelRoomItems[0].id : '',
    };
    setTaskData(dummyData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Task' : 'Add New Task'}
            </Text>
            {!isEditing && (
              <TouchableOpacity
                style={styles.dummyDataButton}
                onPress={fillWithDummyData}
              >
                <Text style={styles.dummyDataButtonText}>Fill Dummy</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={taskData.title}
                onChangeText={(text) => setTaskData({ ...taskData, title: text })}
                placeholder="Enter task title"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={taskData.description}
                onChangeText={(text) => setTaskData({ ...taskData, description: text })}
                placeholder="Enter task description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hotel Room *</Text>
              <Dropdown
                value={taskData.hotelRoomId}
                onSelect={(hotelRoomId: string | null) => setTaskData({ ...taskData, hotelRoomId: hotelRoomId || '' })}
                items={hotelRoomItems}
                placeholder="Select hotel room"
                title="Select Hotel Room"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assignee</Text>
              <Dropdown
                value={taskData.assigneeId}
                onSelect={(assigneeId: string | null) => setTaskData({ ...taskData, assigneeId })}
                items={assigneeItems}
                placeholder="Select assignee (optional)"
                title="Select Assignee"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      taskData.priority === priority && styles.priorityButtonActive,
                    ]}
                    onPress={() => setTaskData({ ...taskData, priority })}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        taskData.priority === priority && styles.priorityTextActive,
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={taskData.dueDate}
                onChangeText={(text) => setTaskData({ ...taskData, dueDate: text })}
                placeholder="YYYY-MM-DD (optional)"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration</Text>
              <TextInput
                style={styles.input}
                value={taskData.duration}
                onChangeText={(text) => setTaskData({ ...taskData, duration: text })}
                placeholder="Enter task duration"
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update Task' : 'Save Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    flex: 1,
  },
  form: {},
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityText: {
    fontSize: 14,
    color: '#666',
  },
  priorityTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dummyDataButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  dummyDataButtonText: {
    fontSize: 14,
    color: '#666',
  },
});
