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

  const email = ('st_signupform_toronto_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/54010/subscribe/1')
  })

  it('can sign up for plant trees', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    cy.get('#en__field_supporter_questions_4123').check()
    cy.get('#en__field_supporter_questions_5818510').click()
    cy.get('.en__field__input--select').should('have.value', 'Plant Trees')
    cy.get('#en__field_supporter_questions_5818070').click()
    cy.get('.en__field__input--textarea').type('This is Red Plant Tress Test')
    ENpage.submitPage()

    ValidateThankYouPage()
  })

  it('can sign up for Clean the Seas', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    cy.get('#en__field_supporter_questions_4123').check()
    cy.get('#en__field_supporter_questions_5818511').click()
    cy.get('.en__field__input--select').select('Clean the Seas').should('have.value', 'Clean the Seas')
    cy.get('#en__field_supporter_questions_581854').select('IV').should('have.value', 'IV')
    cy.get('#en__field_supporter_questions_5818071').click()
    cy.get('.en__field__input--textarea').type('This is Clean the Blue Seas Test')
    ENpage.submitPage()

    ValidateThankYouPage()

  })

  it('can sign up for Recycle', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    cy.get('#en__field_supporter_questions_4123').check()
    cy.get('#en__field_supporter_questions_5818511').click()
    cy.get('.en__field__input--select').select('Recycle').should('have.value', 'Recycle')
    cy.get('#en__field_supporter_questions_581854').select('IV').should('have.value', 'IV')
    cy.get('.en__field--splitselect > .en__field__element > :nth-child(3) > .en__field__input')
      .select('IV').should('have.value', 'IV')
    cy.get('#en__field_supporter_questions_5818072').click()
    cy.get('.en__field__input--textarea').type('This is Green Recycle Test')
    ENpage.submitPage()

    ValidateThankYouPage()

  })

  function ValidateThankYouPage() {

    cy.location('pathname').should('include', '/page/54010/subscribe/2')
    cy.get('.en__component').as('thankcopy')
    cy.get('@thankcopy').contains('Evy')
    cy.get('@thankcopy').contains('Test')
    cy.get('@thankcopy').contains(email)
  }
})
describe('test us.e-activist LogIn ', () => {

  const email = ('st_signupform_toronto_' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters ett transactions', () => {

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
      expect(text.trim()).contains('qcb')
      expect(text.trim()).contains('ems')
    })
    EN.logOut()
  })
})