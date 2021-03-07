#!/usr/bin/env bash

rm -rf dist/electron
npm run build
npm --prefix mods/electron install
electron-packager mods/electron remote --out dist/electron --overwrite

mkdir -p dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/client
cp -r mods/client/dist dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/client
mkdir -p dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/shared
cp -r mods/shared/dist dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/shared
mkdir -p dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/core
cp -r mods/core/dist dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/core
mkdir -p dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/networking
cp -r mods/networking/dist dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/networking
mkdir -p dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/events
cp -r mods/events/dist dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/events
mkdir -p dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/serialization
cp -r mods/serialization/dist dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/serialization
mkdir -p dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/sync
cp -r mods/sync/dist dist/electron/remote-darwin-x64/remote.app/Contents/Resources/app/mods/sync
