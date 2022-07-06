/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/integration/pageObject/ENobjects'
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY')
const email = ('ett_customdb_dallas_2targets_' + todaysDate + '@engagingnetworks.online')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})
describe('test Single and/or Recurring donation ', () => {


  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/15185/action/1')
  })

  it('loads with correct page 1 content', () => {

    cy.get(':nth-child(1) > [style="font-size:12px;"] > span')
      .should('have.text', 'Page Name: ST_ETT 2 Custom Targets (Plain Text) Dallas')
    cy.get(':nth-child(2) > [style="font-size:12px;"] > span')
      .should('have.text', 'Language: English only')

    //Validate 1st email to target
    cy.get('.en__contact--3738 > .en__contact__detail').invoke('text').
      should('include', 'Mr').and('include', 'ETT Custom DB').and('include', 'Dallas').and('include', 'Smoke Testing')
    cy.get('.en__contact--3738 > .en__contact__detail > .en__contactMessage > .en__field').invoke('text').then((text) => {
      expect(text.trim()).contains('Ms')
      expect(text.trim()).contains('My message to ETT Custom DB Dallas')
      expect(text.trim()).contains('ST_ETT 2 Custom Targets (HTML) Dallas')
      expect(text.trim()).contains('Kind regards,')
    })

    //Validate 2nd email to target
    cy.get('.en__contact--3739 > .en__contact__detail').invoke('text').
      should('include', 'Ms').and('include', 'Dallas Custom').and('include', 'Target 2').and('include', 'Custom Org')
    cy.get('.en__contact--3739 > .en__contact__toggle').click()
    cy.get('.en__contact--3739 > .en__contact__detail > .en__contactMessage > .en__field').invoke('text').then((text) => {
      expect(text.trim()).contains('Dear')
      expect(text.trim()).contains('My message to Dallas Custom Target 2')
      expect(text.trim()).contains('ST_ETT 2 Custom Targets (HTML) Dallas')
      expect(text.trim()).contains('Kind regards,')
    })
  })

  it('sends an email to target', () => {

    ENpage.firstName().type('Evy')
    ENpage.lastName().type('Test')
    ENpage.emailPage().type(email)
    ENpage.address1Page().type('1146 19th Street NW, Suite 800')
    ENpage.cityPage().type('Washington')
    ENpage.regionPage().select('DC')
    ENpage.countryPage().select('US')
    ENpage.postCodePage().type('20036')
    ENpage.submitPage()

    cy.location('pathname').should('include', '/page/15185/action/2')

    cy.get(':nth-child(5) > span').as('thankcopy')
    cy.get('@thankcopy').contains('Evy')
    cy.get('@thankcopy').contains('Test')
    cy.get('@thankcopy').contains(email)
    cy.get('@thankcopy').contains('US')

  })
})
describe('test us.e-activist LogIn ', () => {

  it('searches for the supporters ett transactions', () => {

    cy.visit(Cypress.env('dallasLogIn') + '#login')

    EN.login()
    EN.enterSupporter().type(email)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('ett')
    })
    EN.logOut()
  })
})