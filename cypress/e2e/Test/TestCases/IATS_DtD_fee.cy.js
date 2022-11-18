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

describe('test fee cover and DtD for IATS  gateway', () => {

  const donationSingle = ('en_iats_single_donation_fee_' + todaysDate + '@engagingnetworks.online')


  it('can submit single donation', () => {

    cy.visit(Cypress.env('test') + 'page/13855/donate/1')
    cy.get('#dd-input').type('Coke')
    cy.get('#dtd-selected-company-0').contains('Coke - The Coca-Cola Company').click()

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get(':nth-child(3) > .en__field--withOther > .en__field__element > .en__field__item--other').type('100.99')
    cy.get('#en__field_transaction_feeCover').click()
    ENpage.emailPage().clear().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay1').check()
    ENpage.submitPage()


    cy.location('pathname').should('include', '/page/13855/donate/2')
    cy.get('.corporate-information').should('include.text', 'Coca-Cola')
    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9738')
    cy.get('@thankYouPage').contains('CREDIT_SINGLE')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('IATS North America')
    cy.get('@thankYouPage').contains('$110.99')
    cy.get('@thankYouPage').contains('$100.99')
    cy.get('@thankYouPage').contains('$10.00')
    cy.get('@thankYouPage').contains('VISA')

  })

})

describe('test partial refund for single and recurring transactions', () => {

  const donationSingle = ('en_iats_single_donation_fee_' + todaysDate + '@engagingnetworks.online')
  const donationTypeSingle = ('.gadget__singleDonations__donation__header')


  it('searches for the single ticket transaction and completes partial refund', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')

    EN.loginTest()
    EN.enterSupporter().type(donationSingle)
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
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 110.99 USD')
    EN.refundAmount().type('85.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Refund template cypress').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    cy.get(donationTypeSingle).eq(0).click().trigger('mouseover')
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-85.99 USD')
    cy.get(donationTypeSingle).eq(1).click()
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 25 USD')
    EN.logOut()
  })

})