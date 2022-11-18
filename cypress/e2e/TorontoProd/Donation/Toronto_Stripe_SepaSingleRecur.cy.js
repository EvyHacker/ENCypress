/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM_DD_YYYY_mm')
const tomorrowsDate = dayjs().add(1, 'day').format('MM_DD_YYYY_mm')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test partial refund for Stripe gateway sepa-debit for Single and Recurring transactions', () => {

  const donationSingle = ('toronto_stripe_sepa_partial_single_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecur = ('toronto_stripe_sepa_partial_recur_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationTypeSingle = ('.gadget__singleDonations__donation__header')
  const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')
  var newSingle
  var newRecurring

  it('can submit single donation', () => {

    cy.visit(Cypress.env('toronto') + 'page/68903/donate/1?mode=DEMO')
    ENpage.emailPage().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay1').check()
    ENpage.submitPage()

    cy.url().should('include', '/page/68903/donate/2')

    cy.get('#en__field_transaction_donationAmt3').click()
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    context('Actions', () => {
      cy.getWithinIframe('[name="iban"]').type('NL39RABO0300065264')
    })
    ENpage.submitPage()
    cy.get('.en__component--column > .en__component > :nth-child(5)').should('contain.text', 'BANK_SINGLE')
    cy.get(':nth-child(24) > strong').then(($usage) => {
      newSingle = $usage.text()
    })
    thankyouPageSepa()
  })

  it('can submit recurring donation', () => {

    cy.visit(Cypress.env('toronto') + 'page/68903/donate/1?mode=DEMO')
    ENpage.emailPage().type(donationRecur)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_cardstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    ENpage.submitPage()

    cy.url().should('include', '/page/68903/donate/2')

    cy.get('#en__field_transaction_donationAmt3').click()
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    context('Actions', () => {
      cy.getWithinIframe('[name="iban"]').type('GB82WEST12345698765432')

    })
    ENpage.submitPage()
    cy.get('.en__component--column > .en__component > :nth-child(5)').should('contain.text', 'BANK_RECURRING')
    cy.get(':nth-child(24) > strong').then(($usage) => {
      newRecurring = $usage.text()
    })
    thankyouPageSepa()
  })

  function thankyouPageSepa() {
    cy.location('pathname').should('include', 'page/68903/donate/3')
    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('195173')
    cy.get('@thankYouPage').contains('EUR')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('€100.99')
    cy.get('@thankYouPage').contains('TEST: sepa_debit')
  }


  it('searches for the single ticket transaction and completes partial refund', () => {

    login()
    EN.enterSupporter()
      .type(newSingle)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fbs')
      })

    cy.get(donationTypeSingle).eq(0).click()
    cy.get('.gadget__singleDonations__transaction').invoke('text').should('include', 'change')
    cy.get(donationTypeSingle).eq(1).click()
    EN.receiptOrig().should('be.visible')
    EN.receiptRep().should('be.visible')
    EN.tax().should('be.visible')
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 EUR')
    EN.refundAmount().type('85.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund Template').should('have.value', '13148')
    cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)')
      .should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    cy.get(donationTypeSingle).eq(0).click().trigger('mouseover')
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-85.99 EUR')
    cy.get(donationTypeSingle).eq(2).click()
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 15 EUR')
    EN.searchNewSup()
  })

  it('searches for the recurring ticket transaction and completes partial refund', () => {

    login()
    EN.enterSupporter()
      .type(newRecurring)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fbr')
      })
    cy.get(donationTypeRecur).click()
    cy.get('.gadget__recurringDetail__history__item').eq(1).click()
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 EUR')
    EN.refundAmount().type('20.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund Template')
      .should('have.value', '13148')
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

  function login(){

    cy.visit(Cypress.env('torontoLogIn') + '#login')
    EN.login()

    if (cy.url().should('contains', '#login/tos')) {
      cy.wait(3000)
      cy.get('.enSandbox__tos__agree').click()
    } else { cy.visit(Cypress.env('torontoLogIn') + '#dashboard', { delay: 3000 }) }


  }
})