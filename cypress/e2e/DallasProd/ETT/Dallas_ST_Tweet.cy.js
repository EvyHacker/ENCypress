/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY')
const email = ('st_tweettotarget_dallas_' + todaysDate + '@engagingnetworks.online')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})
describe('test Single and/or Recurring donation ', ()=>{

   
    beforeEach(() => {
      cy.visit(Cypress.env('dallas')+'page/15236/tweet/1')
      })

    it('sends successfully twit to target', () => {

        ENpage.firstName().type('Evy')
        ENpage.lastName().type('Test')
        ENpage.emailPage().type(email)
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/15236/tweet/2')
        cy.get('.en__twitterTarget__name').should('have.text', 'Ms Dallas Custom Target 2')
        cy.get('.en__twitterTarget__handle > a').should('have.text', 'ett_2customdbdallas')
        cy.get('.en__tweetButton__send > a').should('have.text', 'Tweet').click()
        cy.wait(2000)
        cy.get('.en__tweetButton__sent > a').should('have.text', 'Tweet Sent!')
    })
})
describe('test us.e-activist LogIn ', ()=>{
    
      it('searches for the supporters ett transactions', () => {
     
          logIn()
          EN.enterSupporter()
          .type(email)
          EN.searchSupporter()
          EN.lookupSupporter()
          EN.transactionType().invoke('text').then((text) => {
            expect(text.trim()).contains('twt')
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