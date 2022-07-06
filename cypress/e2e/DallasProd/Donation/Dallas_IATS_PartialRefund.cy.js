/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM_DD_YYYY')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})
describe('test partial refund for IATS gateway for Single and Recurring transactions', () => {

  const donationSingle = ('en_iats_partial_single_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecur = ('en_iats_partial_recur_donation_' + tomorrowsDate + '@engagingnetworks.online')


  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/20435/donate/1?mode=DEMO')
  })

  it('can submit single donation', () => {


    cy.get('#en__field_transaction_donationAmt').select('other').should('have.value', 'other')
    cy.get('.en__component--column--1 > :nth-child(1) > .en__field--withOther > .en__field__element > .en__field__item--other > .en__field__input')
      .type('100.99')
    ENpage.emailPage().clear().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay1').check()
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/20435/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('54587')
    cy.get('@thankYouPage').contains('CREDIT_SINGLE')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('North America')
    cy.get('@thankYouPage').contains('$100.99')
    cy.get('@thankYouPage').contains('VISA')

  })

  it('can submit recurring donation', () => {

    cy.get('#en__field_transaction_donationAmt').select('other').should('have.value', 'other')
    cy.get('.en__component--column--1 > :nth-child(1) > .en__field--withOther > .en__field__element > .en__field__item--other > .en__field__input')
      .type('111.99')
    ENpage.emailPage().clear().type(donationRecur)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrpay1').click()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/20435/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('54587')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('North America')
    cy.get('@thankYouPage').contains('$111.99')
    cy.get('@thankYouPage').contains('VISA')

  })
})

describe('test partial refund for single and recurring transactions', () => {

  const donationSingle = ('en_iats_partial_single_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecur = ('en_iats_partial_recur_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationTypeSingle = ('.gadget__singleDonations__donation__header')
  const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')

  beforeEach(() => {
    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
  })


  it('searches for the singl transaction and completes partial refund', () => {

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
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 USD')
    EN.refundAmount().type('85.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
    cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)')
      .should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)

    cy.get(donationTypeSingle).eq(0).click()
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-85.99 USD')
    cy.get(donationTypeSingle).eq(1).click()
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 15 USD')


  })

  it('searches for the recurring transaction and completes partial refund', () => {

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
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 111.99 USD')
    EN.refundAmount().type('20.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
    cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)')
      .should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.get('.enOverlay__popup__close').click()
    cy.reload()
    EN.transactionType().eq(0).invoke('text')
      .then((text) => {
        expect(text.trim()).contains('rfd')
      })
    EN.transactionType().eq(0).click()
    cy.get('.gadget__transactionHistory__transactionDetail').invoke('text').should('include', '-20.99 USD')
    EN.logOut()

  })

})
