import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesModule } from '../opportunities/opportunities.module.js';
import { Contact } from './entities/contact.entity.js';
import { ContactsController } from './controllers/contacts.controller.js';
import { ContactsRepository } from './repositories/contacts.repository.js';
import { ContactsService } from './services/contacts.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), OpportunitiesModule],
  controllers: [ContactsController],
  providers: [ContactsRepository, ContactsService],
})
export class ContactsModule {}
