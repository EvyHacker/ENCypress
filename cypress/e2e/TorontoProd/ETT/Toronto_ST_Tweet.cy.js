// <reference types="Cypress" />
describe('test Single and/or Recurring donation ', ()=>{
    const todaysDate = Cypress.moment().format('MM_DD_YYYY')
    const email = ('st_tweettotarget_toronto_' + todaysDate + '@engagingnetworks.online')

    beforeEach(() => {
        cy.visit(Cypress.env('toronto')+'page/50005/tweet/1')
      })

    it('sends successfully twit to target', () => {

        ENpage.firstName().should('have.value', 'ST - Tweet to Target')
        ENpage.emailPage().should('have.value', 'st_tweettotarget@engagingnetworks.online')
        ENpage.emailPage().clear().type(email)
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/50005/tweet/2')
        cy.get('div[data-contact="10982"] > .en__twitterTarget').invoke('text').should('include', 'Mr. Dan AtAdvocacyOnline')
        cy.get('div[data-contact="10982"] > .en__twitterTarget').invoke('text').should('include', 'ett_2customdb_toronto')
        cy.get('.en__tweetButton__send > a').should('have.text', 'Tweet').click()
        cy.wait(2000)
        cy.get('.en__tweetButton__sent > a').should('have.text', 'Tweet Sent!')
    })
})
describe('test us.e-activist LogIn ', ()=>{

    const todaysDate = Cypress.moment().format('MM_DD_YYYY')
    const email = ('st_tweettotarget_toronto_' + todaysDate + '@engagingnetworks.online')
    
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