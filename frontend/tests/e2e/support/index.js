//import './commands'

import './actions/dash'
import './actions/login'

// desabilitando screen quando da falha, deixando para todos os cenários
Cypress.Screenshot.defaults({
    screenshotOnRunFailure: false
})

afterEach(() => {
    cy.screenshot()
})

const addContext = require('mochawesome/addContext')

Cypress.on('test:after:run', (test) => {
    const shotFileName = `${test.title} -- after each hook.png`
    addContext({test}, `assets/screenshots/${Cypress.spec.name}/${shotFileName}`)
})