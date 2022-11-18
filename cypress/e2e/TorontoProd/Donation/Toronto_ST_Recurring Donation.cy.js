/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs

const tomorrowsDate = dayjs().add(1, 'hr').format('DD-MM-YYYY')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test Single and/or Recurring donation ', () => {

  const emailRecur = ('st_recurdonation_toronto_iats_' + tomorrowsDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/48966/donate/1')
  })

  it('has correct data', () => {

    ENpage.firstName().should('have.value', 'ST - Toronto')
    ENpage.lastName().should('have.value', 'Smoke Test')
    ENpage.emailPage()
      .should('have.value', 'st_recurringdonation_toronto@engagingnetworks.online')
    ENpage.address1Page().should('have.value', 'manhattan')
    ENpage.cityPage().should('have.value', 'New York')
    ENpage.postCodePage().should('have.value', '06879')
    ENpage.regionPage().should('have.value', 'New York')
    ENpage.countryPage().should('have.value', 'USA')
    cy.get('#en__field_transaction_paymenttype').should('have.value', 'Visa')
    cy.get('#en__field_transaction_paycurrency').should('have.value', 'USD')
    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'Smoke Test CC Name')
    cy.get('#en__field_transaction_ccnumber').should('have.value', '4222222222222220')
    cy.get('#en__field_transaction_ccvv').should('have.value', '222')
    cy.get('#en__field_transaction_recurrfreq').should('have.value', 'MONTHLY')
  })

  it('submits recurring transaction for IATS', () => {

    ENpage.emailPage().clear().type(emailRecur)
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')
    cy.get('#en__field_transaction_recurrpay').check()
    cy.get('#en__field_transaction_donationAmt1').click()
    ENpage.submitPage()

    ValidateThankYouPage()

  })

  function ValidateThankYouPage() {

    cy.location('pathname').should('include', '/page/48966/donate/2')
    cy.get('.en__component--column').as('thankyoucopy')
    cy.get('@thankyoucopy').contains('ST - Toronto')
    cy.get('@thankyoucopy').contains('Smoke Test')
    cy.get('@thankyoucopy').contains('manhattan')
    cy.get('@thankyoucopy').contains('New York')
    cy.get('@thankyoucopy').contains('New York')
    cy.get('@thankyoucopy').contains(emailRecur)
    cy.get('@thankyoucopy').contains('06879')
    cy.get('@thankyoucopy').contains('USA')
    cy.get('@thankyoucopy').contains('158218')
    cy.get('@thankyoucopy').contains('CREDIT_RECURRING')
    cy.get('@thankyoucopy').contains('USD')
    cy.get('@thankyoucopy').contains('IATS North America')
    cy.get('@thankyoucopy').contains('VISA')
    cy.get(':nth-child(24)').contains('$2.00')

  }
})
describe('test e-activist LogIn ', () => {

  const emailRecur = ('st_recurdonation_toronto_iats_' + tomorrowsDate + '@engagingnetworks.online')

  it('searches for the supporters recurring donation transaction', () => {

    cy.visit(Cypress.env('torontoLogIn') + '#login')
    EN.login()

    if (cy.url().should('contains', '#login/tos')) {
      cy.wait(3000)
      cy.get('.enSandbox__tos__agree').click()
    } else { cy.visit(Cypress.env('torontoLogIn') + '#dashboard', { delay: 3000 }) }
    EN.enterSupporter()
      .type(emailRecur)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcr')

    })
    EN.logOut()
  })
})