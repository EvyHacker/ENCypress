
/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
//import 'cypress-iframe'
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY_hh_mm')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY_hh_mm')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test partial refund for Stripe gateway 3D and none 3D transactions', () => {

    it('it submits single sepa_debit transaction', () => {

 cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()

    })
})