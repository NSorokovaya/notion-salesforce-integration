import { MAX_RETRIES, RETRY_DELAY } from '../constants';
import { delay } from './utils';

export async function retryWithDelay<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delayDuration: number = RETRY_DELAY,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(
        `Retrying in ${delayDuration / 1000} seconds... (${retries} retries left)`,
      );

      await delay(delayDuration);
      return retryWithDelay(fn, retries - 1, delayDuration);
    } else {
      throw error;
    }
  }
}
