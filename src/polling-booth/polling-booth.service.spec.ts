import { Test, TestingModule } from '@nestjs/testing';
import { PollingBoothService } from './polling-booth.service';

describe('PollingBoothService', () => {
  let service: PollingBoothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollingBoothService],
    }).compile();

    service = module.get<PollingBoothService>(PollingBoothService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
