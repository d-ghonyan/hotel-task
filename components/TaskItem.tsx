import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAssigneeContext } from '../contexts/AssigneeContext';
import { useHotelContext } from '../contexts/HotelContext';
import { Task } from '../contexts/TaskContext';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const { assignees } = useAssigneeContext();
  const { hotels, rooms } = useHotelContext();

  const assignee = assignees.find(a => a.id === task.assigneeId);

  const getHotelRoomInfo = () => {
    if (!task.hotelRoomId) return null;

    const [hotelId, roomId] = task.hotelRoomId.split('-');
    const hotel = hotels.find(h => h.id === hotelId);
    const room = rooms.find(r => r.id === roomId);

    if (!hotel || !room) return null;

    return {
      hotel,
      room,
      displayName: `${hotel.name} - Room ${room.number}`,
      subtitle: `${room.type} • Floor ${room.floor}`,
    };
  };

  const hotelRoomInfo = getHotelRoomInfo();

  return (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text
            style={[
              styles.taskTitle,
              task.completed && styles.completedTask,
            ]}
          >
            {task.title}
          </Text>
          <View style={styles.headerActions}>
            <View style={[styles.priorityBadge, styles[`priority${task.priority}`]]}>
              <Text style={styles.priorityText}>
                {task.priority.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {task.description && (
          <Text
            style={[
              styles.taskDescription,
              task.completed && styles.completedTask,
            ]}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.taskFooter}>
          <View style={styles.taskInfo}>
            {hotelRoomInfo && (
              <View style={styles.hotelRoomContainer}>
                <View style={styles.hotelRoomIcon}>
                  <Text style={styles.hotelRoomIconText}>🏨</Text>
                </View>
                <View style={styles.hotelRoomDetails}>
                  <Text style={styles.hotelRoomName}>{hotelRoomInfo.displayName}</Text>
                  <Text style={styles.hotelRoomSubtitle}>{hotelRoomInfo.subtitle}</Text>
                </View>
              </View>
            )}

            {assignee && (
              <View style={styles.assigneeContainer}>
                <View style={styles.assigneeAvatar}>
                  <Text style={styles.assigneeAvatarText}>
                    {assignee.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.assigneeName}>{assignee.name}</Text>
              </View>
            )}
          </View>

          <View style={styles.taskMeta}>
            {task.duration && (
              <Text style={styles.duration}>
                Duration: {task.duration}
              </Text>
            )}
            {task.dueDate && (
              <Text style={styles.dueDate}>
                Due: {task.dueDate}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.taskMeta}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              task.completed ? styles.statusCompleted : styles.statusPending,
            ]}
            onPress={() => onToggle(task.id)}
          >
            <Text style={styles.statusButtonText}>
              {task.completed ? 'Done' : 'In Progress'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
  },
  taskContent: {
    flex: 1,
    gap: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  taskInfo: {
    flex: 1,
  },
  hotelRoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hotelRoomIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  hotelRoomIconText: {
    fontSize: 14,
  },
  hotelRoomDetails: {
    flex: 1,
  },
  hotelRoomName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  hotelRoomSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  assigneeAvatarText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  assigneeName: {
    fontSize: 12,
    color: '#666',
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  prioritylow: {
    backgroundColor: '#4CAF50',
  },
  prioritymedium: {
    backgroundColor: '#FF9800',
  },
  priorityhigh: {
    backgroundColor: '#F44336',
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 14,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  duration: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    minWidth: 50,
  },
  statusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FF9800',
  },
});
