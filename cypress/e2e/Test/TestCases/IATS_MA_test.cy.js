/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY_mm')
const tomorrowsDate = dayjs().add(8, 'day').format('MM-DD-YYYY_mm')
const donationSingle = ('ma_iats_semi_annual_' + todaysDate + '@engagingnetworks.online')
const donationRecur = ('ma_iats_annual_' + todaysDate + '@engagingnetworks.online')
const donationRecurMonthly = ('ma_iats_monthly_' + todaysDate + '@engagingnetworks.online')
const donationSingleMc = ('ma_iats_quartely_mc_' + todaysDate + '@engagingnetworks.online')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})
describe('test partial refund for IATS gateway for Single and Recurring transactions', () => {



  beforeEach(() => {
    cy.visit(Cypress.env('test') + 'page/13194/donate/1?mode=DEMO')
  })
  
  it('can submit recurring donation semi_annual', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('[style="flex-grow:0; flex-shrink:0; flex-basis:50%;"] > :nth-child(2) > .en__field--withOther > .en__field__element > .en__field__item--other > .en__field__input')
      .type('111.99')
    ENpage.emailPage().clear().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('SEMI_ANNUAL')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/13194/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9006')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('North America')
    cy.get('@thankYouPage').contains('$111.99')
    cy.get('@thankYouPage').contains('VISA')

  })

  it('can submit recurring donation annual', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('[style="flex-grow:0; flex-shrink:0; flex-basis:50%;"] > :nth-child(2) > .en__field--withOther > .en__field__element > .en__field__item--other > .en__field__input')
      .type('111.99')
    ENpage.emailPage().clear().type(donationRecur)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('ANNUAL')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/13194/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9006')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('North America')
    cy.get('@thankYouPage').contains('$111.99')
    cy.get('@thankYouPage').contains('VISA')

  })

  it('can submit recurring donation monthly', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('[style="flex-grow:0; flex-shrink:0; flex-basis:50%;"] > :nth-child(2) > .en__field--withOther > .en__field__element > .en__field__item--other > .en__field__input')
      .type('111.99')
    ENpage.emailPage().clear().type(donationRecurMonthly)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('MONTHLY')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/13194/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9006')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('North America')
    cy.get('@thankYouPage').contains('$111.99')
    cy.get('@thankYouPage').contains('VISA')

  })

  
  it.only('can submit recurring donation QUARTERLY mc', () => {

    
    ENpage.emailPage().clear().type(donationSingleMc)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('QUARTERLY')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.creditCard().clear().type('5111111111111118')
    ENpage.paymentType().select('MasterCard')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/13194/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9006')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('North America')

  })
})


