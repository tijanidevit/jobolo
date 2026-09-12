import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AnalyzeJobDescriptionDto {
  @IsOptional()
  @IsString()
  @MinLength(50)
  @MaxLength(30000)
  description?: string;

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(1024)
  jobUrl?: string;
}
