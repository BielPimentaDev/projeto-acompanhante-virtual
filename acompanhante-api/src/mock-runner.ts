#!/usr/bin/env node

/**
 * Script simples para executar o cliente mock
 * Uso: npm run mock [USER_ID] [INTERVAL_MS]
 */

import { LocationMockClient } from './mock-client';
import { MOCK_CONFIG } from './mock-config';

// Obter argumentos da linha de comando
const args = process.argv.slice(2);
const userId = args[0] || MOCK_CONFIG.USER_ID;
const intervalMs = parseInt(args[1]) || MOCK_CONFIG.REQUEST_INTERVAL;

console.log('🚀 Iniciando cliente mock com configurações:');
console.log(`   👤 User ID: ${userId}`);
console.log(`   ⏱️  Intervalo: ${intervalMs}ms\n`);

// Criar e iniciar cliente
const client = new LocationMockClient(userId);

// Tratamento de sinais
process.on('SIGINT', () => {
	console.log('\n👋 Encerrando cliente mock...');
	client.stop();
	process.exit(0);
});

// Iniciar cliente
client.start();
