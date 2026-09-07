import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { IAuthenticatedUser } from '../../../common/decorators/current-user.decorator.js';
import { ApiMessage } from '../../../common/decorators/api-message.decorator.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';
import { UpdateContactDto } from '../dto/update-contact.dto.js';
import { ContactsService } from '../services/contacts.service.js';

@ApiTags('Opportunity Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opportunities/:opportunityId/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiMessage('Opportunity contacts retrieved successfully')
  findAll(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.contactsService.findAllForOpportunity(user.id, opportunityId);
  }

  @Post()
  @ApiMessage('Contact created successfully')
  create(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreateContactDto,
  ) {
    return this.contactsService.create(user.id, opportunityId, dto);
  }

  @Patch(':contactId')
  @ApiMessage('Contact updated successfully')
  update(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('contactId') contactId: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(user.id, opportunityId, contactId, dto);
  }

  @Delete(':contactId')
  @HttpCode(HttpStatus.OK)
  @ApiMessage('Contact deleted successfully')
  remove(
    @CurrentUser() user: IAuthenticatedUser,
    @Param('opportunityId') opportunityId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.contactsService.remove(user.id, opportunityId, contactId);
  }
}
