/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY_mm')
const tomorrowsEvent= dayjs().add(1, 'day').format('dddd, MMMM D, YYYY')
const tomorrowsEventTime= dayjs().add(1, 'day').format('MMMM D, YYYY, ')
const tomorrowsDate = dayjs().add(1, 'day').format('DD/MM/YYYY')

//const formattedDate = dayjs($el.val(), 'DD/MM/YYYY HH:mm').format('Do MMMM YYYY HH:mm')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test partial refund for Iats gateway for event tickets', ()=>{

    const ticket = ('dallas_iats_recur_events_1' + todaysDate + '@engagingnetworks.online')
    const ticketDiscount = ('dallas_iatspartial_recur_discount_' + todaysDate + '@engagingnetworks.online')
    const event = ('.gadget__events__header')
    var newTicket
    var newTicketDiscount
    let thisTime
    const time = dayjs(thisTime).format(' HH:mm a')
   
    it.only('ceates new occurrences', () => {
 
      cy.visit(Cypress.env('dallasLogIn') + '#login')
      EN.login()
        cy.get('.enLayout__nav--main > :nth-child(1) > :nth-child(1)').click()
        cy.get(':nth-child(1) > .enLayout__nav > ul > :nth-child(1) > a').click()
        cy.get('.pages__search').type('id:30472')
        cy.wait(1000)
        cy.get('.pages__page__summary__item--name').click()
        cy.get('.pageDetailReport__manageOccurrences').click()
        cy.get('.eventScheduling__headActions > .button').click()
        cy.get('.userInput--startDate > .userInput__field > span').click()
        cy.get('.enDatePicker__date').clear().type(tomorrowsDate)
        cy.get('.enDatePicker__action--apply').click()
         cy.get('.chosen-single').eq(0).click()
         cy.get('.chosen-drop > .chosen-search > input').eq(0).type('14:00 pm')
         cy.get('.active-result').click()

      cy.get('.eventSchedulingBulk__actions > .button').click()
      cy.get('.eventScheduling__footer > .button').click()
    })

      it.only('submits an event with new occurrences', () => {

      cy.visit(Cypress.env('dallas')+'page/30472/event/1')
    
        ENpage.addTicket().eq(0).click({ delay: 1000 })
        ENpage.addAdditionalAmount().type('155.50', { delay: 100 })
        cy.get('.en__ticketRecurring__select').click()
      
        cy.get('.en__eventOccurrences__list').invoke('text').then((text) => {
                expect(text.trim()).contains(tomorrowsEvent)
            })
            cy.get('.en__eventOccurrences__list').contains(tomorrowsEvent).siblings().click()
            const time = dayjs(thisTime).format(' HH:mm a')
            cy.get('.en__occurrenceSummary__description').should('include.text', tomorrowsEventTime + '2:00 PM')
      
            ENpage.eventCheckOut().click()
            cy.url().should('include', '/30472/event/2')
            ENpage.eventTotalSummary().should('include.text', '$170.49')
            cy.get('#en__field_supporter_creditCardHolderName').type('IATS')
            ENpage.emailPage().clear().type(ticket)
            // ENpage.emailPage().then(($usage) => {
            //                newTicket = $usage
            //         })
            cy.get('#en__field_transaction_ccnumber').type('4222222222222220')
            ENpage.ccExpiryDate().type('01')
            ENpage.ccExpiryYear().type('2024')
            cy.get('#en__field_transaction_ccvv').type('123')
            ENpage.submitPage()
            cy.url().should('include', '/30472/event/3')

      })

    it.skip('can purchase and validate tickets ', () =>{

      cy.visit(Cypress.env('test')+'page/13988/event/1?')
        ENpage.addTicket().eq(0).click({ delay: 1000 })
        ENpage.addAdditionalAmount().type('155.50', { delay: 100 })
        cy.get('.en__ticketRecurring__select').click()
      
        cy.get('.en__eventOccurrences__list').invoke('text').then((text) => {
                expect(text.trim()).contains(tomorrowsEvent)
            })
            cy.get('.en__eventOccurrences__list').contains(tomorrowsEvent).siblings().click()
            
            cy.get('.en__occurrenceSummary__description').should('have.text', tomorrowsEventTime + time)
      
        // ENpage.eventCheckOut().click({ delay: 2000 })
        // cy.url().should('include', '/13224/event/2')
        // ENpage.eventTotalSummary().should('have.text', '$431.44')
        // ENpage.emailPage().clear().type(ticket)
        // ENpage.ccExpiryDate().type('01')
        // ENpage.ccExpiryYear().type('2024')
        // ENpage.submitPage()
        // cy.url().should('include', '/13224/event/3')
        // cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
        //   newTicket = $usage.text()
  //  })
  })

    it.skip('can purchase and validate tickets with discount', () =>{

      cy.visit(Cypress.env('test')+'page/13224/event/1?ea.tracking.id=ticket_emergency&mode=DEMO')
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
        cy.url().should('include', '/13224/event/2')
        ENpage.eventTotalSummary().should('have.text', '$391.44')
        ENpage.emailPage().clear().type(ticketDiscount)
        ENpage.ccExpiryDate().type('01')
        ENpage.ccExpiryYear().type('2024')
        ENpage.submitPage()
        cy.url().should('include', '/13224/event/3')
        cy.get('.en__component--copyblock > :nth-child(4)').then(($usage) => {
          newTicketDiscount = $usage.text()
    })
  })
    
    it.only('refunds only a ticket', () => {
     
      cy.visit(Cypress.env('dallasLogIn') + '#login')
      EN.login()
      EN.enterSupporter()
      .type(ticket)
      EN.searchSupporter()
      cy.wait(4000)
      cy.get('.icon--search--color').should('be.visible').click()
      EN.transactionType().invoke('text')
      .then((text) => {
        expect(text.trim()).contains('ecs')
    })

    cy.wait(2000)
    cy.get(event).should('be.visible').click()

    EN.eventResend().should('be.visible')
    EN.eventRefund().click()
    // cy.get('.gadget__receipt > .gadget__events__table > .table > tbody > :nth-child(1) > :nth-child(1)')
    // .invoke('text').should('contain', 'Amount Charged: 9.99 USD')
    // cy.get('.gadget__events__table').find('tr').within(() => {
    //     cy.get('td').eq(0).find('input').should('have.value', '4163').check()
    //     cy.get('td').eq(1).should('have.text', 'Ticket')
    //     cy.get('td').eq(3).should('have.text', '10.99 USD')
    //     cy.get('td').eq(5).should('have.text', 'Ticket')
    //     cy.get('td').eq(7).should('have.text', '10.99 USD')
    //     cy.get('td').eq(8).find('input').should('have.value', '4164').check()
    //     cy.get('td').eq(9).should('have.text', 'VIP')
    //     cy.get('td').eq(11).should('have.text', '25.99 USD')
    //     cy.get('td').eq(13).should('have.text', 'VIP')
    //     cy.get('td').eq(15).should('have.text', '25.99 USD')
    //     cy.get('td').eq(16).find('input').should('have.value', '4165').check()
    //     cy.get('td').eq(17).should('have.text', 'Group')
    //     cy.get('td').eq(23).should('have.text', '100.99 USD')
    //     cy.get('td').eq(25).should('have.text', 'Group')
    //     cy.get('td').eq(31).should('have.text', '100.99 USD')
    //     cy.get('td').eq(35).should('include.text', '155.50 USD')

    // })
    ///EN.eventRefundAmount().should('have.text', '9.99')
    cy.get('label > input').check()
    cy.get('.gadget__receipt > .gadget__events__table > .table > tbody > :nth-child(1) > :nth-child(1)').click()
    cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177' )
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
      cy.get('@refund').should('include', '-9.99 USD')
      ENpage.eventESCrfd()
  
      cy.get('.gadget__events__view').should('be.visible')
      EN.eventResend().should('be.visible')
      EN.eventRefund().click()
    cy.get(':nth-child(3) > .gadget__events__wrap > .gadget__events__receipt').invoke('text')
    .should('contain', 'Amount Charged: 160.5 USD')

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
    cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604' )
    cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
    cy.get('.gadget__receipt__buttons__send').click()
    cy.get('.message__actions__confirm').click()
    cy.wait(5000)
    cy.reload()
    cy.get(event).eq(0).click().trigger('mouseover')
    cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')   
    cy.get('@refund').should('include', '-273.48 USD')


})

it.skip('refunds tickets with discount code', () => {

  logIn()
  EN.enterSupporter()
      .type(newTicketDiscount)
    cy.get('.userInput__action > .button').should('be.visible').click()
    EN.lookupSupporter()
    cy.get(event).eq(0).click()
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
  cy.get('.gadget__receipt__field__input__receipt').select('Refund receipt').should('have.value', '604' )
  cy.get('.gadget__receipt__field__input__template').select('Default for Event Ticket Refund').should('have.value', '3')
  cy.get('.gadget__receipt__buttons__send').click()
  cy.get('.message__actions__confirm').click()
  cy.wait(5000)
  cy.reload()
  cy.get(event).eq(0).click().trigger('mouseover')
  cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')   
  cy.get('@refund').should('include', '-391.44 USD')
  cy.get(event).eq(1).click()
  cy.get('.gadget__events__view').should('be.visible')
  EN.eventResend().should('be.visible')
  EN.eventRefund().click()
  cy.get('.gadget__receipt > p').invoke('text').should('contain', 'Amount Charged: 0 USD')
  cy.get('td > .gadget__receipt__field').should('contain.text', '391.44 USD')

})

})