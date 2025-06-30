import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DropdownItem } from '../components/Dropdown';

export interface Hotel {
	id: string;
	name: string;
	address: string;
	city: string;
	country: string;
}

export interface Room {
	id: string;
	hotelId: string;
	number: string;
	type: string;
	floor: string;
	capacity: number;
}

export interface HotelRoom {
	id: string;
	label: string;
	subtitle: string;
	hotelId: string;
	roomId: string;
}

interface HotelContextType {
	hotels: Hotel[];
	rooms: Room[];
	hotelRooms: HotelRoom[];
	getHotelRoomsDropdownItems: () => DropdownItem[];
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const initialHotels: Hotel[] = [
	{
		id: '1',
		name: 'Grand Plaza Hotel',
		address: '123 Main Street',
		city: 'New York',
		country: 'USA',
	},
	{
		id: '2',
		name: 'Seaside Resort',
		address: '456 Beach Road',
		city: 'Miami',
		country: 'USA',
	},
	{
		id: '3',
		name: 'Mountain View Lodge',
		address: '789 Mountain Drive',
		city: 'Denver',
		country: 'USA',
	},
];

const initialRooms: Room[] = [
	{ id: '1', hotelId: '1', number: '101', type: 'Standard', floor: '1', capacity: 2 },
	{ id: '2', hotelId: '1', number: '102', type: 'Standard', floor: '1', capacity: 2 },
	{ id: '3', hotelId: '1', number: '201', type: 'Deluxe', floor: '2', capacity: 3 },
	{ id: '4', hotelId: '1', number: '202', type: 'Deluxe', floor: '2', capacity: 3 },
	{ id: '5', hotelId: '1', number: '301', type: 'Suite', floor: '3', capacity: 4 },

	{ id: '6', hotelId: '2', number: 'A101', type: 'Ocean View', floor: '1', capacity: 2 },
	{ id: '7', hotelId: '2', number: 'A102', type: 'Ocean View', floor: '1', capacity: 2 },
	{ id: '8', hotelId: '2', number: 'B201', type: 'Premium Suite', floor: '2', capacity: 4 },
	{ id: '9', hotelId: '2', number: 'B202', type: 'Premium Suite', floor: '2', capacity: 4 },

	{ id: '10', hotelId: '3', number: 'Cabin 1', type: 'Rustic', floor: '1', capacity: 2 },
	{ id: '11', hotelId: '3', number: 'Cabin 2', type: 'Rustic', floor: '1', capacity: 2 },
	{ id: '12', hotelId: '3', number: 'Lodge 1', type: 'Family', floor: '1', capacity: 6 },
];

interface HotelProviderProps {
	children: ReactNode;
}

export function HotelProvider({ children }: HotelProviderProps) {
	const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
	const [rooms, setRooms] = useState<Room[]>(initialRooms);

	const getHotelRoomsDropdownItems = (): DropdownItem[] => {
		return rooms.map(room => {
			const hotel = hotels.find(h => h.id === room.hotelId);
			return {
				id: `${hotel?.id}-${room.id}`,
				label: `${hotel?.name} - Room ${room.number}`,
				subtitle: `${room.type} • Floor ${room.floor} • ${room.capacity} guests`,
			};
		});
	};

	const value: HotelContextType = {
		hotels,
		rooms,
		hotelRooms: [],
		getHotelRoomsDropdownItems,
	};

	return (
		<HotelContext.Provider value={value}>
			{children}
		</HotelContext.Provider>
	);
}

export function useHotelContext() {
	const context = useContext(HotelContext);
	if (context === undefined) {
		throw new Error('useHotelContext must be used within a HotelProvider');
	}
	return context;
} 