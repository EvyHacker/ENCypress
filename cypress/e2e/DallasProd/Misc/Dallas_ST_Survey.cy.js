/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test Single and/or Recurring donation ', () => {

  const email = ('st_surveydallas_' + todaysDate + '@engagingnetworks.online')
  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/15188/survey/1')
  })

  it('submits successfully petition', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    ENpage.address1Page().type('1146 19th Street NW, Suite 800')
    ENpage.cityPage().type('Washington')
    ENpage.regionPage().select('DC')
    ENpage.postCodePage().type('20001')
    ENpage.submitPage()

    validateCausePage()

    validateThankYouPage()

  })

  function validateCausePage() {

    cy.location('pathname').should('include', '/page/15188/survey/2')
    cy.get('#en__field_transaction_svblock_165379_svquestion_1653800').click()
    cy.get('#en__field_transaction_svblock_165379_svquestion_1653810').click()
    cy.get('#en__field_transaction_svblock_165379_svquestion_165382').type('Comment test')
    ENpage.submitPage()

  }

  function validateThankYouPage() {

    cy.location('pathname').should('include', '/page/15188/survey/3')
    cy.get('.content').as('thankcopy')
    cy.get('@thankcopy').contains('Evy')
    cy.get('@thankcopy').contains('Test')
    cy.get('@thankcopy').contains('1146 19th Street NW, Suite 800')
    cy.get('@thankcopy').contains('Washington')
    cy.get('@thankcopy').contains('DC')
    cy.get('@thankcopy').contains(email)
    cy.get('@thankcopy').contains('20001')
    cy.get('@thankcopy').contains('GB')
  }
})
describe('test us.e-activist LogIn ', () => {

  const email = ('st_surveydallas_' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters ett transactions', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
    EN.enterSupporter()
      .type(email)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('svy')
    })
    EN.logOut()
  })
})