import './register'
import { open } from '@client'
import { NetworkState } from '@core'

open(draw)

const body = document.body

function draw(state: NetworkState) {
  body.innerHTML = JSON.stringify(state, null, 2)
}

declare var app: any

new app.App({target: document.body, props: {name: 'John'}})
