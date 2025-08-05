# Acompanhante API

API REST em TypeScript para o sistema de acompanhante virtual da UFF.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Express.js** - Framework web minimalista
- **Cors** - Middleware para habilitar CORS
- **Helmet** - Middleware de segurança
- **Morgan** - Logger de requisições HTTP

## 📋 Funcionalidades

- Endpoints Hello World
- Gestão básica de usuários (demonstração)
- Endpoint de verificação de saúde
- Tratamento de erros
- Middleware de segurança
- Tipagem TypeScript completa

## 🔗 Endpoints Disponíveis

### Gerais

- `GET /` - Mensagem Hello World
- `GET /hello/:name` - Saudação personalizada (nome é opcional)
- `GET /health` - Verificação de saúde e tempo de atividade

### API

- `GET /api/users` - Buscar todos os usuários
- `POST /api/users` - Criar um novo usuário (requer name e email no body)
- `GET /api/location` - Buscar todas as localizações
- `GET /api/location/:id` - Buscar localização específica por ID
- `POST /api/location` - Registrar nova localização (requer id, coordinates e timestamp)

## 🛠️ Instalação

1. Navegue até o diretório do projeto:

   ```bash
   cd acompanhante-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## ▶️ Executando a Aplicação

### Modo Desenvolvimento (com auto-restart e TypeScript)

```bash
npm run dev
```

### Compilar TypeScript

```bash
npm run build
```

### Modo Produção (após build)

```bash
npm start
```

### Cliente Mock (para testes)

Para simular envio automático de localizações:

```bash
# Usar configuração padrão
npm run mock

# Especificar ID do usuário
npm run mock user-123

# Com intervalo personalizado (em ms)
npm run mock user-123 2000
```

O cliente mock enviará uma requisição POST por segundo (ou intervalo especificado) com coordenadas que variam automaticamente.

O servidor iniciará em `http://localhost:3000`

## 🧪 Testando a API

### Usando curl:

```bash
# Hello World
curl http://localhost:3000/

# Saudação personalizada
curl http://localhost:3000/hello/Gabriel

# Buscar todos os usuários
curl http://localhost:3000/api/users

# Criar um novo usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Gabriel", "email": "gabriel@example.com"}'

# Buscar todas as localizações
curl http://localhost:3000/api/location

# Buscar localização por ID
curl http://localhost:3000/api/location/user-001

# Registrar nova localização
curl -X POST http://localhost:3000/api/location \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user-003",
    "coordinates": {
      "latitude": -22.906847,
      "longitude": -43.172896
    },
    "timestamp": "2025-08-04T10:30:00.000Z"
  }'

# Verificação de saúde
curl http://localhost:3000/health
```

### Exemplos de Resposta

**GET /**

```json
{
	"message": "Acompanhante Virtual API - Hello World!",
	"timestamp": "2025-08-04T10:00:00.000Z",
	"version": "1.0.0"
}
```

**POST /api/users**

```json
{
	"message": "Usuário criado com sucesso",
	"data": {
		"id": 1722768000000,
		"name": "Gabriel",
		"email": "gabriel@example.com",
		"createdAt": "2025-08-04T10:00:00.000Z"
	},
	"timestamp": "2025-08-04T10:00:00.000Z"
}
```

**POST /api/location**

```json
{
	"message": "Localização registrada com sucesso",
	"data": {
		"id": "user-003",
		"coordinates": {
			"latitude": -22.906847,
			"longitude": -43.172896
		},
		"timestamp": "2025-08-04T10:30:00.000Z",
		"createdAt": "2025-08-04T10:30:05.000Z"
	},
	"timestamp": "2025-08-04T10:30:05.000Z"
}
```

**GET /api/location**

```json
{
	"message": "Localizações recuperadas com sucesso",
	"data": [
		{
			"id": "user-001",
			"coordinates": {
				"latitude": -22.906847,
				"longitude": -43.172896
			},
			"timestamp": "2025-08-04T10:30:00.000Z",
			"createdAt": "2025-08-04T10:30:05.000Z"
		}
	],
	"timestamp": "2025-08-04T10:30:05.000Z"
}
```

## 📁 Estrutura do Projeto

```
acompanhante-api/
├── src/
│   └── index.ts          # Arquivo principal da aplicação
├── dist/                 # Arquivos compilados (gerado após build)
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
└── README.md             # Este arquivo
```

## 📦 Dependências

### Produção

- **express**: Framework web para Node.js
- **cors**: Middleware para habilitar CORS
- **helmet**: Middleware de segurança
- **morgan**: Logger de requisições HTTP

### Desenvolvimento

- **typescript**: Compilador TypeScript
- **@types/express**: Tipos TypeScript para Express
- **@types/cors**: Tipos TypeScript para CORS
- **@types/morgan**: Tipos TypeScript para Morgan
- **@types/node**: Tipos TypeScript para Node.js
- **ts-node-dev**: Execução e restart automático para desenvolvimento
- **nodemon**: Monitor de arquivos para desenvolvimento
- **rimraf**: Utilitário para limpeza de diretórios

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia em modo desenvolvimento com auto-restart
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia a aplicação compilada
- `npm run clean` - Remove o diretório dist
- `npm run dev:watch` - Alternativa de desenvolvimento com nodemon

## 🛡️ Recursos de Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configuração de Cross-Origin Resource Sharing
- **Validação de entrada**: Validação básica de dados de entrada
- **Tratamento de erros**: Middleware global de tratamento de erros

## 🤖 Cliente Mock para Testes

O projeto inclui um cliente mock que simula o envio automático de coordenadas GPS para facilitar testes.

### Características do Mock:

- 📍 **Localização simulada**: Coordenadas próximas à UFF (Rio de Janeiro)
- 🔄 **Envio automático**: Uma requisição por segundo (configurável)
- 📊 **Variação realista**: Coordenadas variam ~100 metros a cada envio
- 📈 **Estatísticas**: Mostra progresso e status em tempo real
- ⚠️ **Tratamento de erros**: Lida com falhas de conexão graciosamente

### Como usar:

1. **Inicie o servidor da API:**

   ```bash
   npm run dev
   ```

2. **Em outro terminal, execute o mock:**

   ```bash
   # Cliente básico
   npm run mock

   # Cliente com ID customizado
   npm run mock "usuario-001"

   # Cliente com intervalo de 500ms
   npm run mock "usuario-001" 500
   ```

3. **Para parar o mock:**
   - Pressione `Ctrl+C`

### Exemplo de saída do mock:

```
🚀 Cliente Mock inicializado para usuário: mock-user-001
📡 Endpoint alvo: http://localhost:3001/api/location
🔍 Verificando se o servidor está rodando...
✅ Servidor está online!

🎬 Iniciando envio automático de localizações...
⏱️ Intervalo: 1000ms (1s)

📍 Enviando localização #1: { id: 'mock-user-001', lat: -22.906123, lng: -43.172456 }
✅ Sucesso #1: Localização registrada com sucesso
📊 Status: 10 requisições enviadas
```
