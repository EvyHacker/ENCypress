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

  const email = ('st_petition_toronto_' + todaysDate + '@engagingnetworks.online')
 
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
  
  beforeEach(() => {
    cy.visit(Cypress.env('toronto')+'page/50000/petition/1')
  })

  it('submits successfully petition', () => {
        
    cy.get('#en__field_supporter_questions_4123').click()
    ENpage.firstName().should('have.value', 'ST')
    ENpage.lastName().should('have.value', 'Petition')
    ENpage.cityPage().should('have.value', 'Tribeca')
    ENpage.emailPage().should('have.value', 'st_petitiontoronto@engagingnetworks.online')
    ENpage.emailPage().clear().type(email)
    cy.get('#en__field_supporter_questions_5763').type('this is comment test')
    ENpage.submitPage()

    validateThankYouPage()

})

function validateThankYouPage(){

    cy.location('pathname').should('include', '/page/50000/petition/2')
    cy.get('.content').as('thankcopy')
    cy.get('@thankcopy').contains('ST')
    cy.get('@thankcopy').contains('Petition')
    cy.get('@thankcopy').contains(email)
    cy.get('@thankcopy').contains('USA')

    }
})
describe('test e-activist LogIn ', ()=>{

    const email = ('st_petition_toronto_' + todaysDate + '@engagingnetworks.online')
      
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
          expect(text.trim()).contains('qcb')
          expect(text.trim()).contains('pet')
      })
      EN.logOut()
    })
  })