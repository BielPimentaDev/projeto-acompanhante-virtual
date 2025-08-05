import axios from 'axios';
import { MOCK_CONFIG } from './mock-config';

class LocationMockClient {
	private intervalId: NodeJS.Timeout | null = null;
	private requestCount = 0;
	private isRunning = false;

	constructor(private userId: string = MOCK_CONFIG.USER_ID) {
		console.log(`🚀 Cliente Mock inicializado para usuário: ${this.userId}`);
		console.log(`📡 Endpoint alvo: ${MOCK_CONFIG.API_BASE_URL}/api/location`);
	}

	// Gera coordenadas aleatórias próximas à base
	private generateRandomCoordinates() {
		const latVariation =
			(Math.random() - 0.5) * 2 * MOCK_CONFIG.COORDINATE_VARIATION;
		const lngVariation =
			(Math.random() - 0.5) * 2 * MOCK_CONFIG.COORDINATE_VARIATION;

		return {
			latitude: MOCK_CONFIG.BASE_COORDINATES.latitude + latVariation,
			longitude: MOCK_CONFIG.BASE_COORDINATES.longitude + lngVariation,
		};
	}

	// Envia uma requisição de localização
	private async sendLocationRequest() {
		try {
			const coordinates = this.generateRandomCoordinates();
			const timestamp = new Date().toISOString();

			const payload = {
				id: this.userId,
				coordinates,
				timestamp,
			};

			console.log(`📍 Enviando localização #${this.requestCount + 1}:`, {
				id: payload.id,
				lat: coordinates.latitude.toFixed(6),
				lng: coordinates.longitude.toFixed(6),
				time: timestamp,
			});

			const response = await axios.post(
				`${MOCK_CONFIG.API_BASE_URL}/api/location`,
				payload,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					timeout: MOCK_CONFIG.REQUEST_TIMEOUT,
				}
			);

			this.requestCount++;
			console.log(`✅ Sucesso #${this.requestCount}:`, response.data.message);
		} catch (error: any) {
			console.error('❌ Erro ao enviar localização:', {
				message: error?.message || 'Erro desconhecido',
				status: axios.isAxiosError(error) ? error.response?.status : 'N/A',
				data: axios.isAxiosError(error) ? error.response?.data : null,
			});
		}
	}

	// Inicia o envio automático de localizações
	public start() {
		if (this.isRunning) {
			console.log('⚠️ Cliente mock já está rodando!');
			return;
		}

		console.log('🎬 Iniciando envio automático de localizações...');
		console.log(
			`⏱️ Intervalo: ${MOCK_CONFIG.REQUEST_INTERVAL}ms (${
				MOCK_CONFIG.REQUEST_INTERVAL / 1000
			}s)`
		);
		console.log('Press Ctrl+C to stop\n');

		this.isRunning = true;

		// Enviar primeira requisição imediatamente
		this.sendLocationRequest();

		// Configurar intervalo para envios subsequentes
		this.intervalId = setInterval(() => {
			this.sendLocationRequest();
		}, MOCK_CONFIG.REQUEST_INTERVAL);
	}

	// Para o envio automático
	public stop() {
		if (!this.isRunning) {
			console.log('⚠️ Cliente mock não está rodando!');
			return;
		}

		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		this.isRunning = false;
		console.log(
			`\n🛑 Cliente mock parado. Total de requisições enviadas: ${this.requestCount}`
		);
	}

	// Status do cliente
	public getStatus() {
		return {
			isRunning: this.isRunning,
			requestCount: this.requestCount,
			userId: this.userId,
			interval: MOCK_CONFIG.REQUEST_INTERVAL,
		};
	}
}

// Função principal para executar o mock
async function main() {
	console.log('🔧 Acompanhante Virtual - Cliente Mock de Localização\n');

	// Verificar se o servidor está rodando
	try {
		console.log('🔍 Verificando se o servidor está rodando...');
		await axios.get(`${MOCK_CONFIG.API_BASE_URL}/health`);
		console.log('✅ Servidor está online!\n');
	} catch (error) {
		console.error('❌ Erro: Servidor não está rodando!');
		console.error(
			'   Certifique-se de que o servidor está rodando na porta 3001'
		);
		console.error('   Execute: npm run dev\n');
		process.exit(1);
	}

	// Criar e iniciar o cliente mock
	const mockClient = new LocationMockClient();

	// Tratamento de sinais para parar graciosamente
	process.on('SIGINT', () => {
		console.log('\n🔄 Sinal de interrupção recebido...');
		mockClient.stop();
		process.exit(0);
	});

	process.on('SIGTERM', () => {
		console.log('\n🔄 Sinal de terminação recebido...');
		mockClient.stop();
		process.exit(0);
	});

	// Iniciar o cliente
	mockClient.start();

	// Mostrar status a cada 10 segundos
	setInterval(() => {
		const status = mockClient.getStatus();
		console.log(`📊 Status: ${status.requestCount} requisições enviadas`);
	}, MOCK_CONFIG.STATS_INTERVAL);
}

// Executar apenas se este arquivo for chamado diretamente
if (require.main === module) {
	main().catch((error) => {
		console.error('💥 Erro fatal:', error);
		process.exit(1);
	});
}

export { LocationMockClient };
