import logger from '$lib/logger';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	/*logger.info('Loading page server');
	// Teszt error naplózás stack trace-vel
	try {
		throw new Error('Teszt hiba a +page.server.ts-ben');
	} catch (error) {
		logger.error('Hiba történt a load függvényben', error);
	}*/
	return { params };
};
