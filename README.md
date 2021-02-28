---
stylesheet: https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css
body_class: markdown-body
highlight_style: github-gist
css: |-
  .page-break { page-break-after: always; }
  .markdown-body { font-size: 11px; }
  .markdown-body pre > code { white-space: pre-wrap; }
pdf_options:
  format: A5
  margin: 6mm
  printBackground: true
---

# Overview

This project serves as a base for a tick based system, meaning the system logic is computed on each tick at an interval. It also provides modules for commonly needed abstractions in a networked client/server architecture.

The project is divided into modules, located in the `mods` folder. Mods are intended to be as generic as possible, with as few dependencies on other mods as possible, with the exception of implementation specific mods, currently being `core`, `shared`, `client` and `server`.

#### Core

The `core` module contains the actual tick logic implementation, altering the passed in `NetworkState` instance.

The `core` implementation is exposed to the outside world through the `LogicCore` interface in the `shared` module.

```typescript
interface LogicCore {
  open(): void
  close(): void
  tick(tickNumber: number): void
}
```

#### Server

The `server` is the wrapper around the `core` which exposes it to the network and passes in the instances of `NetworkState` and `NetServer`. It also manages states of client communication, obtained from the `state-machine` module.

#### Client

The `client` module instantiates an instance of `NetClient` and `NetworkState` and ensures synchronization with the `NetServer` instance. The `client` is also responsible for outputting the `NetworkState` to the user.

#### Shared

The `shared` module is a common set of tools and interfaces used by the other modules to aid type safety and integration between modules.

# Gameplay

#### Key Points
 - Economy
 - Research
 - Diplomacy
 - Defense