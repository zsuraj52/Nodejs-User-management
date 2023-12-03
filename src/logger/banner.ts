import logger from './logger';

export function banner(log: typeof logger): void {
    log.info('-------------------------------------------------------');
    log.info(`Yeah! 🤟, Your App Is Ready For Work. `);
    log.info('-------------------------------------------------------');
    log.info(``);
    log.info(`To Close, Press < CTRL > + C | < CTRL > + Z At Any Time`);
    log.info('-------------------------------------------------------');
    log.info(``);
    log.info(`Environment  : Local Environment`);
    log.info(`Version      : 1.0.0`);
    log.info(`API Base Url : http://localhost:3000`);
    log.info(``);
    log.info('-------------------------------------------------------');
    log.info(`----------------------Thank You------------------------`);
    console.log("");
}