const DEFAULT_DELAY_MS = 480

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Simulates a network request with optional failure for demos.
 */
export async function mockRequest(data, options = {}) {
  const {
    delayMs = DEFAULT_DELAY_MS,
    failRate = 0,
    errorMessage = 'Something went wrong. Please try again.',
  } = options

  await delay(delayMs)

  if (failRate > 0 && Math.random() < failRate) {
    throw new Error(errorMessage)
  }

  return structuredClone(data)
}
