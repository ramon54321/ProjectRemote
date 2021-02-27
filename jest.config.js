module.exports = {
  roots: [
    'mods/core/src',
    'mods/server/src',
    'mods/client/src',
    'mods/events/src',
    'mods/networking/src',
    'mods/serialization/src',
    'mods/shared/src',
    'mods/sync/src',
    'mods/state-machine/src',
  ],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
