/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('DD-MM-YYYY')
const tomorrowsDate = dayjs().add(1, 'hr').format('DD-MM-YYYY')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})


describe('test partial refund for Vantiv gateway for Single and Recurring transactions', () => {

  const donationSingle = ('en_vantiv_refunded_single_' + todaysDate + '@engagingnetworks.online')
  const donationRecur = ('en_vantiv_refunded_recur_' + tomorrowsDate + '@engagingnetworks.online')
  const donationSingleBank = ('en_vantiv_refunded_recur_bank' + todaysDate + '@engagingnetworks.online')


  beforeEach(() => {
    cy.visit(Cypress.env('test') + 'page/13714/donate/1?mode=DEMO')
  })

  it('can submit single donation', () => {


    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('111.99')
    ENpage.emailPage().clear().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay1').check()
    cy.get('#en__field_transaction_paymenttype').select('VI').should('have.value', 'VI')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    cy.get('#en__field_transaction_ccvv').type('123')
    ENpage.submitPage()

    thankYouPage()

    cy.get('.en__component--column > .en__component').contains('CREDIT_SINGLE')
    cy.get('.en__component--column > .en__component').contains('TEST: VI')


  })

  it('can submit recurring donation', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('111.99')
    ENpage.emailPage().clear().type(donationRecur)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    cy.get('#en__field_transaction_paymenttype').select('VI').should('have.value', 'VI')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    cy.get('#en__field_transaction_ccvv').type('123')
    ENpage.submitPage()

    cy.get('.en__component--column > .en__component').contains('CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component').contains('TEST: VI')

  })

  it('can submit single bank donation', () => {


    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('111.99')
    ENpage.emailPage().clear().type(donationSingleBank)
    cy.get('#en__field_transaction_recurrpay1').check()
    cy.get('#en__field_transaction_paymenttype').select('ACHEFT').should('have.value', 'ACHEFT')
    cy.get('#en__field_supporter_bankAccountType').type('Checking')
    cy.get('#en__field_supporter_bankAccountNumber').type('1099999999')
    cy.get('#en__field_supporter_bankRoutingNumber').type('011075150')
    ENpage.submitPage()

    cy.get('.en__component--column > .en__component').contains('BANK_SINGLE')
    cy.get('.en__component--column > .en__component').contains('TEST: Checking')

  })

  function thankYouPage() {
    cy.location('pathname').should('include', '/page/13714/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9588')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('Vantiv Gateway')
    cy.get('@thankYouPage').contains('$111.99')

  }
})

describe('test partial refund for single and recurring transactions', () => {

    const donationSingle = ('en_vantiv_refunded_single_' + todaysDate + '@engagingnetworks.online')
    const donationRecur = ('en_vantiv_refunded_recur_' + tomorrowsDate + '@engagingnetworks.online')
    const donationSingleBank = ('en_vantiv_refunded_recur_bank' + todaysDate + '@engagingnetworks.online')
  const donationTypeSingle = ('.gadget__singleDonations__donation__header')
  const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')

  beforeEach(() => {
    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
  })


  it('searches for the single transaction and mark is as refunded', () => {

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
    EN.logOut()
  })

  it('searches for the recurring transaction and mark it as refunded', () => {

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
      cy.get('.gadget__transactionHistory__transactionDetail').invoke('text').should('include', '111.99 USD')
      EN.logOut()

  })

  it('searches for the single bank transaction and cmark it as refunded', () => {


    EN.enterSupporter()
      .type(donationSingleBank)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fbs')
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
      cy.get('.gadget__transactionHistory__transactionDetail').invoke('text').should('include', '111.99 USD')
      EN.logOut()
  })
})