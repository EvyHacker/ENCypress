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

  const email = ('st_signupformdallas_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/15239/subscribe/1')
  })

  it('can sign up for plant trees', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    //Validate ST_Optin mandatory field
    cy.get('#en__field_supporter_questions_1653760').check()
    cy.get('.en__field__input--select').should('have.value', 'Plant Trees')
    cy.get('#en__field_supporter_questions_1661490').click()
    cy.get('.en__field__input--textarea').type('This is Red Plant Tress Test')
    ENpage.submitPage()

    cy.get('.en__field__error').should('have.text', 'ST_Optin Mandatory Field Empty')
    cy.get('.en__field--checkbox > .en__field__element > .en__field__item').click()
    ENpage.submitPage()
    ValidateThankYouPage()

  })

  it('can sign up for Clean the Seas', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    cy.get('.en__field--checkbox > .en__field__element > .en__field__item').click()
    cy.get('#en__field_supporter_questions_1653761').click()
    cy.get('.en__field__input--select').select('Clean the Seas').should('have.value', 'Clean the Seas')
    cy.get('#en__field_supporter_questions_1661491').click()
    cy.get('#en__field_supporter_questions_166150').select('VI').should('have.value', 'VI')
    cy.get('.en__field__input--textarea').type('This is Clean the Seas Test')
    ENpage.submitPage()
    ValidateThankYouPage()

  })

  it('can sign up for Recycle', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    cy.get('.en__field--checkbox > .en__field__element > .en__field__item').click()
    cy.get('#en__field_supporter_questions_1653761').click()
    cy.get('.en__field__input--select').select('Recycle').should('have.value', 'Recycle')
    cy.get('#en__field_supporter_questions_1661492').click()
    cy.get('#en__field_supporter_questions_166150').select('VI').should('have.value', 'VI')
    cy.get('.en__field--splitselect > .en__field__element > :nth-child(3) > .en__field__input').select('IV').should('have.value', 'IV')
    cy.get('.en__field__input--textarea').type('This is Recycle Test')
    ENpage.submitPage()
    ValidateThankYouPage()

  })

  function ValidateThankYouPage() {

    cy.location('pathname').should('include', '/page/15239/subscribe/2')
    cy.get('.en__component').as('thankcopy')
    cy.get('@thankcopy').contains('Evy')
    cy.get('@thankcopy').contains('Test')
    cy.get('@thankcopy').contains(email)
  }
})
describe('test us.e-activist LogIn ', () => {

  const email = ('st_signupformdallas_' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters ett transactions', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
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