declare module 'claude-code' {
  interface PluginState {
    // turn duration in ms -> "62 tok/s", the key the TurnDuration line also carries
    'tps-meter': { byDuration: Record<string, string> }
  }
}

export type TpsByDuration = Record<string, string>
