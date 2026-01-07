import { ApiProperty } from '@nestjs/swagger';

export class MultiLanguageText implements Record<string, string> {
  @ApiProperty({ example: 'Dashboard', description: 'English text' })
  en: string;

  @ApiProperty({ example: 'ផ្ទាំងគ្រប់គ្រង', description: 'Khmer text' })
  kh: string;

  [key: string]: string;
}
