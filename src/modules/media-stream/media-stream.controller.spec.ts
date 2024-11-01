import { Test, TestingModule } from '@nestjs/testing';
import { MediaStreamController } from './media-stream.controller';
import { MediaStreamService } from './media-stream.service';

describe('MediaStreamController', () => {
  let controller: MediaStreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaStreamController],
      providers: [MediaStreamService],
    }).compile();

    controller = module.get<MediaStreamController>(MediaStreamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
