# tps-meter

A Claude Code mod that shows how fast Claude writes. The line under each reply gets its output speed in tokens per second:

```
✻ Worked (98 tok/s) for 5s · done 3:41 PM
```

The speed counts only the time Claude is actually writing. It leaves out the wait before the first token and the time tools spend running. Subagent work is not counted.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install tps-meter --marketplace Shaderzx/tps-meter
```

Answer `y` to add the marketplace, then pick a scope.

From a shell:

```
claude plugin install tps-meter --marketplace Shaderzx/tps-meter
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `Shaderzx/tps-meter`, then Add plugin.
