/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY_hh_mm')
const ticket = ('dallas_iats_partial_event_' + todaysDate + '@engagingnetworks.online')
const ticketDiscount = ('dallas_iats_partial_event_discount_' + todaysDate + '@engagingnetworks.online')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})


describe('test partial refund for Iats gateway for event tickets', () => {

  const event = ('.gadget__events__item')
  var newTicket
  var newTicketDiscount

  it('can purchase and validate tickets ', () => {

    cy.visit(Cypress.env('dallas') + 'page/20442/event/1')
    cy.wait(5000)
    cy.get('.en__ticket__price').should((price) => {
      expect(price.eq(0)).to.include.text('10.99')
      expect(price.eq(1)).to.include.text('25.99')
      expect(price.eq(2)).to.include.text('100.99')
    })
    ENpage.addTicket().eq(0).dblclick()
    ENpage.addTicket().eq(1).dblclick()
    ENpage.addTicket().eq(2).dblclick()
    ENpage.addAdditionalAmount().type('155.50')
    cy.wait(5000)
    ENpage.eventCheckOut().click()
    cy.url().should('include', '/20442/event/2')
    ENpage.eventTotalSummary().should('have.text', '$431.44')
    ENpage.emailPage().type(ticket)
    ENpage.ccExpiryDate().type('01')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()
    cy.url().should('include', '/20442/event/3')
    cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
      newTicket = $usage.text()
    })
  })

  it('can purchase and validate tickets with discount', () => {

    cy.visit(Cypress.env('dallas') + 'page/20442/event/1?mode=DEMO')
    cy.wait(5000)
    cy.get('.en__ticket__price').should((price) => {
      expect(price.eq(0)).to.include.text('10.99')
      expect(price.eq(1)).to.include.text('25.99')
      expect(price.eq(2)).to.include.text('100.99')
    })
    ENpage.addTicket().eq(0).dblclick()
    ENpage.addTicket().eq(1).dblclick()
    ENpage.addTicket().eq(2).dblclick()
    ENpage.addAdditionalAmount().type('155.50')
    ENpage.eventDiscount().type('DISC10')
    ENpage.eventCheckOut().click()
    cy.wait(5000)
    cy.url().should('include', '/20442/event/2')
    ENpage.eventTotalSummary().should('have.text', '$391.44')
    ENpage.emailPage().type(ticketDiscount)
    ENpage.ccExpiryDate().type('01')
    ENpage.ccExpiryYear().type('2024')
    ENpage.submitPage()
    cy.url().should('include', '/20442/event/3')
    cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
      newTicketDiscount = $usage.text()
    })

  })

  it('refunds only tickets', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
    EN.enterSupporter().type(newTicket)
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
      cy.get('td').eq(0).find('input').should('have.value', '4045').check()
      cy.get('td').eq(1).should('have.text', 'Ticket')
      cy.get('td').eq(3).should('have.text', '10.99 USD')
      cy.get('td').eq(5).should('have.text', 'Ticket')
      cy.get('td').eq(7).should('have.text', '10.99 USD')
      cy.get('td').eq(8).find('input').should('have.value', '4046').check()
      cy.get('td').eq(9).should('have.text', 'VIP')
      cy.get('td').eq(11).should('have.text', '25.99 USD')
      cy.get('td').eq(13).should('have.text', 'VIP')
      cy.get('td').eq(15).should('have.text', '25.99 USD')
      cy.get('td').eq(16).find('input').should('have.value', '4047').check()
      cy.get('td').eq(17).should('have.text', 'Group')
      cy.get('td').eq(23).should('have.text', '100.99 USD')
      cy.get('td').eq(25).should('have.text', 'Group')
      cy.get('td').eq(31).should('have.text', '100.99 USD')
      cy.get('td').eq(35).should('include.text', '155.50 USD')

    })
    EN.eventRefundAmount().should('have.text', '137.97')
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()

    cy.wait(10000)
    cy.reload()
    EN.transactionType().eq(0).invoke('text')
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

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
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
    // cy.get('.gadget__receipt > .gadget__events__table > :nth-child(1) > :nth-child(2) > :nth-child(7) > :nth-child(1)').check()
    cy.wait(2000)
    cy.get('.refund__additional').should('have.value', 'additional')
    cy.wait(5000)
    cy.get('.refund__additional').click()
    cy.get('.refund__additional__input', { timeout: 10000 }).clear().type('19.99')
    //cy.get('td > .gadget__receipt__field').should('contain.text', '19.99')
    cy.wait(5000)
    cy.get('.refund__additional').click()
    cy.get('label > input').check()
    cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '1')
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

  it('refunds partial additional amount and all tickets', () => {
    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
    EN.enterSupporter()
      .type(newTicket)
    EN.searchSupporter()
    EN.lookupSupporter().click()

    cy.wait(2000)
    cy.reload()
    ENpage.eventESCpartial()
    // cy.get(event, { timeout: 10000 }).eq(2).should('be.visible').click()
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
    cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()

    cy.wait(5000)
    cy.reload()
    ENpage.eventRfd()
    //cy.get(event, { timeout: 10000 }).eq(0).should('be.visible').click()
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-273.48 USD')
    EN.logOut()

  })

  it('refunds tickets with discount code', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
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
    cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '1')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()

    cy.wait(5000)
    cy.reload()
    ENpage.eventRfd()
    //cy.get(event, { timeout: 10000 }).eq(0).should('be.visible').click()
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
    cy.get('@refund').should('include', '-391.44 USD')
    ENpage.eventESCrfd()
      .should('be.visible').click()
    //cy.get(event, { timeout: 10000 }).eq(1).should('be.visible').click()
    cy.get('.gadget__events__view').should('be.visible')
    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 0 USD')
    cy.get('td > .gadget__receipt__field').should('contain.text', '391.44 USD')

    EN.logOut()


  })

})