import { Module } from "@nestjs/common";
import { APP_GUARD, APP_FILTER } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtExceptionFilter } from "./jwt-exception.filter";
import { EnvService } from "../env/env.service";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get("JWT_PRIVATE_KEY");
        const publicKey = env.get("JWT_PUBLIC_KEY");

        return {
          signOptions: {
            algorithm: "RS256",
            expiresIn: "15m", // Token de acesso com expiração curta
          },
          privateKey: Buffer.from(privateKey, "base64"),
          publicKey: Buffer.from(publicKey, "base64"),
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter,
    },
  ],
})
export class AuthModule {}
