import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const i18n = I18nContext.current(host);

    let status: number;
    let message: string;

    // Handle HttpException (NestJS exceptions)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const rawMessage = (exceptionResponse as any).message;

        // For validation errors, join array messages
        if (Array.isArray(rawMessage)) {
          message = rawMessage.join(', ');
        } else {
          message = this.translateMessage(i18n, rawMessage);
        }
      } else if (typeof exceptionResponse === 'string') {
        message = this.translateMessage(i18n, exceptionResponse);
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // Unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = i18n?.t('common.serverError') || 'Internal server error';

      // Log the full error for debugging
      this.logger.error(
        `Unexpected error: ${exception.message}`,
        exception.stack,
      );
    } else {
      // Unknown error type
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = i18n?.t('common.serverError') || 'Internal server error';
    }

    const errorResponse = {
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private translateMessage(i18n: I18nContext | undefined, message: string): string {
    // If message looks like an i18n key, try to translate it
    if (i18n && message.includes('.')) {
      const translated = i18n.t(message) as string;
      // Only return translated if it's different from the key (was actually found)
      if (translated !== message) {
        return translated;
      }
    }
    return message;
  }
}
