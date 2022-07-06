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

describe('test Single and/or Recurring donation ', ()=>{

  const email = ('st_datacapture_dallas_' + todaysDate + '@engagingnetworks.online')
  
  beforeEach(() => {
    cy.visit(Cypress.env('dallas')+'page/17336/data/1')
  })

  it('submits successfully a donation with: opt in checked,volunteer Y ,one cause and once a year', () => {
        
    ENpage.firstName().type('ST - Dallas Data Capture')
    ENpage.lastName().type('Smoke Test')
    ENpage.emailPage().type(email)
    ENpage.regionPage().select('NY')
    ENpage.countryPage().select('US')
    cy.get('#en__field_supporter_questions_1744060').click()
    cy.get('#en__field_supporter_questions_165377').should('have.value', 'Plant Trees')
    cy.get('#en__field_supporter_questions_1653760').click()
    cy.get('#en__field_supporter_questions_174407').should('have.value', 'once a year')
    cy.get('#en__field_transaction_comments').type('This is Data Capture with Plant Trees test')
    ENpage.submitPage()

    validateThankYouPage()
    cy.get('.content').contains('This is Data Capture with Plant Trees test')
})
it('submits successfully a donation with: opt in unchecked,volunteer Y ,one cause and twice a year', () => {
        
    ENpage.firstName().type('ST - Dallas Data Capture')
    ENpage.lastName().type('Smoke Test')
    ENpage.emailPage().type(email)
    ENpage.regionPage().select('NY')
    ENpage.countryPage().select('US')
    cy.get('#en__field_supporter_questions_10239').click()
    cy.get('#en__field_supporter_questions_1744060').click()
    cy.get('#en__field_supporter_questions_165377').select('Clean the Seas').should('have.value', 'Clean the Seas')
    cy.get('#en__field_supporter_questions_1653760').click()
    cy.get('#en__field_supporter_questions_174407').select('twice a year').should('have.value', 'twice a year')
    cy.get('#en__field_transaction_comments').type('This is Data Capture with Clean the Seas test')
    ENpage.submitPage()

    validateThankYouPage()
    cy.get('.content').contains('This is Data Capture with Clean the Seas test')
})

it('submits successfully a donation with: opt in checked,volunteer N, No cause and thrice a year', () => {
        
    ENpage.firstName().type('ST - Dallas Data Capture')
    ENpage.lastName().type('Smoke Test')
    ENpage.emailPage().type(email)
    ENpage.regionPage().select('NY')
    ENpage.countryPage().select('US')
    cy.get('#en__field_supporter_questions_1744061').click()
    cy.get('#en__field_supporter_questions_165377').select('Recycle').should('have.value', 'Recycle')
    cy.get('#en__field_supporter_questions_1653761').click()
    cy.get('#en__field_supporter_questions_174407').select('thrice a year').should('have.value', 'thrice a year')
    cy.get('#en__field_transaction_comments').type('This is Data Capture with Recycle test')
    ENpage.submitPage()

    validateThankYouPage()
    cy.get('.content').contains('This is Data Capture with Recycle test')
})

it('can not submit donation without opt-in questions', () => {
        
  ENpage.firstName().type('ST - Dallas Data Capture')
  ENpage.lastName().type('Smoke Test')
  ENpage.emailPage().type(email)
  ENpage.regionPage().select('NY')
  ENpage.countryPage().select('US')
  ENpage.submitPage()

  cy.get('.en__field--174406 > .en__field__error').should('have.text', 'Would you like to be a volunteer? Mandatory Field Empty')
  cy.get('.en__field--165376 > .en__field__error').should('have.text', 'Are you one with this cause? Mandatory Field Empty')
  cy.get('.en__field--textarea > .en__field__error').should('have.text', 'Comments Mandatory Field Empty')
  cy.get('#en__field_supporter_questions_1744060').click()
  cy.get('#en__field_supporter_questions_1653760').click()
  cy.get('#en__field_transaction_comments').type('This is Data Capture test')

  ENpage.submitPage()
  validateThankYouPage()
  cy.get('.content').contains('This is Data Capture test')

})

function validateThankYouPage(){

    cy.location('pathname').should('include', '/page/17336/data/2')
    cy.get('.content').as('thankcopy')
    cy.get('@thankcopy').contains('ST - Dallas Data Capture')
    cy.get('@thankcopy').contains('Smoke Test')
    cy.get('@thankcopy').contains(email)

    }
})
describe('test e-activist LogIn ', ()=>{

    const email = ('st_datacapture_dallas_' + todaysDate + '@engagingnetworks.online')
      
     it('searches for the supporters single donation transaction', () => {
     
      cy.visit(Cypress.env('dallasLogIn') + '#login')
      EN.login()
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