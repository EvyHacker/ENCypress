/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY_mm')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY_mm')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})
describe('test partial refund for Stripe gateway for Single and Recurring transactions', () => {

  const donationSingle = ('en_stripe_single_fee_' + todaysDate + '@engagingnetworks.online')
  const donationRecur = ('en_stripe_recur_fee_' + tomorrowsDate + '@engagingnetworks.online')


  beforeEach(() => {
    cy.visit(Cypress.env('test') + 'page/13850/donate/1')
  })

  it('can submit single donation', () => {

    ENpage.firstName().type('Test Name')
    ENpage.lastName().type('Last Name')
    ENpage.emailPage().clear().type(donationSingle)
    ENpage.address1Page().type('Test Street')
    ENpage.cityPage().type('Baltimore')
    ENpage.postCodePage().type('22102')
    ENpage.countryPage().type('USA')
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    ENpage.creditCard().type('4242424242424242')
    ENpage.ccExpiryDate().type('01')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()
    cy.location('pathname').should('include', '/page/13850/donate/2')
    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9733')
    cy.get('@thankYouPage').contains('CREDIT_SINGLE')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('$100.99')
    cy.get('@thankYouPage').contains('visa')

  })

  it('can submit recurring donation', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('111.99')

    ENpage.firstName().type('Test Name')
    ENpage.lastName().type('Last Name')
    ENpage.emailPage().clear().type(donationRecur)
    ENpage.address1Page().type('Test Street')
    ENpage.cityPage().type('Baltimore')
    ENpage.postCodePage().type('22102')
    ENpage.countryPage().type('USA')
    
    // cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    // cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    ENpage.creditCard().type('4242424242424242')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    cy.get('#en__field_transaction_recurrpay').check()
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/13850/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9733')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('$111.99')
    cy.get('@thankYouPage').contains('visa')

  })
})

describe('test partial refund for single and recurring transactions', () => {


  const donationSingle = ('en_stripe_single_fee_' + todaysDate + '@engagingnetworks.online')
  const donationRecur = ('en_stripe_recur_fee_' + tomorrowsDate + '@engagingnetworks.online')
  const donationTypeSingle = ('.gadget__singleDonations__donation__header')
  const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')


  beforeEach(() => {
    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
  })


  it('searches for the single ticket transaction and completes partial refund', () => {

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
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 15 USD')

  })

  it('searches for the recurring ticket transaction and completes partial refund', () => {

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
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt')
      .should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Refund template cypress').should('have.value', '3')
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