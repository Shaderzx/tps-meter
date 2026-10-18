import { test, expect } from 'claude-code/testing'
import { formatTps, serverToolMs, keepLast } from './register'

test('subtracts server tool time inside the stream window only', () => {
  expect(serverToolMs([], 0, 1000)).toBe(0)
  expect(serverToolMs([{ startedAt: 200, endedAt: 500 }], 0, 1000)).toBe(300)
  expect(serverToolMs([{ startedAt: -100, endedAt: 100 }, { startedAt: 900 }], 0, 1000)).toBe(200)
})

test('keeps only the newest entries', () => {
  expect(keepLast({ a: 1, b: 2, c: 3 }, 2)).toEqual({ b: 2, c: 3 })
})

test('formats tokens per second', () => {
  expect(formatTps(500, 2000)).toBe('250 tok/s')
  expect(formatTps(0, 2000)).toBe(undefined)
  expect(formatTps(100, 0)).toBe(undefined)
})
