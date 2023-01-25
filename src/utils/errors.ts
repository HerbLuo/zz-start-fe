export const TippedError = new Error("the error is tipped.");
export const LoggedError = new Error("the error is logged.");
export class DevError extends Error {
  constructor(message?: string | undefined, options?: ErrorOptions | undefined) {
    super(message, options);
  }
}
