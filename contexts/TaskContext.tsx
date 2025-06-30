import React, { createContext, ReactNode, useContext, useReducer } from 'react';

export interface Task {
	id: string;
	title: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	dueDate: string;
	duration: string;
	assigneeId: string | null;
	hotelRoomId: string;
	completed: boolean;
	createdAt: Date;
}

interface TaskState {
	tasks: Task[];
	loading: boolean;
}

type TaskAction =
	| { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'completed' | 'createdAt'> }
	| { type: 'TOGGLE_TASK'; payload: string }
	| { type: 'DELETE_TASK'; payload: string }
	| { type: 'UPDATE_TASK'; payload: Task }
	| { type: 'SET_LOADING'; payload: boolean };

const initialState: TaskState = {
	tasks: [],
	loading: false,
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
	switch (action.type) {
		case 'ADD_TASK':
			const newTask: Task = {
				...action.payload,
				id: Date.now().toString(),
				completed: false,
				createdAt: new Date(),
			};
			return {
				...state,
				tasks: [...state.tasks, newTask],
			};

		case 'TOGGLE_TASK':
			return {
				...state,
				tasks: state.tasks.map(task =>
					task.id === action.payload
						? { ...task, completed: !task.completed }
						: task
				),
			};

		case 'DELETE_TASK':
			return {
				...state,
				tasks: state.tasks.filter(task => task.id !== action.payload),
			};

		case 'UPDATE_TASK':
			return {
				...state,
				tasks: state.tasks.map(task =>
					task.id === action.payload.id ? action.payload : task
				),
			};

		case 'SET_LOADING':
			return {
				...state,
				loading: action.payload,
			};

		default:
			return state;
	}
}

interface TaskContextType {
	state: TaskState;
	addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
	toggleTask: (id: string) => void;
	deleteTask: (id: string) => void;
	updateTask: (task: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
	children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
	const [state, dispatch] = useReducer(taskReducer, initialState);

	const addTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
		dispatch({ type: 'ADD_TASK', payload: task });
	};

	const toggleTask = (id: string) => {
		dispatch({ type: 'TOGGLE_TASK', payload: id });
	};

	const deleteTask = (id: string) => {
		dispatch({ type: 'DELETE_TASK', payload: id });
	};

	const updateTask = (task: Task) => {
		dispatch({ type: 'UPDATE_TASK', payload: task });
	};

	const value: TaskContextType = {
		state,
		addTask,
		toggleTask,
		deleteTask,
		updateTask,
	};

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
	const context = useContext(TaskContext);
	if (context === undefined) {
		throw new Error('useTaskContext must be used within a TaskProvider');
	}
	return context;
} 