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

    const email = ('st_customdb_' + todaysDate + '@engagingnetworks.online')
    
    beforeEach(() => {
        cy.visit(Cypress.env('dallas')+'page/15186/action/1')   
      })

    it('sends an email to target#1', () =>{

        ENpage.firstName().type('Evy')
        ENpage.lastName().type('Test')
        ENpage.emailPage().type(email)
        ENpage.address1Page().type('1146 19th Street NW, Suite 800')
        ENpage.cityPage().type('Washington')
        ENpage.regionPage().select('DC')
        ENpage.submitPage()

        validateEditMessage1()
        ENpage.submitPage()
        
        
        validateThankYouPage()
        cy.get(':nth-child(5) > span').contains('Evy')
  
    })

    it('sends an email to target#2', () =>{

        ENpage.firstName().type('custom')
        ENpage.lastName().type('Test')
        ENpage.emailPage().type(email)
        ENpage.address1Page().type('1146 19th Street NW, Suite 800')
        ENpage.cityPage().type('Washington')
        ENpage.regionPage().select('DC')
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/15186/action/2')

        validateEditMessage2()

        ENpage.submitPage()
        cy.location('pathname').should('include', '/page/15186/action/3')
        validateThankYouPage()
        cy.get(':nth-child(5) > span').contains('custom')
    })

function validateEditMessage1(){

        cy.location('pathname').should('include', '/page/15186/action/2')
        cy.get('.en__contactDetails__row--1').invoke('text').should('include', 'Ms').and('include', 'Smoke Test_Custom DB')
        .and('include', 'Database')
        cy.get('.en__field__input').should('have.value', 'ST_ETT Custom Database (Editable Regions) Dallas #1')
        cy.get(':nth-child(3) > .en__contactSection__content > .en__contactMessage > .en__field')
                .type('\nThis is to test message#1')
}

function validateEditMessage2(){

    cy.location('pathname').should('include', '/page/15186/action/2')
    cy.get('.en__contactDetails__row--1').invoke('text').should('include', 'Ms').and('include', 'Smoke Test_Custom DB')
    .and('include', 'Database')
    cy.get('.en__field__input').should('have.value', 'ST_ETT Custom Database (Editable Regions) Dallas #2')
    cy.get(':nth-child(3) > .en__contactSection__content > .en__contactMessage > .en__field')
            .type('\nThis is to test message#2')
}

function validateThankYouPage(){

    cy.location('pathname').should('include', '/page/15186/action/3')
    cy.get(':nth-child(5) > span').as('thankcopy')
    cy.get('@thankcopy').contains('Test')
    cy.get('@thankcopy').contains(email)
    cy.get('@thankcopy').contains('GB')
}

})
describe('test us.e-activist LogIn ', ()=>{


    const email = ('st_customdb_' + todaysDate + '@engagingnetworks.online')
    it('searches for the supporters donation transaction', () => {

        logIn()

        EN.enterSupporter()
        .type(email)
        EN.searchSupporter()
        EN.lookupSupporter()
        EN.transactionType().invoke('text').then((text) => {
            expect(text.trim()).equal('ett')
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