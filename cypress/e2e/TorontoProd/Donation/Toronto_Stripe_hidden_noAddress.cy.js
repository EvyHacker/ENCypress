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


describe('test partial refund for Stripe gateway for Single and Recurring transactions', () => {

  const donationStripe = ('st_stripe_noaddress_hidden_donation_' + todaysDate + '@engagingnetworks.online')
  const donationStripeSepa = ('st_stripe_sepa_noaddress_hidden_donation_' + tomorrowsDate + '@engagingnetworks.online')


  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/71815/donate/1')
  })

  it('can submit single donation', () => {

    ENpage.emailPage().clear().type(donationStripe)
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/71815/donate/2')
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000000000003220')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')

    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3dIframe().find("[id*=test-source-fail]").click()
    cy.location('pathname').should('include', 'page/71815/donate/2')
    cy.get('.en__error').should('have.text', 'We are unable to authenticate your payment method. Please choose a different payment method and try again.')

    ENpage.submitPage()
    cy.wait(5000)
    cy.failForStripe3dIframe().find("[id*=test-source-authorize]").click()

    cy.location('pathname').should('include', '/page/71815/donate/3')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('199522')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('EUR')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('€100.99')
    cy.get('@thankYouPage').contains('TEST: visa')
    cy.get('@thankYouPage').contains('DAILY')

  })

  it('it submits recurring sepa_debit transaction', () => {

    ENpage.emailPage().clear().type(donationStripeSepa)
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_paymenttype').select('sepa_debit').should('have.value', 'sepa_debit')
    cy.wait(2000)
    context('Actions', () => {
      cy.getWithinIframe('[name="iban"]').type('NL39RABO0300065264')
    })
    ENpage.submitPage()
    cy.location('pathname').should('include', '/page/71815/donate/3')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('199522')
    cy.get('@thankYouPage').contains('BANK_RECURRING')
    cy.get('@thankYouPage').contains('EUR')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('€100.99')
    cy.get('@thankYouPage').contains('TEST: sepa_debit')
    cy.get('@thankYouPage').contains('DAILY')

  })

})

describe('it validates no address for supporter and updates CC info', () => {

  const donationStripe = ('st_stripe_noaddress_hidden_donation_' + todaysDate + '@engagingnetworks.online')
  const donationStripeSepa = ('st_stripe_sepa_noaddress_hidden_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')

  beforeEach(() => {
    cy.visit(Cypress.env('torontoLogIn') + '#login')
    EN.login()

    if (cy.url().should('contains', '#login/tos')) {
      cy.wait(3000)
      cy.get('.enSandbox__tos__agree').click()
    } else { cy.visit(Cypress.env('torontoLogIn') + '#dashboard', { delay: 3000 }) }
  })

  it('searches for the stripe transaction and completes CC update and supporter information', () => {

    EN.enterSupporter()
      .type(donationStripe)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })

    validateNoAddress()

    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__optimal__head--update').click()
    cy.get('#gadget__recurringDetail__optimal--street').type('Stripe Street')
    cy.get('#gadget__recurringDetail__optimal--city').type('Noaddress')
    cy.get('#gadget__recurringDetail__optimal__country_chosen > .chosen-single > span').click()
    cy.get('[data-option-array-index="2"]').click()
    cy.get('#gadget__recurringDetail__optimal--state').type('London')
    cy.get('#gadget__recurringDetail__optimal--zip').type('D123AA')
    cy.get('#gadget__recurringDetail__optimal--cc').type('4242424242424242')
    cy.get('#gadget__recurringDetail__optimal--expiry--month').select('10').should('have.value', '10')
    cy.get('#gadget__recurringDetail__optimal--expiry--year').select('2023').should('have.value', '2023')
    cy.get('.gadget__recurringDetail__optimal__body__actions--save').click()
    cy.reload()

  })

  it('validates sepa_debit transaction and blank address for supporter', () => {

    EN.enterSupporter()
      .type(donationStripeSepa)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fbr')
      })

    validateNoAddress()

    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').eq(1).click()
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 EUR')
    EN.refundAmount().type('20.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund Template').should('have.value', '13148')
    cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)').should('have.value', '1')
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
    cy.get('.gadget__transactionHistory__transactionDetail').invoke('text').should('include', '-20.99 EUR')
    EN.logOut()

  })

  function validateNoAddress() {

    cy.get('.fields > :nth-child(7) > .field > .fui__field > .fui__subfield > .f').should('be.empty')
    cy.get('.fields > :nth-child(8) > .field > .fui__field > .fui__subfield > .f').should('be.empty')
    cy.get('.fields > :nth-child(6) > .field > .fui__field > .fui__subfield > .f').should('be.empty')
    cy.get('.fields > :nth-child(9) > .field > .fui__field > .fui__subfield > .f').should('be.empty')

  }
})