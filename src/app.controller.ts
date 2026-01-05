import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@Public()
@ApiTags('admin')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns a hello message in the selected language' })
  @ApiQuery({ name: 'lang', required: false, description: 'Language code (en, zh, es)' })
  getHello(@I18n() i18n: I18nContext): string {
    return i18n.t('common.hello', { args: { name: 'World' } });
  }

  @Get('welcome')
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message in the selected language' })
  @ApiQuery({ name: 'lang', required: false, description: 'Language code (en, zh, es)' })
  getWelcome(@I18n() i18n: I18nContext): string {
    return i18n.t('common.welcome');
  }

  @Get('info')
  @ApiOperation({ summary: 'Get language info' })
  @ApiResponse({
    status: 200,
    description: 'Returns language information',
    schema: {
      example: {
        welcome: 'Welcome',
        language: 'Language',
        currentLang: 'en'
      }
    }
  })
  @ApiQuery({ name: 'lang', required: false, description: 'Language code (en, zh, es)' })
  getInfo(@I18n() i18n: I18nContext) {
    return {
      welcome: i18n.t('common.welcome'),
      language: i18n.t('common.language'),
      currentLang: i18n.lang,
    };
  }
}
