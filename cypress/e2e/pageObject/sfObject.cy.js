class sf{
     userName(){
        return  cy.get('#username')
    }
     userPassword(){
        return cy.get('#password')
    }
     login(){
        return cy.get('#Login').click()
    }
}
export default sf