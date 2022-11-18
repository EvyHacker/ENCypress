
/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('DD-MM-YYYY')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test fee cover and DtD for Worldpay  gateway for 3D transaction', () => {

  const donationSingle = ('en_worldpay_single_donation_fee' + todaysDate + '@engagingnetworks.online')

  it('can submit single donation', () => {

    cy.visit(Cypress.env('test') + 'page/13702/donate/1')
    cy.get('#dd-input').type('Coke')
    cy.get('#dtd-selected-company-0').contains('Coca-Cola').click()

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_feeCover').click()
    ENpage.emailPage().clear().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay1').check()
    cy.get('#en__field_transaction_ccnumber').type('5454545454545454')
    ENpage.submitPage()

    cy.url().should('include', 'https://secure-test.worldpay.com/')
    cy.get('.lefty').click()

    cy.location('pathname').should('include', '/page/13702/donate/2')
    cy.reload()
    cy.get('.mg-description > :nth-child(1) > strong').should('include.text', 'Coca-Cola')
    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9576')
    cy.get('@thankYouPage').contains('CREDIT_SINGLE')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('RBS Gateway')
    cy.get('@thankYouPage').contains('$109.02')
    cy.get('@thankYouPage').contains('$100.99')
    cy.get('@thankYouPage').contains('$8.03')
    cy.get('@thankYouPage').contains('TEST: VISA-SSL')

  })

})

describe('test partial refund for single and recurring transactions', () => {

  const donationTypeSingle = ('.gadget__singleDonations__donation__header')
  const donationSingle = ('en_worldpay_single_donation_fee' + todaysDate + '@engagingnetworks.online')


  it('searches for the single ticket transaction and completes partial refund', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(donationSingle)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcs')
      })

    cy.get(donationTypeSingle).eq(0).click()
    EN.receiptOrig().should('be.visible')
    EN.receiptRep().should('be.visible')
    EN.tax().should('be.visible')
    EN.refund().click()
    cy.get('.message__actions__confirm').click()
    cy.reload()
    cy.get(donationTypeSingle).eq(0).click().trigger('mouseover')
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '109.02 USD')
    EN.logOut()
  })

})