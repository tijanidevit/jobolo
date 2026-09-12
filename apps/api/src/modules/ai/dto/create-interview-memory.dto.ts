import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInterviewMemoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(30000)
  sourceText: string;
}
