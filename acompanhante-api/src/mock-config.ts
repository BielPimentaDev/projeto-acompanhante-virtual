// Configuração do cliente mock
export const MOCK_CONFIG = {
	// URL base da API
	API_BASE_URL: 'http://localhost:3002',

	// ID do usuário para o mock
	USER_ID: 'mock-user-001',

	// Intervalo entre requisições em milissegundos
	REQUEST_INTERVAL: 1000, // 1 segundo

	// Coordenadas base (Rio de Janeiro - UFF)
	BASE_COORDINATES: {
		latitude: -22.906847,
		longitude: -43.172896,
	},

	// Variação máxima nas coordenadas (aproximadamente 100 metros)
	COORDINATE_VARIATION: 0.001,

	// Timeout para requisições HTTP
	REQUEST_TIMEOUT: 5000, // 5 segundos

	// Intervalo para mostrar estatísticas
	STATS_INTERVAL: 10000, // 10 segundos
};

export default MOCK_CONFIG;
