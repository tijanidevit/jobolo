import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class SkillProfileItemDto {
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

export class UpdateSkillProfileDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ArrayUnique((item: SkillProfileItemDto) => item.skill.trim().toLowerCase())
  @ValidateNested({ each: true })
  @Type(() => SkillProfileItemDto)
  skills: SkillProfileItemDto[];
}
