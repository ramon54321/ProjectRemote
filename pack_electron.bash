#!/usr/bin/env bash

rm -rf dist/client
npm --prefix mods/electron install
npm run build
electron-packager mods/electron remote --out dist/client --overwrite

mkdir -p dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/client
cp -r mods/client/dist dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/client
mkdir -p dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/shared
cp -r mods/shared/dist dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/shared
mkdir -p dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/core
cp -r mods/core/dist dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/core
mkdir -p dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/networking
cp -r mods/networking/dist dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/networking
mkdir -p dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/events
cp -r mods/events/dist dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/events
mkdir -p dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/serialization
cp -r mods/serialization/dist dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/serialization
mkdir -p dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/sync
cp -r mods/sync/dist dist/client/remote-darwin-x64/remote.app/Contents/Resources/app/mods/sync
