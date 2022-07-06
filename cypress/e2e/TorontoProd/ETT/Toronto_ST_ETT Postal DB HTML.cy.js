describe('test Single and/or Recurring donation ', ()=>{
  const todaysDate = Cypress.moment().format('MM_DD_YYYY')
  const email = ('ett_postal_db_toronto_' + todaysDate + '@engagingnetworks.online')
  
  beforeEach(() => {
    cy.visit(Cypress.env('toronto')+'page/49985/action/1')
  })

    it('sends succsessfully email', () => {

        ENpage.firstName().should('have.value', 'ST ETT')
        ENpage.lastName().should('have.value', 'Postal Database - Toronto')
        ENpage.emailPage().should('have.value', 'st_ettsupportertoronto@engagingnetworks.online')
        ENpage.emailPage().clear().type(email)
        ENpage.address1Page().should('have.value', 'address1')
        ENpage.cityPage().should('have.value', 'Tribeca')
        ENpage.regionPage().should('have.value', 'NY')
        ENpage.countryPage().select('USA')
        ENpage.postCodePage().should('have.value', 'D123AA')
    
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/49985/action/2')

        validateETTMessage()

        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/49985/action/3')
        validateThankYouPage()
      })

    function validateETTMessage(){

       cy.get('.en__contactDetails__row--1').invoke('text').should('include', 'Mr').and('include', 'Dan')
      .and('include', 'Szymczak')
      cy.get('.en__field__input').then(($text) => {
      if($text.attr('value')==='ST_ETT Postal Database Toronto #1'){
        cy.get('.en__field__input').type(' This is test message #1')
       // expect(cy.get('.en__contactMessage__htmlDisplay').should('have.value', 'Message (#1): ST_ETT Postal Database')
      }else{
        cy.get('.en__field__input').should('have.value', 'ST_ETT Postal Database Toronto #2')
        cy.get('.en__field__input').type(' This is test message #2')
      }    
    })
  }
    function validateThankYouPage(){

      cy.get(':nth-child(5) > span').as('thankcopy')
      cy.get('@thankcopy').contains('ST ETT')
      cy.get('@thankcopy').contains('Postal Database - Toronto')
      cy.get('@thankcopy').contains(email)
      cy.get('@thankcopy').contains('USA')
  }
})  
describe('test e-activist LogIn ', ()=>{

    const todaysDate = Cypress.moment().format('MM_DD_YYYY')
    const email = ('ett_postal_db_toronto_' + todaysDate + '@engagingnetworks.online')
      
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