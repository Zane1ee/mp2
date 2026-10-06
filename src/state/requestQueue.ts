export function createRequestQueue(limit = 4) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error('Invalid concurrency limit')
  let active = 0
  const waiting: (() => void)[] = []

  function advance() {
    while (active < limit && waiting.length) {
      waiting.shift()?.()
    }
  }

  return {
    run<T>(task: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        waiting.push(() => {
          active += 1
          Promise.resolve().then(task).then(resolve, reject).finally(() => {
            active -= 1
            advance()
          })
        })
        advance()
      })
    },
  }
}
