import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {
	User,
	ApiResponse,
	ErrorResponse,
	HealthResponse,
	CreateUserRequest,
	LocationData,
	CreateLocationRequest,
} from './types';

const app = express();
const PORT = process.env.PORT || 3002;

// In-memory storage for locations (in production, use a database)
const locationStorage: Map<string, LocationData[]> = new Map();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic hello world route
app.get('/', (req: Request, res: Response) => {
	const response: ApiResponse = {
		message: 'Acompanhante Virtual API - Hello World!',
		timestamp: new Date().toISOString(),
		version: '1.0.0',
	};
	res.json(response);
});

// Hello endpoint with optional name parameter
app.get('/hello/:name?', (req: Request, res: Response) => {
	const name = req.params.name || 'World';
	const response: ApiResponse = {
		message: `Olá, ${name}!`,
		timestamp: new Date().toISOString(),
	};
	res.json(response);
});

// GET endpoint to retrieve all users (demo)
app.get('/api/users', (req: Request, res: Response) => {
	const users: User[] = [
		{ id: 1, name: 'João Silva', email: 'joao@example.com' },
		{ id: 2, name: 'Maria Santos', email: 'maria@example.com' },
	];

	const response: ApiResponse<User[]> = {
		message: 'Usuários recuperados com sucesso',
		data: users,
		timestamp: new Date().toISOString(),
	};

	res.json(response);
});

// POST endpoint to create a new user (demo)
app.post('/api/users', (req: Request, res: Response) => {
	const { name, email }: CreateUserRequest = req.body;

	if (!name || !email) {
		const errorResponse: ErrorResponse = {
			error: 'Dados inválidos',
			message: 'Nome e email são obrigatórios',
			timestamp: new Date().toISOString(),
		};
		return res.status(400).json(errorResponse);
	}

	const newUser: User = {
		id: Date.now(),
		name,
		email,
		createdAt: new Date().toISOString(),
	};

	const response: ApiResponse<User> = {
		message: 'Usuário criado com sucesso',
		data: newUser,
		timestamp: new Date().toISOString(),
	};

	res.status(201).json(response);
});

// POST endpoint to receive location data
app.post('/api/location', (req: Request, res: Response) => {
	const { id, coordinates, timestamp }: CreateLocationRequest = req.body;

	// Validação dos dados obrigatórios
	if (!id || !coordinates || !timestamp) {
		const errorResponse: ErrorResponse = {
			error: 'Dados inválidos',
			message: 'ID, coordenadas e timestamp são obrigatórios',
			timestamp: new Date().toISOString(),
		};
		return res.status(400).json(errorResponse);
	}

	// Validação das coordenadas
	if (
		typeof coordinates.latitude !== 'number' ||
		typeof coordinates.longitude !== 'number'
	) {
		const errorResponse: ErrorResponse = {
			error: 'Coordenadas inválidas',
			message: 'Latitude e longitude devem ser números',
			timestamp: new Date().toISOString(),
		};
		return res.status(400).json(errorResponse);
	}

	// Validação dos valores de latitude e longitude
	if (
		coordinates.latitude < -90 ||
		coordinates.latitude > 90 ||
		coordinates.longitude < -180 ||
		coordinates.longitude > 180
	) {
		const errorResponse: ErrorResponse = {
			error: 'Coordenadas fora do intervalo válido',
			message: 'Latitude deve estar entre -90 e 90, longitude entre -180 e 180',
			timestamp: new Date().toISOString(),
		};
		return res.status(400).json(errorResponse);
	}

	// Criar objeto de localização
	const locationData: LocationData = {
		id,
		coordinates: {
			latitude: coordinates.latitude,
			longitude: coordinates.longitude,
		},
		timestamp,
		createdAt: new Date().toISOString(),
	};

	// Salvar localização no armazenamento em memória
	if (!locationStorage.has(id)) {
		locationStorage.set(id, []);
	}
	locationStorage.get(id)!.push(locationData);

	// Log da nova localização
	console.log('📍 Nova localização recebida:', locationData);

	const response: ApiResponse<LocationData> = {
		message: 'Localização registrada com sucesso',
		data: locationData,
		timestamp: new Date().toISOString(),
	};

	res.status(201).json(response);
});

// GET endpoint to retrieve location data
app.get('/api/location/:id?', (req: Request, res: Response) => {
	const id = req.params.id;

	if (id) {
		// Buscar localizações específicas por ID
		const userLocations = locationStorage.get(id);

		if (!userLocations || userLocations.length === 0) {
			const errorResponse: ErrorResponse = {
				error: 'Localização não encontrada',
				message: `Nenhuma localização encontrada para o ID: ${id}`,
				timestamp: new Date().toISOString(),
			};
			return res.status(404).json(errorResponse);
		}

		// Retornar a localização mais recente
		const latestLocation = userLocations[userLocations.length - 1];

		const response: ApiResponse<LocationData> = {
			message: `Localização mais recente encontrada para ${id}`,
			data: latestLocation,
			timestamp: new Date().toISOString(),
		};

		res.json(response);
	} else {
		// Retornar todas as localizações mais recentes de todos os usuários
		const allLocations: LocationData[] = [];

		for (const [userId, locations] of locationStorage.entries()) {
			if (locations.length > 0) {
				// Adicionar a localização mais recente de cada usuário
				allLocations.push(locations[locations.length - 1]);
			}
		}

		const response: ApiResponse<LocationData[]> = {
			message: `${allLocations.length} localizações encontradas`,
			data: allLocations,
			timestamp: new Date().toISOString(),
		};

		res.json(response);
	}
});

// GET endpoint to retrieve location history for a specific user
app.get('/api/location/:id/history', (req: Request, res: Response) => {
	const id = req.params.id;
	const userLocations = locationStorage.get(id);

	if (!userLocations || userLocations.length === 0) {
		const errorResponse: ErrorResponse = {
			error: 'Histórico não encontrado',
			message: `Nenhuma localização encontrada para o ID: ${id}`,
			timestamp: new Date().toISOString(),
		};
		return res.status(404).json(errorResponse);
	}

	const response: ApiResponse<LocationData[]> = {
		message: `Histórico de ${userLocations.length} localizações para ${id}`,
		data: userLocations,
		timestamp: new Date().toISOString(),
	};

	res.json(response);
});

// SSE endpoint for real-time location updates
app.get('/api/location/:id/stream', (req: Request, res: Response) => {
	const id = req.params.id;

	// Set SSE headers
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Cache-Control',
	});

	// Send initial data if available
	const userLocations = locationStorage.get(id);
	if (userLocations && userLocations.length > 0) {
		const latestLocation = userLocations[userLocations.length - 1];
		res.write(`data: ${JSON.stringify(latestLocation)}\n\n`);
	}

	// Store original location array length to detect new updates
	let lastKnownLength = userLocations ? userLocations.length : 0;

	// Check for updates every second
	const intervalId = setInterval(() => {
		const currentLocations = locationStorage.get(id);
		if (currentLocations && currentLocations.length > lastKnownLength) {
			// New location available
			const latestLocation = currentLocations[currentLocations.length - 1];
			res.write(`data: ${JSON.stringify(latestLocation)}\n\n`);
			lastKnownLength = currentLocations.length;
		}
	}, 1000);

	// Clean up on client disconnect
	req.on('close', () => {
		clearInterval(intervalId);
		console.log(`🔌 SSE connection closed for user: ${id}`);
	});

	console.log(`📡 SSE connection established for user: ${id}`);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	const response: HealthResponse = {
		status: 'OK',
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
	};
	res.json(response);
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
	const errorResponse: ErrorResponse = {
		error: 'Rota não encontrada',
		message: `Não foi possível ${req.method} ${req.originalUrl}`,
	};
	res.status(404).json(errorResponse);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	const errorResponse: ErrorResponse = {
		error: 'Erro interno do servidor',
		message: err.message,
	};
	res.status(500).json(errorResponse);
});

app.listen(PORT, () => {
	console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
	console.log(`📋 Endpoints disponíveis:`);
	console.log(`   GET  /                     - Hello World`);
	console.log(`   GET  /hello/:name          - Saudação personalizada`);
	console.log(`   GET  /api/users            - Buscar todos os usuários`);
	console.log(`   POST /api/users            - Criar novo usuário`);
	console.log(
		`   GET  /api/location         - Buscar todas as localizações atuais`
	);
	console.log(
		`   GET  /api/location/:id     - Buscar localização atual por ID`
	);
	console.log(
		`   GET  /api/location/:id/history - Buscar histórico completo por ID`
	);
	console.log(
		`   GET  /api/location/:id/stream  - Stream SSE de localizações em tempo real`
	);
	console.log(`   POST /api/location         - Registrar nova localização`);
	console.log(`   GET  /health               - Verificação de saúde`);
	console.log(`\n📊 Armazenamento: Em memória (dados perdidos ao reiniciar)`);
});
