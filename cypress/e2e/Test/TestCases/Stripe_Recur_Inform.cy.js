/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
//import 'cypress-iframe'
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY_hh_mm')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY_hh_mm')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false


})

describe('test partial refund for Stripe gateway 3D and none 3D transactions', () => {

  const donationTypeSingle = ('.gadget__singleDonations__donation__header')
  const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')

  const donationRecurSepaAnnual = ('en_stripe_sepa_recur_annual_' + tomorrowsDate + '@engagingnetworks.online')
  const donationRecurSepa = ('en_stripe_sepa_recur_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationRecurCC3220Annual = ('en_stripe_recur_cc3220_annual_' + tomorrowsDate + '@engagingnetworks.online')
  const donationRecurCC3220 = ('en_stripe_recur_cc3220_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationRecurCC4444Annual = ('en_stripe_recur_cc4444_annual_' + tomorrowsDate + '@engagingnetworks.online')
  const donationRecurCC4444 = ('en_stripe_recur_cc4444_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationRecurCC4242Annual = ('en_stripe_recur_cc4242_annual_' + tomorrowsDate + '@engagingnetworks.online')
  const donationRecurCC4242 = ('en_stripe_recur_cc4242_donation_' + tomorrowsDate + '@engagingnetworks.online')


  var newdonationRecurSepa

  var newdonationRecurCC3220
  var newdonationRecurCC3063
  var newdonationRecurCC3155
  var newdonationRecurCC4242


  it('it submits annual recurring sepa_debit transaction', () => {

    cy.visit(Cypress.env('test') + 'page/13346/donate/1')
    ENpage.emailPage().clear().type(donationRecurSepaAnnual)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    context('Actions', () => {
      cy.getWithinIframe('[name="iban"]').type('GB82WEST12345698765432')

    })
    ENpage.submitPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'BANK_RECURRING')
    thankyouPageSepa()
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurSepa = $usage.text()
    })
  })


  it('it submits semi annual recurring sepa_debit transaction', () => {

    cy.visit(Cypress.env('test') + 'page/13346/donate/1')
    ENpage.emailPage().clear().type(donationRecurSepa)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('SEMI_ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    context('Actions', () => {
      cy.getWithinIframe('[name="iban"]').type('GB82WEST12345698765432')

    })
    ENpage.submitPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'BANK_RECURRING')
    thankyouPageSepa()
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurSepa = $usage.text()
    })
  })



  it('it submits annual recurring 3D transaction 4000000000003220', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC3220Annual)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000000000003220')
    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3dIframe().find("[id*=test-source-authorize]").click()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC3220 = $usage.text()
    })
  })

  it('it submits semi annual recurring 3D transaction 4000000000003220', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC3220)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('SEMI_ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000000000003220')
    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3dIframe().find("[id*=test-source-authorize]").click()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC3220 = $usage.text()
    })
  })


  it('it submits annual recurring MC transaction 5555555555554444', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC4444Annual)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('5555555555554444')
    ENpage.submitPage()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC3063 = $usage.text()
    })
  })

  it('it submits semi annual recurring MC transaction 5555555555554444', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC4444)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('SEMI_ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('5555555555554444')
    ENpage.submitPage()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC3063 = $usage.text()
    })
  })


  it('it submits annual recurring transaction 4242424242424242', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC4242Annual)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4242424242424242')
    ENpage.submitPage()
    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC4242 = $usage.text()
    })
  })

  it('it submits semi annual recurring transaction 4242424242424242', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC4242)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('SEMI_ANNUAL')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4242424242424242')
    ENpage.submitPage()
    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC4242 = $usage.text()
    })
  })

  function thankyouPage() {
    cy.location('pathname').should('include', 'page/13415/donate/3')
    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9271')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('$100.99')
  }

  function thankyouPageSepa() {
    cy.location('pathname').should('include', 'page/13346/donate/3')
    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9186')
    cy.get('@thankYouPage').contains('EUR')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('€100.99')
    cy.get('@thankYouPage').contains('TEST: sepa_debit')
  }

})