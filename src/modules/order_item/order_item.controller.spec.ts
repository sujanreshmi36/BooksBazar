import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order_item.controller';
import { OrderItemService } from './order_item.service';

describe('OrderItemController', () => {
  let controller: OrderItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [OrderItemService],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
