/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'

const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('DD-MM-YYYY')

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false

})

describe('test Single and/or Recurring donation ', () => {

    const emailSingle = ('st_eventssingleticket_' + todaysDate + '@engagingnetworks.online')
    const emailGroup = ('st_eventsgroupticket_' + todaysDate + '@engagingnetworks.online')

    beforeEach(() => {
        cy.visit(Cypress.env('dallas') + 'page/15237/event/1')
    })

    it('can purchase single ticket', () => {

        //validate if the user can add more than  1 ticket
        cy.get(':nth-child(1) > .en__ticket__field--quantity > .en__ticket__selector > .en__ticket__plus').click()
        ENpage.eventCheckOut().click()

        cy.location('pathname').should('include', '/page/15237/event/2')
        cy.get('.en__orderSummary__item > .en__orderSummary__data--type').should('have.text', 'SINGLE')
        cy.get('.en__orderSummary__data--quantity').should('have.text', '1')
        cy.get('.en__registrants__ticketHead').should('have.text', 'SINGLE ticket 1')
        AddSingleTicket()

        ENpage.eventTotalSummary().should('have.text', '$1.00')
        ENpage.emailPage().type(emailSingle)
        AddCC()

        ValidateThankYouPage()
        cy.get('.en__component > :nth-child(10)').contains(emailSingle)
        cy.get(':nth-child(24)').contains('$1.00')

    })

    it('can purchase group tickets', () => {

        cy.get(':nth-child(2) > .en__ticket__field--quantity > .en__ticket__selector > .en__ticket__plus').click()
        ENpage.eventCheckOut().click()

        cy.location('pathname').should('include', '/page/15237/event/2')
        cy.get('.en__orderSummary__item > .en__orderSummary__data--type').should('have.text', 'GROUP')
        cy.get('.en__orderSummary__data--quantity').should('have.text', '1')
        cy.get('.en__registrants__ticketHead').should('have.text', 'GROUP ticket 1')
        AddGroupTicket()

        ENpage.eventTotalSummary().should('have.text', '$10.00')
        ENpage.emailPage().type(emailGroup)

        AddCC()

        ValidateThankYouPage()
        cy.get('.en__component > :nth-child(10)').contains(emailGroup)
        cy.get(':nth-child(24)').contains('$10.00')

    })

    it('can add additional donation amount', () => {

        cy.get(':nth-child(1) > .en__ticket__field--quantity > .en__ticket__selector > .en__ticket__plus').click()
        cy.get(':nth-child(2) > .en__ticket__field--quantity > .en__ticket__selector > .en__ticket__plus').click()
        ENpage.addAdditionalAmount().type('25.00')
        ENpage.eventCheckOut().click()
        ENpage.eventTotalSummary().should('have.text', '36.00 USD')
        ENpage.emailPage().type(emailGroup)
        AddMultiTickets()
        AddSingleTicket()
        AddGroupTicket()
        AddCC()
        ValidateThankYouPage()

        cy.get('.en__component > :nth-child(10)').contains(emailGroup)
        cy.get(':nth-child(24)').contains('$36.00')

    })

    it('can add promo code per single ticket', () => {

        cy.get(':nth-child(2) > .en__ticket__field--quantity > .en__ticket__selector > .en__ticket__plus').dblclick()
        ENpage.eventDiscount().type('10DISC')
        ENpage.eventCheckOut().click()

        cy.location('pathname').should('include', '/page/15237/event/2')
        cy.get('.en__orderSummary__item > .en__orderSummary__data--type').should('have.text', 'GROUP')
        cy.get('.en__orderSummary__data--quantity').should('have.text', '2')
        cy.get(':nth-child(1) > .en__registrants__ticketHead').should('have.text', 'GROUP ticket 1')
        cy.get(':nth-child(2) > .en__registrants__ticketHead').should('have.text', 'GROUP ticket 2')
        ENpage.eventTotalSummary().should('have.text', '19.00 USD')
        ENpage.emailPage().type(emailGroup)
        AddGroupTicket()
        AddMultiGroupTicket()
        AddCC()
        ValidateThankYouPage()

        cy.get('.en__component > :nth-child(10)').contains(emailGroup)
        cy.get(':nth-child(24)').contains('$19.00')


    })

    it('can add promo code per order total', () => {

        cy.get(':nth-child(1) > .en__ticket__field--quantity > .en__ticket__selector > .en__ticket__plus').click()
        cy.get(':nth-child(2) > .en__ticket__field--quantity > .en__ticket__selector > .en__ticket__plus').click()
        ENpage.addAdditionalAmount().type('55.00')
        ENpage.eventDiscount().type('10TOTAL')
        cy.wait(3000)
        ENpage.eventCheckOut().click()

        cy.location('pathname').should('include', '/page/15237/event/2')
        ENpage.eventTotalSummary().should('have.text', '64.90 USD')
        ENpage.emailPage().type(emailGroup)
        AddSingleTicket()

        cy.get('.en__orderSummary__item--2378 > .en__orderSummary__data--cost').should('have.text', '0.90 USD')
        cy.get('.en__orderSummary__item--2377 > .en__orderSummary__data--cost').should('have.text', '9.00 USD')
        cy.get('.en__orderSummary__additional > .en__orderSummary__data--cost').should('have.text', '55.00 USD')
        AddGroupTicket()
        AddCC()
        ValidateThankYouPage()

        cy.get('.en__component > :nth-child(10)').contains(emailGroup)
        cy.get(':nth-child(24)').contains('$64.90')

    })

    it('can not proceed with no tickets selected', () => {

        ENpage.eventCheckOut().click()
        cy.get('.en__error').should('have.text', 'No Tickets Selected')

    })

    function AddSingleTicket() {

        //Attendee 1
        cy.get('#en__field_event_ticketType_0_tickets_0_registrants_0_firstName').type('Test')
        cy.get('#en__field_event_ticketType_0_tickets_0_registrants_0_lastName').type('Single Ticket')
        cy.get('#en__field_event_ticketType_0_tickets_0_registrants_0_emailAddress').type('st_eventsdallas@engagingnetworks.online')
        cy.get('#en__field_event_ticketType_0_tickets_0_registrants_0_dietaryPreference').type('No dairy')
        cy.get('#en__field_event_ticketType_0_tickets_0_registrants_0_mobilityRequirement').type('No text messages')
    }

    function AddGroupTicket() {

        //Attendee 1
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_0_firstName').type('Test')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_0_lastName').type('Group Ticket')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_0_emailAddress').type('st_eventsdallas@engagingnetworks.online')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_0_dietaryPreference').type('No dairy')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_0_mobilityRequirement').type('No text messages')
        //Attendee 2
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_1_firstName').type('Test1')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_1_lastName').type('Group Ticket1')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_1_emailAddress').type('st_eventsdallas@engagingnetworks.online')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_1_dietaryPreference').type('No soy')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_1_mobilityRequirement').type('No phone calls')
        //Attendee 3
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_2_firstName').type('Test2')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_2_lastName').type('Group Ticket2')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_2_emailAddress').type('st_eventsdallas@engagingnetworks.online')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_2_dietaryPreference').type('N/A')
        cy.get('#en__field_event_ticketType_1_tickets_0_registrants_2_mobilityRequirement').type('N/A')
    }

    function AddMultiGroupTicket() {

        //Attendee 1
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_0_firstName').type('Test')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_0_lastName').type('Group 2nd Ticket')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_0_emailAddress').type('st_eventsdallas@engagingnetworks.online')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_0_dietaryPreference').type('No dairy')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_0_mobilityRequirement').type('No text messages')
        //Attendee 2
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_1_firstName').type('Test1')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_1_lastName').type('Group 2nd Ticket1')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_1_emailAddress').type('st_eventsdallas@engagingnetworks.online')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_1_dietaryPreference').type('No soy')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_1_mobilityRequirement').type('No phone calls')
        //Attendee 3
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_2_firstName').type('Test2')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_2_lastName').type('Group 2nd Ticket2')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_2_emailAddress').type('st_eventsdallas@engagingnetworks.online')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_2_dietaryPreference').type('N/A')
        cy.get('#en__field_event_ticketType_1_tickets_1_registrants_2_mobilityRequirement').type('N/A')
    }

    function AddMultiTickets() {

        cy.location('pathname').should('include', '/page/15237/event/2')
        cy.get('.en__orderSummary__item--2378 > .en__orderSummary__data--type').should('have.text', 'SINGLE')
        cy.get('.en__orderSummary__item--2377 > .en__orderSummary__data--type').should('have.text', 'GROUP')
        cy.get('.en__orderSummary__item--2378 > .en__orderSummary__data--quantity').should('have.text', '1')
        cy.get('.en__orderSummary__item--2377 > .en__orderSummary__data--quantity').should('have.text', '1')

        cy.get(':nth-child(1) > .en__registrants__ticketHead').should('have.text', 'SINGLE ticket 1')
        cy.get(':nth-child(2) > .en__registrants__ticketHead').should('have.text', 'GROUP ticket 1')

    }

    function AddCC() {

        ENpage.firstName().type('Evy')
        ENpage.lastName().type('Test')
        ENpage.address1Page().type('1146 19th Street NW, Suite 800')
        ENpage.cityPage().type('Washington')
        ENpage.regionPage().select('DC')
        ENpage.countryPage().select('US')
        ENpage.postCodePage().type('20001')

        cy.get('#en__field_supporter_creditCardHolderName').type('Evy')
        cy.get('#en__field_transaction_ccnumber').type('4222222222222220')
        ENpage.ccExpiryDate().type('01/2023')
        cy.get('#en__field_transaction_ccvv').type('123')
        ENpage.submitPage()

    }

    function ValidateThankYouPage() {

        cy.location('pathname').should('include', '/page/15237/event/3')
        cy.get('.en__component--column > .en__component').as('thankcopy')
        cy.get('@thankcopy').contains('Evy')
        cy.get('@thankcopy').contains('Test')
        cy.get('@thankcopy').contains('1146 19th Street NW, Suite 800')
        cy.get('@thankcopy').contains('Washington')
        cy.get('@thankcopy').contains('DC')
        cy.get('@thankcopy').contains('20001')
        cy.get('@thankcopy').contains('US')
        cy.get('@thankcopy').contains('Evy')
        cy.get('@thankcopy').contains('43843')
        cy.get('@thankcopy').contains('CREDIT_SINGLE')
        cy.get('@thankcopy').contains('USD')
        cy.get('@thankcopy').contains('IATS North America')
        cy.get('@thankcopy').contains('VISA')

    }
})
describe('test us.e-activist LogIn ', () => {

    const emailSingle = ('st_eventssingleticket_' + todaysDate + '@engagingnetworks.online')
    const emailGroup = ('st_eventsgroupticket_' + todaysDate + '@engagingnetworks.online')

    beforeEach(() => {
        cy.visit(Cypress.env('dallasLogIn') + '#login')
        EN.login()
    })

    it('searches for the single ticket transaction', () => {


        EN.enterSupporter()
            .type(emailSingle)
        EN.searchSupporter()
        EN.lookupSupporter().click()
        EN.transactionType().invoke('text').then((text) => {
            expect(text.trim()).contains('ecs')
        })
    })

    it('searches for the group ticket transaction', () => {


        EN.enterSupporter()
            .type(emailGroup)
        EN.searchSupporter()
        EN.lookupSupporter().click()
        EN.transactionType().invoke('text').then((text) => {
            expect(text.trim()).contains('ecs')
        })
        EN.logOut()
    })
})