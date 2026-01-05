import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@I18n() i18n: I18nContext): string {
    return i18n.t('common.hello', { args: { name: 'World' } });
  }

  @Get('welcome')
  getWelcome(@I18n() i18n: I18nContext): string {
    return i18n.t('common.welcome');
  }

  @Get('info')
  getInfo(@I18n() i18n: I18nContext) {
    return {
      welcome: i18n.t('common.welcome'),
      language: i18n.t('common.language'),
      currentLang: i18n.lang,
    };
  }
}
