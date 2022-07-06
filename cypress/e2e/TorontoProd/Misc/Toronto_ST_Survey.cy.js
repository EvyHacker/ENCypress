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

  const email = ('st_survey_toronto_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/50003/survey/1')
  })

  it('submits successfully petition', () => {

    ENpage.firstName().should('have.value', 'ST')
    ENpage.lastName().should('have.value', 'Survey -Toronto')
    ENpage.emailPage().should('have.value', 'st_surveytoronto@engagingnetworks.online')
    ENpage.emailPage().clear().type(email)
    ENpage.address1Page().should('have.value', 'address1')
    ENpage.cityPage().should('have.value', 'Tribeca')
    ENpage.regionPage().should('have.value', 'NY')
    ENpage.postCodePage().should('have.value', '111222')
    ENpage.submitPage()

    validateCausePage()

    validateThankYouPage()

  })

  function validateCausePage() {

    cy.location('pathname').should('include', '/page/50003/survey/2')
    cy.get('#en__field_transaction_svblock_522035_svquestion_5220370').click()
    cy.get('#en__field_transaction_svblock_522035_svquestion_5220360').click()
    ENpage.submitPage()

  }

  function validateThankYouPage() {

    cy.location('pathname').should('include', '/page/50003/survey/3')
    cy.get('.en__component--column > .en__component').as('thankcopy')
    cy.get('@thankcopy').contains('ST')
    cy.get('@thankcopy').contains('Survey -Toronto')
    cy.get('@thankcopy').contains('address1')
    cy.get('@thankcopy').contains('Tribeca')
    cy.get('@thankcopy').contains('NY')
    cy.get('@thankcopy').contains(email)
    cy.get('@thankcopy').contains('111222')
    cy.get('@thankcopy').contains('USA')
  }
})
describe('test e-activist LogIn ', () => {

  const email = ('st_survey_toronto_' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters single donation transaction', () => {

    cy.visit(Cypress.env('torontoLogIn') + '#login')
    EN.login()

    if (cy.url().should('contains', '#login/tos')) {
      cy.wait(3000)
      cy.get('.enSandbox__tos__agree').click()
    } else { cy.visit(Cypress.env('torontoLogIn') + '#dashboard', { delay: 3000 }) }

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