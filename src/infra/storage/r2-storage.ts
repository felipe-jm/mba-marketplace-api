import {
  Uploader,
  UploadParams,
} from "@/domain/marketplace/application/storage/uploader";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class R2Storage implements Uploader {
  private readonly client: S3Client;

  constructor(private readonly envService: EnvService) {
    const accountId = this.envService.get("CLOUDFLARE_ACCOUNT_ID");
    const accessKeyId = this.envService.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.envService.get("AWS_SECRET_ACCESS_KEY");

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com/nest-clean`,
      region: "auto",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.envService.get("AWS_BUCKET"),
      Key: uniqueFileName,
      ContentType: fileType,
      Body: body,
    });

    await this.client.send(command);

    return {
      url: uniqueFileName,
    };
  }
}
