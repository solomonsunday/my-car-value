import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user-decorator';
import { User } from 'src/users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsDto } from './dtos/reports.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportsDto)
  createReports(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }
}
