/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('DD-MM-YYYY')
const tomorrowsDate = dayjs().add(1, 'day').format('YYYY/MM/DD')
const donationSingle = ('en_moneris_refunded_single_' + todaysDate + '@engagingnetworks.online')
const donationRecur = ('en_moneris_refunded_recur_' + todaysDate + '@engagingnetworks.online')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})
describe('test partial refund for moneris gateway for Single and Recurring transactions', () => {



  beforeEach(() => {
    cy.visit(Cypress.env('test') + 'page/14802/donate/1')
  })

  it('can submit single donation', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('[style="flex-grow:0; flex-shrink:0; flex-basis:50%;"] > :nth-child(2) > .en__field--withOther > .en__field__element > .en__field__item--other > .en__field__input')
      .type('100.99')
    ENpage.emailPage().clear().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay1').check()
   // ENpage.paymentType().select('VI')
    ENpage.creditCard().type('4242424242424242')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/14802/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('10798')
    cy.get('@thankYouPage').contains('CREDIT_SINGLE')
    cy.get('@thankYouPage').contains('CAD')
    cy.get('@thankYouPage').contains('Moneris eSelect Vault Canada')
    cy.get('@thankYouPage').contains('$100.99')
    cy.get('@thankYouPage').contains('TEST: V')

  })

  it('can submit recurring donation', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('[style="flex-grow:0; flex-shrink:0; flex-basis:50%;"] > :nth-child(2) > .en__field--withOther > .en__field__element > .en__field__item--other > .en__field__input')
      .type('111.99')
    ENpage.emailPage().clear().type(donationRecur)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    //ENpage.paymentType().select('VI')
    ENpage.creditCard().type('4242424242424242')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/14802/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('10798')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('CAD')
    cy.get('@thankYouPage').contains('Moneris eSelect Vault Canada')
    cy.get('@thankYouPage').contains('$111.99')
    cy.get('@thankYouPage').contains('TEST: V')

  })
})

describe('test partial refund for single and recurring transactions', () => {

    const donationSingle = ('en_moneris_refunded_single_' + todaysDate + '@engagingnetworks.online')
    const donationRecur = ('en_moneris_refunded_recur_' + todaysDate + '@engagingnetworks.online')
  const donationTypeSingle = ('.gadget__singleDonations__donation__header')
  const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')

  beforeEach(() => {
    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
  })

  it('searches for the single transaction and mark it as refunded', () => {

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
    cy.get('.setRefund').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    cy.get(donationTypeSingle).eq(0).click().trigger('mouseover')
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    EN.searchNewSup()
  })

  it('searches for the recurring ticket transaction and mark it as refunded', () => {

    EN.enterSupporter()
      .type(donationRecur)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })
    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').click()
    cy.get('.gadget__recurringDetail__history__buttons__markRefund > .button').click()

    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.get('.enOverlay__popup__close').click()
    cy.reload()
    EN.transactionType().eq(0).invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })
    EN.transactionType().eq(0).click()
    cy.get('.gadget__transactionHistory__transactionDetail').invoke('text').should('include', '111.99 CAD')
    EN.logOut()

  })

})