import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const error = exception.getResponse();

        const logger = new Logger();
        logger.error(exception.message);

        response
            .status(status || 500)
            .json({
                success: false,
                statusCode: status || 500,
                message: error,
                error: exception.message,
                // stack: exception.stack,
                // timestamp: new Date().toISOString(),
            });
    }
}