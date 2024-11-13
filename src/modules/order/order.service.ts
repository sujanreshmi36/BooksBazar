import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { orderEntity } from 'src/model/order.entity';
import { orderItemEntity } from 'src/model/order_item.entity';
import { userEntity } from 'src/model/user.entity';
import { Repository, DataSource } from 'typeorm';
import { BookStatus, orderStatus } from 'src/helper/types/index.type';
import { bookEntity } from 'src/model/book.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(orderEntity)
    private readonly orderRepository: Repository<orderEntity>,

    @InjectRepository(orderItemEntity)
    private readonly orderItemRepository: Repository<orderItemEntity>,

    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,

    @InjectRepository(bookEntity)
    private readonly bookRepository: Repository<bookEntity>,
    private dataSource: DataSource,
  ) { }

  async create(id: string, createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { shipping_address, orderItem, phone } = createOrderDto;

      // Find the customer
      const customer = await this.userRepository.findOne({ where: { id } });
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Create a new order
      const order = new orderEntity();
      order.user = customer;
      order.status = orderStatus.pending;
      order.shipping_address = shipping_address;
      order.phone = phone;
      // Save the order
      await queryRunner.manager.save(order);

      // Create and save order items
      const orderItems = await Promise.all(
        orderItem.map(async (item) => {
          // Fetch the book entity by ID
          const book = await this.bookRepository.findOne({
            where: { id: item.bookId, status: BookStatus.Available },
          });
          if (!book) {
            throw new Error(`Book with ID ${item.bookId} not found`);
          }

          // Create order item and set relationships
          const orderItem = new orderItemEntity();
          orderItem.book = book;
          orderItem.price = item.price;
          orderItem.order = order; // Set the order relationship
          return orderItem;
        }),
      );

      // Save the order items
      const savedOrderItems = await queryRunner.manager.save(orderItems);

      // Commit the transaction
      await queryRunner.commitTransaction();
      return { success: true, orderId: order.id };
    } catch (error) {
      console.error(error);

      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      return { success: false, msg: 'Unable to place order' };
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
  // 2. Get Order by ID
  async findOne(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'orderItem', 'orderItem.book'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(id: string) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (user) {
      const category = await this.userRepository.findOne
    }

  }

  // Method to mark order as completed and change book status to 'Sold'
  async completeOrder(orderId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the order by ID
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['orderItems', 'orderItems.book'],
      });
      if (!order) throw new NotFoundException('Order not found');

      // Check if order is already completed
      if (order.status === orderStatus.completed) {
        throw new BadRequestException('Order is already completed');
      }

      // Update order status to 'Completed'
      order.status = orderStatus.completed;
      await queryRunner.manager.save(order);

      // Change the status of each ordered book to 'Sold'
      for (const item of order.orderItems) {
        const book = item.book;
        if (book && book.status !== BookStatus.Sold) {
          book.status = BookStatus.Sold; // Mark book as 'Sold'
          await queryRunner.manager.save(book); // Save the updated book status
          console.log(`Book with ID ${book.id} has been marked as sold`);
        }
      }

      // Commit the transaction
      await queryRunner.commitTransaction();
      return { success: true, msg: 'Order completed and books marked as sold successfully' };

    } catch (error) {
      console.error(error);
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      return { success: false, msg: 'Unable to complete order and mark books as sold' };
    } finally {
      await queryRunner.release();
    }
  }


  async getOrders(id: string) {
    const book = await this.userRepository.find({ where: {} })

  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
  async remove(id: string) {
    await this.orderRepository.delete({ id });
    return true;
  }
}
