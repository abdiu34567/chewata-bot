import { Telegraf } from 'telegraf';

describe('YeneHealth Bot', () => {
    it('should start the bot', () => {
        const bot = new Telegraf('TEST_BOT_TOKEN');
        expect(bot).toBeDefined();
    });
});
