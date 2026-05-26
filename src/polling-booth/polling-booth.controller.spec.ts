import { Test, TestingModule } from '@nestjs/testing';
import { PollingBoothController } from './polling-booth.controller';
import { PollingBoothService } from './polling-booth.service';

describe('PollingBoothController', () => {
  let controller: PollingBoothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollingBoothController],
      providers: [PollingBoothService],
    }).compile();

    controller = module.get<PollingBoothController>(PollingBoothController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
