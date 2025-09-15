// src/lib/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
	// Naplózási szint: 'info' éles környezetben, 'debug' fejlesztéshez
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	// Formátum: időbélyeg + JSON
	format: winston.format.combine(
		winston.format.errors({ stack: true }), // Ez biztosítja, hogy az error stack trace is naplózva legyen
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.json(),
		winston.format.prettyPrint()
	),
	// Alapértelmezett metaadatok
	defaultMeta: { service: 'sveltekit-app' },
	// Transzportok (hova kerüljenek a naplók)
	transports: [
		// Konzol kimenet (fejlesztéshez hasznos)
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.simple())
		}),
		// Error log fájlba
		new winston.transports.DailyRotateFile({
			filename: 'logs/%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d'
		})
	]
});

// Hibakezelés, ha a naplózás meghiúsul
logger.on('error', (error) => {
	console.error('Naplózási hiba:', error);
});

export default logger;
