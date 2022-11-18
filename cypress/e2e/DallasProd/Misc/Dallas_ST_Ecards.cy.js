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

  const email = ('st_ecard_dallas_' + todaysDate + '@engagingnetworks.online')
  const email1 = ('st_ecard_dallas_1_' + todaysDate + '@engagingnetworks.online')
  const email2 = ('st_ecard_dallas_2_' + todaysDate + '@engagingnetworks.online')
  const email3 = ('st_ecard_dallas_3_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/15833/action/1')
  })

  it('can submit the form', () => {

    cy.get('.en__ecardmessage__default').type('This is test mesaage')
    cy.get('.en__ecardrecipients__name > input').type('Evy Test')
    cy.get('.en__ecardrecipients__email > input').type(email)
    cy.get('.en__ecardrecipients__email > .en__ecarditems__button').click()
    cy.get('.ecardrecipient__name').should('have.value', 'Evy Test')
    cy.get('.ecardrecipient__email').should('have.value', email)

    ENpage.firstName().type('ST_Ecard')
    ENpage.lastName().type('Dallas')
    ENpage.emailPage().type(email)
    cy.get('.en__submit > button').click()

    validateThankYouPage()

  })

  it('can add and remove multi recepients', () => {

    cy.get('.en__ecardmessage__default').type('This is test mesaage')
    cy.get('.en__ecardrecipients__name > input').type('Evy Test')
    cy.get('.en__ecardrecipients__email > input').type(email)
    cy.get('.en__ecardrecipients__email > .en__ecarditems__button').click()
    cy.get('.en__ecardrecipients__name > input').clear().type('Evy Test1')
    cy.get('.en__ecardrecipients__email > input').clear().type(email1)
    cy.get('.en__ecardrecipients__email > .en__ecarditems__button').click()
    cy.get('.en__ecardrecipients__name > input').clear().type('Evy Test2')
    cy.get('.en__ecardrecipients__email > input').clear().type(email2)
    cy.get('.en__ecardrecipients__email > .en__ecarditems__button').click()
    cy.get('.en__ecardrecipients__name > input').clear().type('Evy Test3')
    cy.get('.en__ecardrecipients__email > input').clear().type(email3)
    cy.get('.en__ecardrecipients__email > .en__ecarditems__button').click()
    cy.get('.ecardrecipient__name').should('have.length', 4)
    cy.get('.ecardrecipient__email').should('have.length', 4)

    cy.get(':nth-child(2) > .ecardrecipient__remove > button').click()
    cy.get('.ecardrecipient__name').should('have.length', 3)
    cy.get('.ecardrecipient__email').should('have.length', 3)
    ENpage.firstName().type('ST_Ecard')
    ENpage.lastName().type('Dallas')
    ENpage.emailPage().type(email)
    cy.get('.en__submit > button').click()

    validateThankYouPage()

  })

  function validateThankYouPage() {

    cy.location('pathname').should('include', '/page/15833/action/2')
    cy.get('.content').as('thankcopy')
    cy.get('@thankcopy').contains('ST_Ecard')
    cy.get('@thankcopy').contains('Dallas')
    cy.get('@thankcopy').contains(email)

  }
})
describe('test e-activist LogIn ', () => {

  const email = ('st_ecard_dallas_' + todaysDate + '@engagingnetworks.online')

  it('searches for the supporters single donation transaction', () => {
    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
    EN.enterSupporter()
      .type(email)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('ecf')
    })
    EN.logOut()
  })
})