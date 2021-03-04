import 'module-alias/register'
import { open } from '@client'
import { NetworkState } from '@core'

open(draw)

const body = document.body

function draw(state: NetworkState) {
  body.innerHTML = JSON.stringify(state, null, 2)
}
