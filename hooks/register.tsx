import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const byDuration = atom({ plugin: 'tps-meter', key: 'byDuration' } as const, {})

// Time counts from the moment each model request is sent until its reply ends: the wait for the first
// token, thinking, retries and API-run tools included. Tool runs between requests are not the model's time.
export const formatTps = (tokens: number, ms: number) =>
  ms > 0 && tokens > 0 ? `${Math.round((tokens * 1000) / ms)} tok/s` : undefined

// Only recent turns' closing lines are on screen; older entries would pile up in plugin state forever.
const MAX_TURNS = 200
export const keepLast = <T,>(m: Record<string, T>, n: number) =>
  Object.fromEntries(Object.entries(m).slice(-n))

export const register: Register = on => {
  on('session.start', ($, e, next) => {
    $.ui.status(undefined) // clears the status entry the first version left behind
    return next(e)
  })

  const turns = new Map<string, { tokens: number; ms: number }>()

  on('turn.step', async function* ($, e, next) {
    if (e.agentId !== undefined) return yield* next(e) // main thread only

    const start = await $.clock.now()
    let end: number | undefined
    const stream = next(e)
    for await (const chunk of stream) {
      if (chunk.kind === 'stop') end = await $.clock.now()
      yield chunk
    }
    const result = await stream.result
    if (end !== undefined) {
      const t = turns.get(e.turnId) ?? { tokens: 0, ms: 0 }
      turns.set(e.turnId, { tokens: t.tokens + (result.usage?.output_tokens ?? 0), ms: t.ms + end - start })
    }
    return result
  })

  on('turn.complete', async ($, e, next) => {
    const t = turns.get(e.turnId)
    turns.delete(e.turnId)
    const text = e.agentId === undefined && t ? formatTps(t.tokens, t.ms) : undefined
    // The closing line carries the same durationMs, so it is the key back to this turn.
    if (text) await update($, byDuration, m => keepLast({ ...m, [String(e.durationMs)]: text }, MAX_TURNS))
    return next(e)
  })

  on('ui.render', { component: 'TurnDuration' }, async ($, e, next) => {
    const text = (await read($, byDuration))[String(e.props.durationMs)]
    // The engine draws this line as one sealed block that fills the row, so anything placed beside it
    // lands at the far right. Rewriting its word keeps it on the left: "Worked (64 tok/s) for 3s · done …".
    return next(text ? { ...e, props: { ...e.props, word: `${e.props.word} (${text})` } } : e)
  })
}
