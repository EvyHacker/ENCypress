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

describe('test Single and/or Recurring donation ', () => {


  const emailWithMem = ('single_donation_memoriam_toronto_' + todaysDate + '@engagingnetworks.online')
  const emailWithoutMem = ('single_donation_no_memoriam_toronto_' + tomorrowsDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('toronto') + 'page/49593/donate/1')
  })

  it('has correct data', () => {

    ENpage.firstName().should('have.value', 'ST - Toronto')
    ENpage.lastName().should('have.value', 'Smoke Test')
    ENpage.emailPage()
      .should('have.value', 'singledonationmemoriamtoronto@engagingnetworks.online')
    ENpage.address1Page().should('have.value', 'manhattan')
    ENpage.cityPage().should('have.value', 'New York')
    ENpage.postCodePage().should('have.value', '06879')
    ENpage.regionPage().should('have.value', 'New York')
    ENpage.countryPage().should('have.value', 'USA')
    cy.get('#en__field_transaction_paymenttype').should('have.value', 'Visa')
    cy.get('#en__field_transaction_paycurrency').should('have.value', 'USD')

    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'Smoke Test CC Name')
    cy.get('#en__field_transaction_ccnumber').should('have.value', '4222222222222220')
    cy.get('#en__field_transaction_ccvv').should('have.value', '222')
  })

  it('adds missing fields without memoriam', () => {

    ENpage.emailPage().clear().type(emailWithoutMem)
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')
    cy.get('#en__field_transaction_donationAmt2').click()
    cy.get('#en__field_transaction_inmem1').check()
    AddInMem()
    ENpage.submitPage()

    ValidateThankYouPage()
    cy.get('.en__component > :nth-child(10)').contains(emailWithoutMem)
    cy.get(':nth-child(24)').contains('$5.00')

  })

  it('adds missing fields with memoriam', () => {

    ENpage.emailPage().clear().type(emailWithMem)
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')
    cy.get('#en__field_transaction_donationAmt1').click()
    cy.get('#en__field_transaction_inmem0').check()
    AddInMem()
    ENpage.submitPage()

    ValidateThankYouPage()
    cy.get('.en__component > :nth-child(10)').contains(emailWithMem)
    cy.get(':nth-child(24)').contains('$2.00')
    cy.get(':nth-child(28)').contains('single_don_test@engagingnetworks.online')
    cy.get(':nth-child(29)').contains('address test')
    cy.get(':nth-child(31)').contains('AL')
    cy.get(':nth-child(32)').contains('USA')
    cy.get(':nth-child(33)').contains('20001')

  })

  function AddInMem() {

    cy.get('#en__field_transaction_infname').type('Evy Test')
    cy.get('#en__field_transaction_infadd1').type('address test')
    cy.get('#en__field_transaction_infpostcd').type('20001')
    cy.get('#en__field_transaction_infreg').type('region test')
    cy.get('#en__field_transaction_infcountry').select('USA')
    cy.get('#en__field_transaction_infemail').type('single_don_test@engagingnetworks.online')

  }

  function ValidateThankYouPage() {

    cy.location('pathname').should('include', '/page/49593/donate/2')
    cy.get('.en__component--column').as('thankyoucopy')
    cy.get('@thankyoucopy').contains('ST - Toronto')
    cy.get('@thankyoucopy').contains('Smoke Test')
    cy.get('@thankyoucopy').contains('manhattan')
    cy.get('@thankyoucopy').contains('New York')
    cy.get('@thankyoucopy').contains('New York')
    cy.get('@thankyoucopy').contains('06879')
    cy.get('@thankyoucopy').contains('USA')
    cy.get('@thankyoucopy').contains('159816')
    cy.get('@thankyoucopy').contains('CREDIT_SINGLE')
    cy.get('@thankyoucopy').contains('USD')
    cy.get('@thankyoucopy').contains('IATS North America')
    cy.get('@thankyoucopy').contains('VISA')

  }
})
describe('test e-activist LogIn ', () => {

  const emailWithMem = ('single_donation_memoriam_toronto_' + todaysDate + '@engagingnetworks.online')
  const emailWithoutMem = ('single_donation_no_memoriam_toronto_' + tomorrowsDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('torontoLogIn') + '#login')
    EN.login()

    if (cy.url().should('contains', '#login/tos')) {
      cy.wait(3000)
      cy.get('.enSandbox__tos__agree').click()
    } else { cy.visit(Cypress.env('torontoLogIn') + '#dashboard', { delay: 3000 }) }
  })

  it('searches for the supporters single donation transaction', () => {

    EN.enterSupporter()
      .type(emailWithMem)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fim')

    })
    EN.logOut()
  })
  it('searches for the supporters recurring donation transaction', () => {

    EN.enterSupporter()
      .type(emailWithoutMem)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcs')

    })
    EN.logOut()
  })

})