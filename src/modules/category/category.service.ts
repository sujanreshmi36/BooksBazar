import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { categoryEntity } from 'src/model/category.entity';
import { userEntity } from 'src/model/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(categoryEntity)
    private categoryRepo: Repository<categoryEntity>,
    @InjectRepository(userEntity)
    private userRepo: Repository<userEntity>,
  ) {}

  async create(id: string, createCategoryDto: CreateCategoryDto) {
    const admin = await this.userRepo.findOne({ where: { id } });

    const existingCategory = await this.categoryRepo.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException('This category is already added');
    }
    // Create and save the new category
    const category = new categoryEntity();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.user = admin;
    const savedCategory = await this.categoryRepo.save(category);

    return {
      message: 'Category added successfully.',
      data: savedCategory,
    };
  }

  async findAll() {
    return await this.categoryRepo.find();
  }



  // async findOne(id: string) {
  //   const category = await this.categoryRepo.findOne({ where: { id } });
  //   return category;
  // }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    const updatedCategory = Object.assign(category, updateCategoryDto);
    return await this.categoryRepo.save(updatedCategory);
  }

  async remove(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    return await this.categoryRepo.remove(category);
  }
}
