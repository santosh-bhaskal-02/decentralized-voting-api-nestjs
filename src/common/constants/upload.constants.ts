/** Presigned URL expiry in seconds (5 minutes) */
export const PRESIGN_EXPIRY_SECONDS = 300;

/** Max file size in bytes (10 MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Allowed MIME types for upload */
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

/** S3 upload folder prefix */
export const UPLOAD_FOLDER = {
  LISTING: 'LISTING',
  PROFILE: 'PROFILE',
  KYC: 'KYC',
  BANNER: 'BANNER',
  PARTY_SYMBOL: 'PARTY_SYMBOL',
  OTHER: 'OTHER',
};
