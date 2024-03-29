/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()

describe('test Single and/or Recurring donation ', ()=>{
  const todaysDate = Cypress.moment().format('MM_DD_YYYY')
  const email = ('ett_custom_db_toronto_' + todaysDate + '@engagingnetworks.online')
  
  beforeEach(() => {
    cy.visit(Cypress.env('toronto')+'page/49981/action/1')
  })

    it('sends succsessfully email', () => {

        ENpage.firstName().should('have.value', 'ST ETT')
        ENpage.lastName().should('have.value', 'Custom Target - Toronto')
        ENpage.emailPage().should('have.value', 'st_ettsupportertoronto@engagingnetworks.online')
        ENpage.emailPage().clear().type(email)
        ENpage.address1Page().should('have.value', 'address1')
        ENpage.cityPage().should('have.value', 'Tribeca')
        ENpage.regionPage().should('have.value', 'NY')
        ENpage.countryPage().should('have.value', 'USA')
        ENpage.postCodePage().should('have.value', '111222')
        cy.get('.en__contactDetails__row--1').invoke('text').then((text) => {
          expect(text.trim()).contains('Mr')
          expect(text.trim()).contains('ETT Custom Target')
          expect(text.trim()).contains('Toronto')
        })
    
        ENpage.submitPage()

        cy.location('pathname').should('have', '/page/49981/action/2')

        cy.get(':nth-child(5) > span').as('thankcopy')
        cy.get('@thankcopy').contains('ST ETT')
        cy.get('@thankcopy').contains('Custom Target - Toronto')
        cy.get('@thankcopy').contains(email)
        cy.get('@thankcopy').contains('USA')
      })
})
describe('test e-activist LogIn ', ()=>{

    const todaysDate = Cypress.moment().format('MM_DD_YYYY')
    const email = ('ett_custom_db_toronto_' + todaysDate + '@engagingnetworks.online')
      
     it('searches for the supporters single donation transaction', () => {
     
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
        cy.visit(Cypress.env('torontoLogIn')+'#login')

          if(cy.location('pathname').should('have', '#login')){
             cy.get('#enLoginUsername').type(Cypress.env('userLogin'))
             cy.get('#enLoginPassword').type(Cypress.env('userPassword'))
             cy.get('.button').click()
             if(cy.location('pathname').should('have', '#login/tos')){
                cy.get('.enSandbox__tos__agree').click()
            }else{cy.visit(Cypress.env('torontoLogIn') + '#dashboard', {delay : 3000})}
      }else{cy.visit(Cypress.env('torontoLogIn') + '#dashboard', {delay : 3000})
        }
      }
      function logOut(){
  
          EN.searchNewSup()
          cy.get('.enLayout__navItem--hasSubNav > [href="#"]').click()
          cy.get('.enLayout__nav--secondary > .enLayout__navItem--hasSubNav > .enLayout__nav > ul > :nth-child(4) > a').click()
          cy.url().should('contain','#login')
      }
    })