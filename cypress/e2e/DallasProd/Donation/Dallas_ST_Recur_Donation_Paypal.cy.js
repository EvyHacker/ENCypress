/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'

const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM_DD_YYYY_mm')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test recur donation paypal', () => {
  const email = ('st_recurdonation_channel' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/13387/donate/1?ea.tracking.id=en_email&utm_content=ST_Recurring%20Donation_ORIG%20-%20Dallas%20Paypal&utm_campaign=TestMe&utm_medium=email&utm_source=engagingnetworks')
  })

  it('has correct data', () => {

    ENpage.firstName().should('have.value', 'ST')
    ENpage.lastName().should('have.value', 'Recur Donation')
    ENpage.emailPage()
      .should('have.value', 'st_recurdonation@engagingnetworks.online')
    ENpage.address1Page().should('have.value', 'address1')
    ENpage.cityPage().should('have.value', 'Tribeca')
    ENpage.regionPage().should('have.value', 'NY')
    ENpage.postCodePage().should('have.value', '06888')
    ENpage.countryPage().should('have.value', 'US')
    cy.get('#en__field_transaction_paycurrency').should('have.value', 'USD')
    cy.get('#en__field_transaction_paymenttype').should('have.value', 'Visa')
    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'Smoke Test CC Name')
    cy.get('#en__field_transaction_ccnumber').should('have.value', '4222222222222')
    cy.get('#en__field_transaction_ccvv').should('have.value', '111')
    cy.get('#en__field_transaction_recurrfreq').should('have.value', 'MONTHLY')
  })

  it('validates recurring check box', () => {

    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input')
      .type('2024')
    cy.get('#en__field_transaction_recurrpay').click()
    ENpage.submitPage()
    cy.get('.en__field__error').invoke('text').should('eq', 'Recurring Payment Mandatory Field Empty')
  })

  it('it submits recurring donation', () => {

    ENpage.emailPage().clear().type(email)
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')
    cy.get('#en__field_transaction_donationAmt2').click()
    ENpage.submitPage()
    cy.location('pathname').should('eq', '/page/13387/donate/2')
    cy.get('.en__component--column > .en__component > :nth-child(5)').contains('ST')
    cy.get('.en__component--column > .en__component > :nth-child(6)').contains('Recur Donation')
    cy.get('.en__component--column > .en__component > :nth-child(7)').contains('address1')
    cy.get('.en__component > :nth-child(8)').contains('Tribeca')
    cy.get('.en__component > :nth-child(9)').contains('NY')
    cy.get('.en__component > :nth-child(10)').contains(email)
    cy.get('.en__component > :nth-child(11)').contains('06888')
    cy.get('.en__component > :nth-child(12)').contains('US')
    cy.get('.en__component > :nth-child(13)').contains('Smoke Test CC Name')
    //cy.get('.en__component > :nth-child(14)').contains('3960093')
    cy.get('.en__component > :nth-child(15)').contains('39340')
    cy.get('.en__component > :nth-child(16)').invoke('text').as('myNumber')
    cy.get('.en__component > :nth-child(17)').contains('CREDIT_RECURRING')
    //cy.get('#scroll-horizontal button').scrollIntoView().should('be.visible')
    cy.get(':nth-child(18)').contains('USD')
    cy.get(':nth-child(20)').contains('PayPal Gateway')
    cy.get(':nth-child(21)').contains('Visa')
    //cy.get(':nth-child(22)'),should('have','012024')
    cy.get(':nth-child(24)').contains('$10.00')
    cy.get(':nth-child(26)').contains('MONTHLY')
  })
})

describe('test us.e-activist LogIn ', () => {

  const email = ('st_recurdonation_channel' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters donation transaction', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
    EN.enterSupporter()
      .type(email)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcr')
    })
    EN.logOut()
  })
})