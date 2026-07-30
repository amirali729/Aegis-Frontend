/** Matches the backend's success envelope: { success, statusCode, message, data, timestamp } */
export interface ApiSuccessEnvelope<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/** Matches the backend's error envelope: { success, statusCode, message, timestamp } */
export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  message: string;
  timestamp: string;
}