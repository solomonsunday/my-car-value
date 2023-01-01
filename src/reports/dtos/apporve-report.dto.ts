import { IsBoolean, IsString } from 'class-validator';

export class ApproveReportDto {
  @IsBoolean()
  approved: boolean;
}
