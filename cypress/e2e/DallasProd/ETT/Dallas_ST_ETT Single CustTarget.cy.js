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
describe('test Single and/or Recurring donation ', ()=>{

  const email = ('ett_custom_db_dallas_' + todaysDate + '@engagingnetworks.online')

    it('loads with correct page 1 content', () => {

        cy.visit(Cypress.env('dallas')+'page/15184/action/1')
        cy.get(':nth-child(1) > [style="font-size:12px;"] > span')
        .should('have.text', 'Page Name: ST_ETT Single Custom Target (Plain Text) Dallas')
        cy.get(':nth-child(2) > [style="font-size:12px;"] > span')
        .should('have.text', 'Language: English only')
        
        ENpage.firstName().type('Evy')
        ENpage.lastName().type('Test')
        ENpage.emailPage().type(email)
        ENpage.address1Page().type('Test Street')
        ENpage.cityPage().type('Test City')
        ENpage.regionPage().select('VA')
        ENpage.countryPage().select('US')
        ENpage.postCodePage().type('20123')
        cy.get('.en__contactDetails__row--1').invoke('text').then((text) => {
          expect(text.trim()).contains('Mr')
          expect(text.trim()).contains('ETT Custom DB')
          expect(text.trim()).contains('Dallas')
        })
        cy.get('.en__contactMessage > .en__field').invoke('text').then((text) => {
          expect(text.trim()).contains('Ms')
          expect(text.trim()).contains('My message to ETT Custom DB Dallas')
          expect(text.trim()).contains('Kind regards,')
        })
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/15184/action/2')

        cy.get(':nth-child(5) > span').as('thankcopy')
        cy.get('@thankcopy').contains('Evy')
        cy.get('@thankcopy').contains('Test')
        cy.get('@thankcopy').contains(email)
        cy.get('@thankcopy').contains('US')

      })
})
describe('test us.e-activist LogIn ', ()=>{
  
  const email = ('ett_custom_db_dallas_' + todaysDate + '@engagingnetworks.online')
  
    it('searches for the supporters ett transactions', () => {
   
        logIn()
        EN.enterSupporter()
        .type(email)
        EN.searchSupporter()
        EN.lookupSupporter()
        EN.transactionType().invoke('text').then((text) => {
          expect(text.trim()).contains('ett')
      })
      logOut()
    })

    function logIn(){
       
      cy.visit(Cypress.env('dallasLogIn')+'#login')
      
       cy.get('#enLoginUsername').type(Cypress.env('userLogin'))
       cy.get('#enLoginPassword').type(Cypress.env('userPassword'))
       cy.get('.button').click()
      
    }
    function logOut(){

      EN.searchNewSup()
      cy.get('.enLayout__navItem--hasSubNav > [href="#"]').click()
      cy.get('.enLayout__nav--secondary > .enLayout__navItem--hasSubNav > .enLayout__nav > ul > :nth-child(4) > a').click()
      cy.url().should('contain','#login')
    }
})