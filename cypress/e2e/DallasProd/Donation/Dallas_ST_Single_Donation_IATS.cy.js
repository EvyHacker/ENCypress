/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'

const EN = new ENobjects()
const ENpage = new ENpageObject()

const dayjs = require('dayjs')
Cypress.dayjs = dayjs
const todaysDate = dayjs().format('DD-MM-YYYY')
const email = ('st_singledonation_' + todaysDate + '@engagingnetworks.online')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})
describe('test Single donation IATS', () => {

  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/16439/donate/1')
  })

  it('has correct data', () => {

    ENpage.firstName().should('have.value', 'ST')
    ENpage.lastName().should('have.value', 'Single Donation')
    ENpage.emailPage()
      .should('have.value', 'st_singledonation@engagingnetworks.online')
    ENpage.address1Page().should('have.value', 'address1')
    ENpage.cityPage().should('have.value', 'Tribeca')
    ENpage.regionPage().should('have.value', 'NY')
    ENpage.postCodePage().should('have.value', '06888')
    ENpage.countryPage().should('have.value', 'US')
    cy.get('#en__field_transaction_paymenttype').should('have.value', 'Visa')
    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'Smoke Test CC Name')
    cy.get('#en__field_transaction_ccnumber').should('have.value', '4222222222222220')
    cy.get('#en__field_transaction_ccvv').should('have.value', '111')

  })

  it('it submits the page', () => {

    ENpage.emailPage().clear().type(email)
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')
    ENpage.submitPage()
    cy.location('pathname').should('eq', '/page/16439/donate/2')
    cy.get('.en__component--column > .en__component > :nth-child(5)').contains('ST')
    cy.get('.en__component--column > .en__component > :nth-child(6)').contains('Single Donation')
    cy.get('.en__component--column > .en__component > :nth-child(7)').contains('address1')
    cy.get('.en__component > :nth-child(8)').contains('Tribeca')
    cy.get('.en__component > :nth-child(9)').contains('NY')
    cy.get('.en__component > :nth-child(10)').contains(email)
    cy.get('.en__component > :nth-child(11)').contains('06888')
    cy.get('.en__component > :nth-child(12)').contains('US')
    cy.get('.en__component > :nth-child(13)').contains('Smoke Test CC Name')
    cy.get('.en__component > :nth-child(15)').contains('46280')
    cy.get('.en__component > :nth-child(17)').contains('CREDIT_SINGLE')
    cy.get(':nth-child(18)').contains('USD')
    cy.get(':nth-child(20)').contains('IATS North America')
    cy.get(':nth-child(21)').contains('VISA')
    cy.get(':nth-child(24)').contains('$1.00')

  })
})
describe('test us.e-activist LogIn ', () => {

  it('searches for the supporters donation transaction', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')

    EN.login()
    EN.enterSupporter()
      .type(email)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcs')
    })
    EN.logOut()
  })

})