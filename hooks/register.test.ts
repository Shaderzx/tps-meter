import { test, expect } from 'claude-code/testing'
import { formatTps } from './register'

test('formats tokens per second', () => {
  expect(formatTps(500, 2000)).toBe('250 tok/s')
  expect(formatTps(0, 2000)).toBe(undefined)
  expect(formatTps(100, 0)).toBe(undefined)
})
