/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM_DD_YYYY_mm')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test Single and/or Recurring donation ', () => {

  const email = ('single_donation_memoriam_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/13509/donate/1')
  })

  it('has correct data', () => {

    ENpage.firstName().should('have.value', 'ST')
    ENpage.lastName().should('have.value', 'Single Donation')
    ENpage.emailPage()
      .should('have.value', 'singledonationmemoriam@engagingnetworks.online')
    ENpage.emailPage().clear()
    ENpage.emailPage().type(email)
    ENpage.address1Page().should('have.value', 'address1')
    ENpage.cityPage().should('have.value', 'Tribeca')
    ENpage.regionPage().should('have.value', 'NY')
    ENpage.postCodePage().should('have.value', '06888')
    ENpage.countryPage().should('have.value', 'US')
    cy.get('#en__field_transaction_inmem0').should('be.checked')
    cy.get('#en__field_transaction_infname').should('have.value', 'ST Inform Name')
    cy.get('#en__field_transaction_infemail').should('have.value', "st_informemail@engagingnetworks.online")
    cy.get('#en__field_transaction_infadd1').should('have.value', 'ST_address 1')
    cy.get('#en__field_transaction_infadd2').should('have.value', 'ST_address 2')
    cy.get('#en__field_transaction_infcity').should('have.value', 'ST_city')
    cy.get('#en__field_transaction_infcountry').should('have.value', 'ST_country')
    cy.get('#en__field_transaction_infpostcd').should('have.value', 'ST_12345')
    cy.get('#en__field_transaction_paymenttype').should('have.value', 'Visa')
    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'Smoke Test CC Name')
    cy.get('#en__field_transaction_ccnumber').should('have.value', '4222222222222220')
    cy.get('#en__field_transaction_ccvv').should('have.value', '111')
  })

  it('it submits single donation', () => {

    ENpage.emailPage().clear()
    ENpage.emailPage().type(email)
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')
    cy.get('#en__field_transaction_donationAmt2').click()
    ENpage.submitPage()
    cy.location('pathname').should('eq', '/page/13509/donate/2')
    cy.get('.en__component--column > .en__component > :nth-child(5)').contains('ST')
    cy.get('.en__component--column > .en__component > :nth-child(6)').contains('Single Donation')
    cy.get('.en__component--column > .en__component > :nth-child(7)').contains('address1')
    cy.get('.en__component > :nth-child(8)').contains('Tribeca')
    cy.get('.en__component > :nth-child(9)').contains('NY')
    cy.get('.en__component > :nth-child(10)').contains(email)
    cy.get('.en__component > :nth-child(11)').contains('06888')
    cy.get('.en__component > :nth-child(12)').contains('US')
    cy.get('.en__component > :nth-child(13)').contains('Smoke Test CC Name')
    cy.get('.en__component > :nth-child(15)').contains('39743')
    cy.get('.en__component > :nth-child(17)').contains('CREDIT_SINGLE')
    cy.get(':nth-child(18)').contains('USD')
    cy.get(':nth-child(20)').contains('IATS North America')
    cy.get(':nth-child(21)').contains('VISA')
    cy.get(':nth-child(24)').contains('$10.00')
    cy.get(':nth-child(28)').contains("st_informemail@engagingnetworks.online")
    cy.get(':nth-child(29)').contains('ST_address 1')
    cy.get(':nth-child(30)').contains('ST_address 2')
    cy.get(':nth-child(31)').contains('ST_city')
    cy.get(':nth-child(32)').contains('ST_country')
    cy.get(':nth-child(33)').contains('ST_12345')

  })

})
describe('test us.e-activist LogIn ', () => {

  const email = ('single_donation_memoriam_' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters donation transaction', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
    EN.enterSupporter()
      .type(email)
    EN.searchSupporter()
    EN.lookupSupporter().click()

    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fim')
    })
    EN.logOut()
  })
})