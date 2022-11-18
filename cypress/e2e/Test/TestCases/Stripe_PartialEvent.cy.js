/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM_DD_YYYY_hh_mm')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test partial refund for Iats gateway for event tickets', () => {

  const ticket = ('en_stripe_partial_events_' + todaysDate + '@engagingnetworks.online')
  const ticketDiscount = ('en_stripe_partial_event_discount_' + todaysDate + '@engagingnetworks.online')
  const ticketFee = ('en_stripe_partial_events_fee_' + todaysDate + '@engagingnetworks.online')
  const ticketFeeDiscount = ('en_stripe_partial_events_fee_discount_' + todaysDate + '@engagingnetworks.online')
  const event = ('.gadget__events__item')
  var newTicket
  var newTicketDiscount
  var newTicketFee
  var newTicketFeeDiscount

  it('can purchase and validate tickets ', () => {

    cy.visit(Cypress.env('test') + 'page/13218/event/1?ea.tracking.id=ticket_dub&mode=DEMO')
    cy.wait(5000)
    cy.get('.en__ticket__price').should((price) => {
      expect(price.eq(0)).to.include.text('10.99')
      expect(price.eq(1)).to.include.text('25.99')
      expect(price.eq(2)).to.include.text('100.99')
    })
    ENpage.addTicket().eq(0).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(1).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(2).dblclick({ delay: 1000 })
    ENpage.addAdditionalAmount().type('155.50', { delay: 100 })
    ENpage.eventCheckOut().click({ delay: 2000 })
    cy.url().should('include', '/13218/event/2')
    ENpage.eventTotalSummary().should('have.text', '$431.44')
    ENpage.emailPage().clear().type(ticket)
    ENpage.ccExpiryDate().type('01')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()
    cy.url().should('include', '/13218/event/3')
    cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
      newTicket = $usage.text()
    })
  })

  it('can purchase and validate tickets with discount', () => {

    cy.visit(Cypress.env('test') + 'page/13218/event/1?https://politicalnetworks.com/page/13218/event/1?ea.tracking.id=%D0%B2%D0%B0%D0%BF%D0%BA%D0%BF%D1%84%D1%84%D1%8B%D0%B2%D0%B0!&utm_content=Stripe%20partial%20tickets%20refund&utm_campaign=stripe_event&utm_medium=referral&utm_source=blog&mode=DEMO')
    cy.wait(5000)
    cy.get('.en__ticket__price').should((price) => {
      expect(price.eq(0)).to.include.text('10.99')
      expect(price.eq(1)).to.include.text('25.99')
      expect(price.eq(2)).to.include.text('100.99')
    })
    ENpage.addTicket().eq(0).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(1).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(2).dblclick({ delay: 1000 })
    ENpage.addAdditionalAmount().type('155.50', { delay: 100 })
    ENpage.eventDiscount().type('DISC10', { delay: 100 })
    ENpage.eventCheckOut().click({ delay: 2000 })
    cy.url().should('include', '/13218/event/2')
    ENpage.eventTotalSummary().should('have.text', '$391.44')
    ENpage.emailPage().clear().type(ticketDiscount)
    ENpage.ccExpiryDate().type('01')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()
    cy.url().should('include', '/13218/event/3')
    cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
      newTicketDiscount = $usage.text()
    })
  })

  it('can purchase and validate tickets with fees', () => {

    cy.visit(Cypress.env('test') + 'page/13218/event/1?ea.tracking.id=ticket_dub&mode=DEMO')
    cy.get('.en__ticket__price').should((price) => {
      expect(price.eq(0)).to.include.text('10.99')
      expect(price.eq(1)).to.include.text('25.99')
      expect(price.eq(2)).to.include.text('100.99')
    })
    ENpage.addTicket().eq(0).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(1).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(2).dblclick({ delay: 1000 })
    ENpage.addAdditionalAmount().type('155.50', { delay: 100 })
    ENpage.eventCheckOut().click({ delay: 2000 })
    cy.url().should('include', '/13218/event/2')
    ENpage.eventTotalSummary().should('have.text', '$431.44')
    cy.get('#en__field_transaction_feeCover').click()
    ENpage.eventTotalSummary().should('have.text', '$437.43')
    ENpage.emailPage().clear().type(ticketFee)
    ENpage.ccExpiryDate().type('01')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()
    cy.url().should('include', '/13218/event/3')
    cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
      newTicketFee = $usage.text()
    })
  })

  it('can purchase and validate tickets with fees and discount', () => {

    cy.visit(Cypress.env('test') + 'page/13218/event/1?https://politicalnetworks.com/page/13218/event/1?ea.tracking.id=%D0%B2%D0%B0%D0%BF%D0%BA%D0%BF%D1%84%D1%84%D1%8B%D0%B2%D0%B0!&utm_content=Stripe%20partial%20tickets%20refund&utm_campaign=stripe_event&utm_medium=referral&utm_source=blog&mode=DEMO')
    cy.get('.en__ticket__price').should((price) => {
      expect(price.eq(0)).to.include.text('10.99')
      expect(price.eq(1)).to.include.text('25.99')
      expect(price.eq(2)).to.include.text('100.99')
    })
    ENpage.addTicket().eq(0).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(1).dblclick({ delay: 1000 })
    ENpage.addTicket().eq(2).dblclick({ delay: 1000 })
    ENpage.addAdditionalAmount().type('155.50', { delay: 100 })
    ENpage.eventDiscount().type('DISC10', { delay: 100 })
    ENpage.eventCheckOut().click({ delay: 2000 })
    cy.url().should('include', '/13218/event/2')
    ENpage.eventTotalSummary().should('have.text', '$391.44')
    cy.get('#en__field_transaction_feeCover').click()
    ENpage.eventTotalSummary().should('have.text', '$397.43')
    ENpage.emailPage().clear().type(ticketFeeDiscount)
    ENpage.ccExpiryDate().type('01')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()
    cy.url().should('include', '/13218/event/3')
    cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
      newTicketFeeDiscount = $usage.text()
    })
  })

  it('refunds only tickets', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newTicket)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('ecs')
      })

    cy.wait(2000)
    cy.get(event).should('be.visible').click()

    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 431.44 USD')
    cy.get('.gadget__events__table').find('tr').within(() => {
      cy.get('td').eq(0).find('input').should('have.value', '4160').check()
      cy.get('td').eq(1).should('have.text', 'Ticket')
      cy.get('td').eq(3).should('have.text', '10.99 USD')
      cy.get('td').eq(5).should('have.text', 'Ticket')
      cy.get('td').eq(7).should('have.text', '10.99 USD')
      cy.get('td').eq(8).find('input').should('have.value', '4161').check()
      cy.get('td').eq(9).should('have.text', 'VIP')
      cy.get('td').eq(11).should('have.text', '25.99 USD')
      cy.get('td').eq(13).should('have.text', 'VIP')
      cy.get('td').eq(15).should('have.text', '25.99 USD')
      cy.get('td').eq(16).find('input').should('have.value', '4162').check()
      cy.get('td').eq(17).should('have.text', 'Group')
      cy.get('td').eq(23).should('have.text', '100.99 USD')
      cy.get('td').eq(25).should('have.text', 'Group')
      cy.get('td').eq(31).should('have.text', '100.99 USD')
      cy.get('td').eq(35).should('include.text', '155.50 USD')

    })
    EN.eventRefundAmount().should('have.text', '137.97')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('rfd')
      })
    cy.wait(3000)
    cy.reload()

    ENpage.eventRfd()
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-137.97 USD')
    ENpage.eventESCrfd()

    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 293.47 USD')
    cy.get('.gadget__events__table').find('tr').within(() => {
      cy.get('td').eq(0).find('input').should('be.disabled')
      cy.get('td').eq(8).find('input').should('be.disabled')
      cy.get('td').eq(16).find('input').should('be.disabled')

    })
    EN.logOut()
  })

  it('refunds only partial additional amount', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newTicket)
    EN.searchSupporter()
    EN.lookupSupporter().click()

    cy.wait(5000)
    cy.reload()

    ENpage.eventESCrfd()

    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 293.47 USD')
    cy.get('.refund__additional').should('have.value', 'additional').click()
    

    cy.wait(2000)
    cy.get('.refund__additional').should('have.value', 'additional')
    cy.wait(5000)
    cy.get('.refund__additional').click()
    cy.get('.refund__additional__input', { timeout: 10000 }).clear().type('19.99')
    cy.wait(5000)
    cy.get('.refund__additional').click()

    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()

    ENpage.eventRfd()

    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-19.99 USD')
    ENpage.eventESCpartial()

    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 273.48 USD')

    EN.logOut()

  })

  it.skip('refunds partial additional amount and all tickets', () => {

    logIn()
    EN.enterSupporter()
      .type(newTicket)
    EN.searchSupporter()
    cy.wait(4000)
    cy.get('.icon--search--color').should('be.visible').click()

    cy.get(event).eq(2).click()
    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 273.48 USD')
    cy.get('.gadget__events__table').find('tr').within(() => {
      cy.get('td').eq(4).find('input').check()
      cy.get('td').eq(12).find('input').check()
      cy.get('td').eq(24).find('input').check()
      cy.get('td').eq(39).should('include.text', '19.99 USD')

    })
    cy.get('.refund__additional').should('have.value', 'additional').check()
    cy.get('.refund__additional__input').should('have.value', '135.51')
    cy.get('td > .gadget__receipt__field').should('contain.text', '273.48')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    cy.get(event).eq(0).click().trigger('mouseover')
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-273.48 USD')


  })

  it('refunds tickets with discount code', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newTicketDiscount)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    cy.wait(2000)
    cy.get(event, { timeout: 10000 }).should('be.visible').click()
    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 391.44 USD')
    cy.get('.gadget__events__table').find('tr').within(() => {
      cy.get('td').eq(0).should('have.text', 'Ticket')
      cy.get('td').eq(2).should('have.text', '10.99 USD')
      cy.get('td').eq(3).should('have.text', 'Ticket')
      cy.get('td').eq(5).should('have.text', '10.99 USD')
      cy.get('td').eq(6).should('have.text', 'VIP')
      cy.get('td').eq(8).should('have.text', '15.99 USD')
      cy.get('td').eq(9).should('have.text', 'VIP')
      cy.get('td').eq(11).should('have.text', '15.99 USD')
      cy.get('td').eq(12).should('have.text', 'Group')
      cy.get('td').eq(18).should('have.text', '90.99 USD')
      cy.get('td').eq(19).should('have.text', 'Group')
      cy.get('td').eq(25).should('have.text', '90.99 USD')
      cy.get('td').eq(28).should('include.text', '155.50 USD')

    })

    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    ENpage.eventRfd()
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-391.44 USD')
    ENpage.eventESCrfd()
      .should('be.visible').click()
    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 0 USD')
    cy.get('td > .gadget__receipt__field').should('contain.text', '391.44 USD')

    EN.logOut()

  })

  it('refunds only tickets with fees', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')

    EN.loginTest()
    EN.enterSupporter()
      .type(newTicketFee)

    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('ecs')
      })

    cy.wait(2000)
    cy.get(event).should('be.visible').click()
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 437.43 USD')

    cy.get('.gadget__events__table').find('tr').within(() => {
      cy.get('td').eq(0).find('input').should('have.value', '4160').check()
      cy.get('td').eq(1).should('have.text', 'Ticket')
      cy.get('td').eq(3).should('have.text', '10.99 USD')
      cy.get('td').eq(5).should('have.text', 'Ticket')
      cy.get('td').eq(7).should('have.text', '10.99 USD')
      cy.get('td').eq(8).find('input').should('have.value', '4161').check()
      cy.get('td').eq(9).should('have.text', 'VIP')
      cy.get('td').eq(11).should('have.text', '25.99 USD')
      cy.get('td').eq(13).should('have.text', 'VIP')
      cy.get('td').eq(15).should('have.text', '25.99 USD')
      cy.get('td').eq(16).find('input').should('have.value', '4162').check()
      cy.get('td').eq(17).should('have.text', 'Group')
      cy.get('td').eq(23).should('have.text', '100.99 USD')
      cy.get('td').eq(25).should('have.text', 'Group')
      cy.get('td').eq(31).should('have.text', '100.99 USD')
      cy.get('td').eq(35).should('include.text', '161.49 USD')

    })

    EN.eventRefundAmount().should('have.text', '137.97')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('rfd')
      })
    cy.wait(3000)
    cy.reload()

    ENpage.eventRfd()
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-137.97 USD')
    ENpage.eventESCrfd()

    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 299.46 USD')
    cy.get('.gadget__events__table').find('tr').within(() => {
      cy.get('td').eq(0).find('input').should('be.disabled')
      cy.get('td').eq(8).find('input').should('be.disabled')
      cy.get('td').eq(16).find('input').should('be.disabled')

    })
  })

  it('refunds only partial additional amount with fees', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newTicketFee)
    EN.searchSupporter()
    EN.lookupSupporter().click()

    cy.wait(5000)
    cy.reload()

    ENpage.eventESCrfd()

    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 299.46 USD')
    cy.get('.refund__additional').should('have.value', 'additional').check()

    cy.wait(2000)
    cy.get('.refund__additional').should('have.value', 'additional')
    cy.wait(5000)
    cy.get('.refund__additional').click()
    cy.get('.refund__additional__input', { timeout: 10000 }).clear().type('160.00')
    cy.wait(5000)
    cy.get('.refund__additional').click()

    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()

    ENpage.eventRfd()

    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-160 USD')
    ENpage.eventESCpartial()

    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 139.46 USD')

    EN.logOut()
  })

  it('refunds tickets with discount code and fees', () => {

    cy.visit(Cypress.env('testLoginURL') + '#login')
    EN.loginTest()
    EN.enterSupporter()
      .type(newTicketFeeDiscount)

    EN.searchSupporter()
    EN.lookupSupporter().click()
    cy.wait(2000)
    cy.get(event, { timeout: 10000 }).should('be.visible').click()
    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 397.43 USD')
    cy.get('.gadget__events__table').find('tr').within(() => {
      cy.get('td').eq(0).should('have.text', 'Ticket')
      cy.get('td').eq(2).should('have.text', '10.99 USD')
      cy.get('td').eq(3).should('have.text', 'Ticket')
      cy.get('td').eq(5).should('have.text', '10.99 USD')
      cy.get('td').eq(6).should('have.text', 'VIP')
      cy.get('td').eq(8).should('have.text', '15.99 USD')
      cy.get('td').eq(9).should('have.text', 'VIP')
      cy.get('td').eq(11).should('have.text', '15.99 USD')
      cy.get('td').eq(12).should('have.text', 'Group')
      cy.get('td').eq(18).should('have.text', '90.99 USD')
      cy.get('td').eq(19).should('have.text', 'Group')
      cy.get('td').eq(25).should('have.text', '90.99 USD')
      cy.get('td').eq(28).should('include.text', '161.49 USD')

    })

    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    ENpage.eventRfd()
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-397.43 USD')
    ENpage.eventESCrfd()
      .should('be.visible').click()
    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 0 USD')
    cy.get('td > .gadget__receipt__field').should('contain.text', '397.43 USD')

    EN.logOut()
  })

})