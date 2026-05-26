import { Test, TestingModule } from '@nestjs/testing';
import { ConstituencyService } from './constituency.service';

describe('ConstituencyService', () => {
  let service: ConstituencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstituencyService],
    }).compile();

    service = module.get<ConstituencyService>(ConstituencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
