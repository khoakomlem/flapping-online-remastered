export async function retry(
  fn: () => any,
  options: { retries?: number; delay?: number }
) {
  const defaultOptions = {
    retries: 5,
    delay: 0,
  };

  const { retries, delay } = { ...defaultOptions, ...options };

  try {
    if (fn.constructor.name === 'AsyncFunction') {
      await fn();
    } else {
      fn();
    }
  } catch (e) {
    console.error(e);
    if (retries > 0) {
      setTimeout(() => {
        retry(fn, { retries: retries - 1, delay }).catch(() => {});
      }, delay);
    }
  }
}
