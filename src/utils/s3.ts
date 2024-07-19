import CONFIG from "../config/env";
import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  endpoint: CONFIG.CONTABO_STORAGE_BUCKET_URL,
  accessKeyId: CONFIG.CONTABO_STORAGE_BUCKET_ACCESS_KEY,
  secretAccessKey: CONFIG.CONTABO_STORAGE_BUCKET_SECRET_KEY,
  s3BucketEndpoint: true,
});
