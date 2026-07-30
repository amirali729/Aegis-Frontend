export class NetworkError extends Error {
  constructor(message = "Unable to reach the server. Check your connection.") {
    super(message);
    this.name = "NetworkError";
  }
}