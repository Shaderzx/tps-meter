import { test, expect } from 'claude-code/testing'
import { formatTps, keepLast } from './register'

test('keeps only the newest entries', () => {
  expect(keepLast({ a: 1, b: 2, c: 3 }, 2)).toEqual({ b: 2, c: 3 })
})

test('formats tokens per second', () => {
  expect(formatTps(500, 2000)).toBe('250 tok/s')
  expect(formatTps(0, 2000)).toBe(undefined)
  expect(formatTps(100, 0)).toBe(undefined)
})
