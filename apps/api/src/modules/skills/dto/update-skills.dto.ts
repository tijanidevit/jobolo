import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class SkillItemDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  skill: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  proficiency: number;
}

export class UpdateSkillsDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ArrayUnique((item: SkillItemDto) => item.skill.trim().toLowerCase())
  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  skills: SkillItemDto[];
}
