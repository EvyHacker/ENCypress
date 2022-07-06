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

  const email = ('st_ecard_toronto_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/54123/action/1')
  })

  it('submits successfully sends an ecard', () => {

    cy.get('.en__ecarditems__action > .en__ecarditems__button').as('previewButton')
    cy.get('@previewButton').click()
    cy.get('.en__ecarditems__prevclose').as('previewClose')
    cy.get('@previewClose').click()
    cy.get('[data-id="282840"] > img').click()
    cy.get('@previewButton').click()
    cy.get('@previewClose').click()
    cy.get('.thumb--active > img').click()
    cy.get('@previewButton').click()
    cy.get('@previewClose').click()

    cy.get('.en__ecardmessage__default').type('This is test mesaage')
    cy.get('.en__ecardrecipients__name > input').type('Evy Test')
    cy.get('.en__ecardrecipients__email > input').type(email)
    cy.get('.en__ecardrecipients__email > .en__ecarditems__button').click()
    cy.get('.ecardrecipient__name').should('have.value', 'Evy Test')
    cy.get('.ecardrecipient__email').should('have.value', email)

    ENpage.firstName().type('ST_Ecard')
    ENpage.lastName().type('Toronto')
    ENpage.emailPage().type(email)
    cy.get('.en__submit > button').click()

    validateThankYouPage()

  })

  function validateThankYouPage() {

    cy.location('pathname').should('include', '/page/54123/action/2')
    cy.get('.content').as('thankcopy')
    cy.get('@thankcopy').contains('ST_Ecard')
    cy.get('@thankcopy').contains('Toronto')
    cy.get('@thankcopy').contains(email)

  }
})
describe('test e-activist LogIn ', () => {
  const email = ('st_ecard_toronto_' + todaysDate + '@engagingnetworks.online')

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
      expect(text.trim()).contains('ecf')
    })
    EN.logOut()
  })
})