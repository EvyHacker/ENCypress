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

describe('test Single donation IATS', () => {

  const emailRecur = ('st_recurdonation_dallas_' + todaysDate + '@engagingnetworks.online')
  const emailSingle = ('st_singledonation_dallas_' + tomorrowsDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/13848/donate/1')
  })

  it('has correct data', () => {

    ENpage.firstName().should('have.value', 'ST Donation')
    ENpage.lastName().should('have.value', 'Two Gateways')
    ENpage.emailPage()
      .should('have.value', 'st_donationtwogateways@engagingnetworks.online')
    ENpage.address1Page().should('have.value', 'address1')
    ENpage.cityPage().should('have.value', 'Tribeca')
    ENpage.regionPage().should('have.value', 'NY')
    ENpage.postCodePage().should('have.value', '06888')
    ENpage.countryPage().should('have.value', 'US')
    cy.get('#en__field_transaction_paycurrency').should('have.value', 'USD')
    cy.get('#en__field_transaction_paymenttype').should('have.value', 'Visa')
    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'Smoke Test CC Name')
    cy.get('#en__field_transaction_ccvv').should('have.value', '111')
    cy.get('#en__field_transaction_recurrfreq').should('have.value', 'MONTHLY')
  })

  it('submits recurring transaction for IATS', () => {

    ENpage.emailPage().clear().type(emailRecur)
    AddMissingFileds()
    cy.get('#en__field_transaction_ccnumber').type('4111111111111111')
    cy.get('#en__field_transaction_donationAmt2').click()
    ENpage.submitPage()

    ValidateThankYouPage()
    cy.get('.en__component > :nth-child(17)').contains('CREDIT_RECURRING')
    cy.get('.en__component > :nth-child(10)').contains(emailRecur)
    cy.get(':nth-child(24)').contains('$10.00')
  })

  it('submits single transaction for IATS', () => {

    ENpage.emailPage().clear().type(emailSingle)
    AddMissingFileds()
    cy.get('#en__field_transaction_ccnumber').type('4222222222222220')
    cy.get('#en__field_transaction_recurrpay1').click()
    cy.get('#en__field_transaction_donationAmt1').click()
    ENpage.submitPage()

    ValidateThankYouPage()
    cy.get('.en__component > :nth-child(17)').contains('CREDIT_SINGLE')
    cy.get('.en__component > :nth-child(10)').contains(emailSingle)
    cy.get(':nth-child(24)').contains('$5.00')

  })

  function AddMissingFileds() {

    cy.get('#en__field_transaction_paymenttype').select('Visa')
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')

  }

  function ValidateThankYouPage() {

    cy.location('pathname').should('include', '/page/13848/donate/2')
    cy.get('.en__component--column > .en__component > :nth-child(5)').contains('ST Donation')
    cy.get('.en__component--column > .en__component > :nth-child(6)').contains('Two Gateways')
    cy.get('.en__component--column > .en__component > :nth-child(7)').contains('address1')
    cy.get('.en__component > :nth-child(8)').contains('Tribeca')
    cy.get('.en__component > :nth-child(9)').contains('NY')
    cy.get('.en__component > :nth-child(11)').contains('06888')
    cy.get('.en__component > :nth-child(12)').contains('US')
    cy.get('.en__component > :nth-child(13)').contains('Smoke Test CC Name')
    cy.get('.en__component > :nth-child(15)').contains('40870')
    cy.get(':nth-child(18)').contains('USD')
    cy.get(':nth-child(20)').contains('IATS North America')
    cy.get(':nth-child(21)').contains('VISA')

  }
})

describe('test us.e-activist LogIn ', () => {


  const emailRecur = ('st_recurdonation_dallas_' + todaysDate + '@engagingnetworks.online')
  const emailSingle = ('st_singledonation_dallas_' + tomorrowsDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
  })

  it('searches for the supporters recurring donation transaction', () => {

    EN.enterSupporter()
      .type(emailRecur)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcr')
    })
  })

  it('searches for the supporters single donation transaction', () => {

    EN.enterSupporter().type(emailSingle)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcs')
    })
    EN.logOut()
  })
})