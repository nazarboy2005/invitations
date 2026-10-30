// Reject independently of Chromium: closing a stuck browser is not a timeout.
export async function coverDeadline<T>(
  work: () => Promise<T>,
  milliseconds: number,
  onTimeout: () => void = () => {},
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(work),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(`Cover operation timed out after ${milliseconds}ms`),
          );
          onTimeout();
        }, milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function coverCleanup(work: () => Promise<unknown>) {
  await coverDeadline(work, 1000).catch(() => {});
}
