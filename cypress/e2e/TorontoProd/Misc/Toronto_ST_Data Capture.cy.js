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

  const email = ('st_datacapture_toronto_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/56962/data/1')
  })

  it('submits successfully a donation with: red color,one cause and Y to attend', () => {

    ENpage.firstName().type('ST - Toronto Data Capture')
    ENpage.lastName().type('Smoke Test')
    ENpage.emailPage().type(email)
    ENpage.regionPage().select('NY')
    ENpage.countryPage().select('USA')
    cy.get('#en__field_supporter_questions_4123').check()
    cy.get('#en__field_supporter_questions_4124').check()
    cy.get('#en__field_supporter_questions_5818070').click()
    cy.get('#en__field_supporter_questions_5818510').click()
    cy.get('#en__field_supporter_questions_2704450').click()
    cy.get('#en__field_supporter_questions_5763').type('This is Data Capture test')

    ENpage.submitPage()

    validateThankYouPage()

  })
  it('submits successfully a donation with: blue color,one cause and N to attend', () => {

    ENpage.firstName().type('ST - Toronto Data Capture')
    ENpage.lastName().type('Smoke Test')
    ENpage.emailPage().type(email)
    ENpage.regionPage().select('NY')
    ENpage.countryPage().select('USA')
    cy.get('#en__field_supporter_questions_4123').check()
    cy.get('#en__field_supporter_questions_4124').check()
    cy.get('#en__field_supporter_questions_5818071').click()
    cy.get('#en__field_supporter_questions_5818510').click()
    cy.get('#en__field_supporter_questions_2704451').click()
    cy.get('#en__field_supporter_questions_5763').type('This is Data Capture test')

    ENpage.submitPage()

    validateThankYouPage()
  })

  it('submits successfully a donation with: green color,no cause and N to attend', () => {

    ENpage.firstName().type('ST - Toronto Data Capture')
    ENpage.lastName().type('Smoke Test')
    ENpage.emailPage().type(email)
    ENpage.regionPage().select('NY')
    ENpage.countryPage().select('USA')
    cy.get('#en__field_supporter_questions_4123').check()
    cy.get('#en__field_supporter_questions_4124').check()
    cy.get('#en__field_supporter_questions_5818072').click()
    cy.get('#en__field_supporter_questions_5818511').click()
    cy.get('#en__field_supporter_questions_2704451').click()
    cy.get('#en__field_supporter_questions_5763').type('This is Data Capture test')

    ENpage.submitPage()

    validateThankYouPage()
  })

  it('can not submit donation without opt-in questions', () => {

    ENpage.firstName().type('ST - Toronto Data Capture')
    ENpage.lastName().type('Smoke Test')
    ENpage.emailPage().type(email)
    ENpage.regionPage().select('NY')
    ENpage.countryPage().select('USA')
    ENpage.submitPage()

    cy.get('.en__field--581807 > .en__field__error').should('have.text', 'What is your favorite color? is a mandatory form field.')
    cy.get('.en__field--581851 > .en__field__error').should('have.text', 'Are you one with this cause? is a mandatory form field.')
    cy.get('.en__field--textarea > .en__field__error').should('have.text', 'Personal Comments Q is a mandatory form field.')
    cy.get('#en__field_supporter_questions_5818073').click()
    cy.get('#en__field_supporter_questions_5818511').click()
    cy.get('#en__field_supporter_questions_5763').type('This is Data Capture test')

    ENpage.submitPage()
    validateThankYouPage()
  })

  function validateThankYouPage() {

    cy.location('pathname').should('include', '/page/56962/data/2')
    cy.get('.content').as('thankcopy')
    cy.get('@thankcopy').contains('ST - Toronto Data Capture')
    cy.get('@thankcopy').contains('Smoke Test')
    cy.get('@thankcopy').contains(email)

  }
})
describe('test e-activist LogIn ', () => {


  const email = ('st_datacapture_toronto_' + todaysDate + '@engagingnetworks.online')

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
      expect(text.trim()).contains('dcf')
      expect(text.trim()).contains('qcb')
    })
    EN.logOut()
  })
})