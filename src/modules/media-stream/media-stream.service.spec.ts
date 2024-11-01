import { Test, TestingModule } from '@nestjs/testing';
import { MediaStreamService } from './media-stream.service';

describe('MediaStreamService', () => {
  let service: MediaStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaStreamService],
    }).compile();

    service = module.get<MediaStreamService>(MediaStreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
