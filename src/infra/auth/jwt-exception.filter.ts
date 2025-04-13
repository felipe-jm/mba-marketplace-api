import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { TokenExpiredError } from "@nestjs/jwt";

@Catch(UnauthorizedException, TokenExpiredError)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(
    exception: UnauthorizedException | TokenExpiredError,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = "token.invalid";

    if (exception instanceof TokenExpiredError) {
      message = "token.expired";
    } else if (exception instanceof UnauthorizedException) {
      // Check if the error came from the JWT strategy
      const exceptionResponse = exception.getResponse() as any;

      if (exceptionResponse?.message === "Unauthorized") {
        message = "token.invalid";
      }
    }

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
    });
  }
}
