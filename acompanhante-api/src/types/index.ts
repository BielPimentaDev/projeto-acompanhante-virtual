export interface User {
	id: number;
	name: string;
	email: string;
	createdAt?: string;
}

export interface ApiResponse<T = any> {
	message: string;
	data?: T;
	timestamp: string;
	version?: string;
}

export interface ErrorResponse {
	error: string;
	message: string;
	timestamp?: string;
}

export interface HealthResponse {
	status: string;
	uptime: number;
	timestamp: string;
	environment: string;
}

export interface CreateUserRequest {
	name: string;
	email: string;
}

export interface Coordinates {
	latitude: number;
	longitude: number;
}

export interface LocationData {
	id: string;
	coordinates: Coordinates;
	timestamp: string;
	createdAt?: string;
}

export interface CreateLocationRequest {
	id: string;
	coordinates: Coordinates;
	timestamp: string;
}
