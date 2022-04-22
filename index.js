import { picker } from './module/litepicker.js'
import { createCard, handleListener } from './module/card.js'

picker()

const litepicker = document.querySelector('#litepicker')

litepicker.addEventListener('DOMSubtreeModified', createCard)

handleListener()

