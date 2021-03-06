import {IsAlphanumeric, IsNumberString, IsOptional} from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsNumberString()
  label: number;

  @IsOptional()
  @IsNumberString()
  subject: number;

  @IsOptional()
  @IsAlphanumeric()
  user: string;
}
