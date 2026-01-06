import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T = any> {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: T;
}
