/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()


const dayjs = require('dayjs')
Cypress.dayjs = dayjs
const todaysDate = dayjs().format('DD-MM-YYYY')
const tomorrowsDate = dayjs().add(1, 'hr').format('DD-MM-YYYY')
const donationSingle = ('toronto_iats_partial_single_donation_' + todaysDate + '@engagingnetworks.online')
const donationRecur = ('toronto_iats_partial_recur_donation_' + tomorrowsDate + '@engagingnetworks.online')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test partial refund for IATS gateway for Single and Recurring transactions', () => {


  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/63649/donate/1?mode=DEMO')
  })

  it('can submit single donation', () => {


    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    ENpage.emailPage().clear().type(donationSingle)
    cy.get('#en__field_transaction_recurrpay1').check()
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.url().should('include', '/page/63649/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('186546')
    cy.get('@thankYouPage').contains('CREDIT_SINGLE')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('IATS North America')
    cy.get('@thankYouPage').contains('$100.99')
    cy.get('@thankYouPage').contains('VISA')

  })

  it('can submit recurring donation', () => {

    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('111.99')
    ENpage.emailPage().clear().type(donationRecur)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrpay1').click()
    cy.get('#en__field_transaction_cardstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    ENpage.ccExpiryDate().type('10')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/63649/donate/2')

    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('186546')
    cy.get('@thankYouPage').contains('CREDIT_RECURRING')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('IATS North America')
    cy.get('@thankYouPage').contains('$111.99')
    cy.get('@thankYouPage').contains('VISA')

  })
})

describe('test partial refund for single and recurring transactions', () => {

  beforeEach(() => {
  cy.visit(Cypress.env('torontoLogIn') + '#login')
    EN.login()

    if (cy.url().should('contains', '#login/tos')) {
      cy.wait(3000)
      cy.get('.enSandbox__tos__agree').click()
    } else { cy.visit(Cypress.env('torontoLogIn') + '#dashboard', { delay: 3000 }) }
  })

  it('searches for the single ticket transaction and completes partial refund', () => {


    EN.enterSupporter().type(donationSingle)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcs')
      })

    EN.donationSingle().eq(0).click()
    EN.receiptOrig().should('be.visible')
    EN.receiptRep().should('be.visible')
    EN.tax().should('be.visible')
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 USD')
    EN.refundAmount().type('85.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund Template').should('have.value', '13148')
    cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)')
      .should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    EN.donationSingle().eq(0).click().trigger('mouseover')
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-85.99 USD')
    EN.donationSingle().eq(1).click()
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 15 USD')
    EN.searchNewSup().click()
  })

  it('searches for the recurring ticket transaction and completes partial refund', () => {

    EN.enterSupporter().type(donationRecur)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })
    EN.donationRecur().eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').click()
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 111.99 USD')
    EN.refundAmount().type('20.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund Template')
      .should('have.value', '13148')
    cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)').should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.get('.enOverlay__popup__close').click()
    cy.wait(3000)
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