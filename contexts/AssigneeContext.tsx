import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Assignee {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
}

interface AssigneeContextType {
	assignees: Assignee[];
}

const AssigneeContext = createContext<AssigneeContextType | undefined>(undefined);

const initialAssignees: Assignee[] = [
	{
		id: '1',
		name: 'Test 1',
		email: 'test1@example.com',
	},
	{
		id: '2',
		name: 'Test 2',
		email: 'test2@example.com',
	},
	{
		id: '3',
		name: 'Test 3',
		email: 'test3@example.com',
	},
	{
		id: '4',
		name: 'Test 4',
		email: 'test4@example.com',
	},
	{
		id: '5',
		name: 'Another Test',
		email: 'test5@example.com',
	},
];

interface AssigneeProviderProps {
	children: ReactNode;
}

export function AssigneeProvider({ children }: AssigneeProviderProps) {
	const [assignees, setAssignees] = useState<Assignee[]>(initialAssignees);

	const value: AssigneeContextType = {
		assignees,
	};

	return (
		<AssigneeContext.Provider value={value}>
			{children}
		</AssigneeContext.Provider>
	);
}

export function useAssigneeContext() {
	const context = useContext(AssigneeContext);
	if (context === undefined) {
		throw new Error('useAssigneeContext must be used within an AssigneeProvider');
	}
	return context;
} 