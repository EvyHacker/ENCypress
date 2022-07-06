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

  const emailSingle = ('st_single_donationtwogateways_' + todaysDate + '@engagingnetworks.online')
  const emailRecur = ('st_recur_donationtwogateways_' + tomorrowsDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/54128/donate/1')
  })

  it('has correct data', () => {

    ENpage.firstName().should('have.value', 'ST Donation')
    ENpage.lastName().should('have.value', 'Two Gateways')
    ENpage.emailPage()
      .should('have.value', 'st_donationtwogatewaystoronto@engagingnetworks.online')
    ENpage.address1Page().should('have.value', 'address1')
    ENpage.cityPage().should('have.value', 'Tribeca')
    ENpage.regionPage().should('have.value', 'NY')
    ENpage.postCodePage().should('have.value', '06888')
    ENpage.countryPage().should('have.value', 'USA')
    cy.get('#en__field_transaction_paycurrency').should('have.value', 'USD')
    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'Smoke Test CC Name')
    cy.get('#en__field_transaction_ccvv').should('have.value', '111')
  })

  it('submits single transaction for IATS', () => {

    ENpage.emailPage().clear().type(emailSingle)
    AddMissingFileds()
    cy.get('#en__field_transaction_donationAmt1').click()
    ENpage.submitPage()

    ValidateThankYouPage()
    cy.get('.en__component > :nth-child(17)').contains('CREDIT_SINGLE')
    cy.get('.en__component > :nth-child(10)').contains(emailSingle)
    cy.get(':nth-child(24)').contains('$2.00')

  })

  it('submits recurring transaction for IATS', () => {

    ENpage.emailPage().clear().type(emailRecur)
    cy.get('#en__field_transaction_recurrpay').check()
    cy.get('#en__field_transaction_recurrfreq').type('MONTHLY')
    AddMissingFileds()
    cy.get('#en__field_transaction_donationAmt2').click()
    ENpage.submitPage()

    ValidateThankYouPage()
    cy.get('.en__component > :nth-child(17)').contains('CREDIT_RECURRING')
    cy.get('.en__component > :nth-child(10)').contains(emailRecur)
    cy.get(':nth-child(24)').contains('$5.00')
  })

  function AddMissingFileds() {

    cy.get('#en__field_transaction_paymenttype').select('Visa').should('have.value', 'Visa')
    cy.get('#en__field_transaction_ccnumber').type('4222222222222220')
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')

  }

  function ValidateThankYouPage() {

    cy.location('pathname').should('include', '/page/54128/donate/2')
    cy.get('.en__component--column').as('thankyoucopy')
    cy.get('@thankyoucopy').contains('ST Donation')
    cy.get('@thankyoucopy').contains('Two Gateways')
    cy.get('@thankyoucopy').contains('address1')
    cy.get('@thankyoucopy').contains('Tribeca')
    cy.get('@thankyoucopy').contains('NY')
    cy.get('@thankyoucopy').contains('06888')
    cy.get('@thankyoucopy').contains('USA')
    cy.get('@thankyoucopy').contains('166658')
    cy.get('@thankyoucopy').contains('USD')
    cy.get('@thankyoucopy').contains('IATS North America')
    cy.get('@thankyoucopy').contains('VISA')

  }

})
describe('test e-activist LogIn ', () => {

  const emailSingle = ('st_single_donationtwogateways_' + todaysDate + '@engagingnetworks.online')
  const emailRecur = ('st_recur_donationtwogateways_' + tomorrowsDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('torontoLogIn') + '#login')
    EN.login()

    if (cy.url().should('contains', '#login/tos')) {
      cy.wait(3000)
      cy.get('.enSandbox__tos__agree').click()
    } else { cy.visit(Cypress.env('torontoLogIn') + '#dashboard', { delay: 3000 }) }
  })

  it('searches for the supporters single donation transaction', () => {

    EN.enterSupporter()
      .type(emailSingle)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcs')
    })
    EN.logOut()
  })
  it('searches for the supporters recurring donation transaction', () => {

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