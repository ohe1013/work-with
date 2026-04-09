type PromiseStatus = "pending" | "fulfilled" | "rejected";

type UsePromise<T> = Promise<T> & {
  status?: PromiseStatus;
  value?: T;
  reason?: unknown;
};

export function use<T>(promise: UsePromise<T>) {
  if (promise.status === "fulfilled") {
    return promise.value;
  } else if (promise.status === "rejected") {
    throw promise.reason;
  } else if (promise.status === "pending") {
    throw promise;
  } else {
    promise.status = "pending";
    promise.then(
      (result: T) => {
        promise.status = "fulfilled";
        promise.value = result;
      },
      (reason: unknown) => {
        promise.status = "rejected";
        promise.reason = reason;
      }
    );
    throw promise;
  }
}
