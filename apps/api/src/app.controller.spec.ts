import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('check', () => {
    it('should return health status', () => {
      const result = appController.check();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('service', 'jobolo-api');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
