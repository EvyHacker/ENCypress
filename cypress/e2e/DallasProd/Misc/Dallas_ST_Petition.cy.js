/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'

const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('DD-MM-YYYY')
const tomorrowsDate = dayjs().add(1, 'hr').format('DD-MM-YYYY')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test Single and/or Recurring donation ', () => {

  const email = ('st_petitiondallas_' + todaysDate + '@engagingnetworks.online')
  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/15187/action/1')
  })

  it('submits successfully petition', () => {

    cy.get('#en__field_supporter_questions_147162').click()
    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.cityPage().type('Washington')
    ENpage.emailPage().type(email)
    cy.get('#en__field_transaction_comments').type('this is comment test')
    ENpage.submitPage()

    validateThankYouPage()

  })

  function validateThankYouPage() {

    cy.location('pathname').should('include', '/page/15187/action/2')
    cy.get('.content').as('thankcopy')
    cy.get('@thankcopy').contains('Evy')
    cy.get('@thankcopy').contains('Test')
    cy.get('@thankcopy').contains(email)
    cy.get('@thankcopy').contains('GB')
  }
})
describe('test us.e-activist LogIn ', () => {

  const email = ('st_petitiondallas_' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters ett transactions', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
    EN.enterSupporter()
      .type(email)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('qcb')
      expect(text.trim()).contains('pet')
    })
    EN.logOut()
  })

})