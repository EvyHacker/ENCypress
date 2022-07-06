/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
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

  const donationSingleSepa = ('en_stripe_sepa_single_sepa_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecurSepa = ('en_stripe_sepa_recur_sepa_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationSingleCC3220 = ('en_stripe_partial_single_cc3220_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecurCC3220 = ('en_stripe_partial_recur_cc3220_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationSingleCC3063 = ('en_stripe_partial_single_cc3063_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecurCC3063 = ('en_stripe_partial_recur_cc3063_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationSingleCC1629 = ('en_stripe_partial_single_cc1629_donation_' + todaysDate + '@engagingnetworks.online')
  const donationSingleCC3155 = ('en_stripe_partial_single_cc3155_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecurCC3155 = ('en_stripe_partial_recur_cc3155_donation_' + tomorrowsDate + '@engagingnetworks.online')
  const donationSingleCC4242 = ('en_stripe_partial_single_cc4242_donation_' + todaysDate + '@engagingnetworks.online')
  const donationRecurCC4242 = ('en_stripe_partial_recur_cc4242_donation_' + tomorrowsDate + '@engagingnetworks.online')

  var newdonationSingleSepa
  var newdonationRecurSepa
  var newdonationSingleCC3220
  var newdonationRecurCC3220
  var newdonationSingleCC3063
  var newdonationRecurCC3063
  var newdonationSingleCC3155
  var newdonationRecurCC3155
  var newdonationSingleCC4242
  var newdonationRecurCC4242

  it('it submits single sepa_debit transaction', () => {

    cy.visit(Cypress.env('test') + 'page/13346/donate/1')
    ENpage.emailPage().clear().type(donationSingleSepa)
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    context('Actions', () => {
      cy.getWithinIframe('[name="iban"]').type('NL39RABO0300065264')
    })
    ENpage.submitPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'BANK_SINGLE')
    thankyouPageSepa()
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationSingleSepa = $usage.text()
    })
  })


  it('it submits recurring sepa_debit transaction', () => {

    cy.visit(Cypress.env('test') + 'page/13346/donate/1')
    ENpage.emailPage().clear().type(donationRecurSepa)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
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

  it('it submits single 3D transaction 4000000000003220', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().type(donationSingleCC3220)
    ENpage.submitPage()
    cy.url().should('eq', 'https://test.engagingnetworks.app/page/13415/donate/2')
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000000000003220')
    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3dIframe().find("[id*=test-source-fail]").click()
    cy.location('pathname').should('include', 'page/13415/donate/2')
    cy.get('.en__error').should('have.text', 'We are unable to authenticate your payment method. Please choose a different payment method and try again.')

    ENpage.submitPage()
    cy.wait(5000)
    cy.failForStripe3dIframe().find("[id*=test-source-authorize]").click()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_SINGLE')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationSingleCC3220 = $usage.text()
    })

  })

  it('it submits recurring 3D transaction 4000000000003220', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC3220)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
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

  it('it submits single 3D transaction 4000000000003063', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().type(donationSingleCC3063)
    ENpage.submitPage()
    cy.url().should('eq', 'https://test.engagingnetworks.app/page/13415/donate/2')
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000000000003063')
    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3DIframe().find("[id*=test-source-fail]").click()
    cy.location('pathname').should('include', 'page/13415/donate/2')
    cy.get('.en__error').should('have.text', 'We are unable to authenticate your payment method. Please choose a different payment method and try again.')
    ENpage.submitPage()
    cy.wait(5000)
    cy.failForStripe3DIframe().find("[id*=test-source-authorize]").click()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_SINGLE')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationSingleCC3063 = $usage.text()
    })
  })

  it('it submits recurring 3D transaction 4000000000003063', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC3063)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000000000003063')
    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3DIframe().find("[id*=test-source-authorize-3ds]").click()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC3063 = $usage.text()
    })
  })

  it('it submits single 3D card_decline transaction 4000008400001629', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().type(donationSingleCC1629)
    ENpage.submitPage()
    cy.url().should('eq', 'https://test.engagingnetworks.app/page/13415/donate/2')
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000008400001629')
    ENpage.submitPage()
    // cy.wait(5000)
    // cy.waitForStripe3DIframe().find("[id*=test-source-authorize-3ds]").click()
    cy.get('.en__error').should('contains.text', 'Your card was declined.')

  })

  it('it submits single 3D transaction 4000002500003155', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().type(donationSingleCC3155)
    ENpage.submitPage()
    cy.url().should('eq', 'https://test.engagingnetworks.app/page/13415/donate/2')
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000002500003155')
    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3DIframe().find("[id*=test-source-fail]").click()
    cy.location('pathname').should('include', 'page/13415/donate/2')
    cy.get('.en__error').should('have.text', 'We are unable to authenticate your payment method. Please choose a different payment method and try again.')
    ENpage.submitPage()
    cy.wait(5000)
    cy.failForStripe3DIframe().find("[id*=test-source-authorize]").click()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_SINGLE')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationSingleCC3155 = $usage.text()
    })
  })

  it('it submits recurring 3D transaction 4000002500003155', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC3155)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
    ENpage.submitPage()
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4000002500003155')
    ENpage.submitPage()
    cy.wait(5000)
    cy.waitForStripe3DIframe().find("[id*=test-source-authorize-3ds]").click()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_RECURRING')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationRecurCC3155 = $usage.text()
    })
  })

  it('it submits single transaction 4242424242424242', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().type(donationSingleCC4242)
    ENpage.submitPage()
    cy.url().should('eq', 'https://test.engagingnetworks.app/page/13415/donate/2')
    cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
    cy.get('.en__field__item--other > .en__field__input').type('100.99')
    cy.get('#en__field_transaction_ccnumber').type('4242424242424242')
    ENpage.submitPage()

    thankyouPage()
    cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_SINGLE')
    cy.get('.en__component--column > .en__component > :nth-child(1)').then(($usage) => {
      newdonationSingleCC4242 = $usage.text()
    })
  })

  it('it submits recurring 3D transaction 4242424242424242', () => {

    cy.visit(Cypress.env('test') + 'page/13415/donate/1')
    ENpage.emailPage().clear().type(donationRecurCC4242)
    cy.get('#en__field_transaction_recurrpay0').check()
    cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
    cy.get('#en__field_transaction_recurrfreq').type('DAILY')
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


  

  it('searches for the single transaction and completes partial refund 4000000000003220', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationSingleCC3220)
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
    cy.get('.gadget__receipt > p').invoke('text').should('contains', 'Amount Charged: 100.99 USD')
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

  it('searches for the recurring transaction and completes partial refund 4000000000003220', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationRecurCC3220)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })
    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').then((el) => {
      if (el.length > 1) {
        cy.get('.gadget__recurringDetail__history__item').eq(1).trigger('click')
      } else {
        cy.get(el.eq(0)).trigger('click')
      }
    })
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 USD')
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

  })

  it('searches for the single transaction and completes partial refund 4000000000003063', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationSingleCC3063)
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
    cy.get('.gadget__receipt > p').invoke('text').should('contains', 'Amount Charged: 100.99 USD')
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

  it('searches for the recurring transaction and completes partial refund 4000000000003063', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationRecurCC3063)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })
    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').eq(0).click()
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 USD')
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

  })


  it('searches for the single transaction and completes partial refund 4000002500003155', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationSingleCC3155)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcs')
      })

    cy.get(donationTypeSingle).eq(0).click()
    EN.tax().should('be.visible')
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 100.99 USD')
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

  it('searches for the recurring transaction and completes partial refund 4000002500003155', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationRecurCC3155)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })
    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').then((el) => {
      if (el.length > 1) {
        cy.get('.gadget__recurringDetail__history__item').eq(1).trigger('click')
      } else {
        cy.get(el.eq(0)).trigger('click')
      }
    })

    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 USD')
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


  })

  it('searches for the single transaction and completes partial refund 4242424242424242', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationSingleCC4242)
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

  it('searches for the recurring transaction and completes partial refund 4242424242424242', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationRecurCC4242)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fcr')
      })
    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').click()
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 USD')
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

  it('searches for the single donation sepa_debit transaction and completes partial refund', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationSingleSepa)

    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fbs')
      })

    cy.get(donationTypeSingle).eq(0).click()
    EN.receiptOrig().should('be.visible')
    EN.receiptRep().should('be.visible')
    EN.tax().should('be.visible')
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 100.99 EUR')
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
    cy.get('@refund').should('include', '-85.99 EUR')
    cy.get(donationTypeSingle).eq(1).click()
    EN.refund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 15 EUR')
   
  })

  it('searches for the recurring donation sepa_debit transaction and completes partial refund', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newdonationRecurSepa)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('fbr')
      })
    cy.get(donationTypeRecur).eq(0).click()
    cy.get('.gadget__recurringDetail__history__item').eq(1).click()
    cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
    cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 100.99 EUR')
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
    cy.get('.gadget__transactionHistory__transactionDetail').invoke('text').should('include', '-20.99 EUR')


  })

  function thankyouPage() {
    cy.location('pathname').should('include', 'page/13415/donate/3')
    cy.get('.en__component--column > .en__component').as('thankYouPage')
    cy.get('@thankYouPage').contains('9271')
    cy.get('@thankYouPage').contains('USD')
    cy.get('@thankYouPage').contains('Stripe Gateway')
    cy.get('@thankYouPage').contains('$100.99')
    cy.get('@thankYouPage').contains('TEST: visa')
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