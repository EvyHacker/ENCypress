class en{

     login = () => {
        const email = cy.get('#enLoginUsername')
        email.type(Cypress.env('userLogin'))
        const password = cy.get('#enLoginPassword')
        password.type(Cypress.env('userPassword'))
        return cy.get('.button').click()
         
    }

    loginTest = () => {
        const email = cy.get('#enLoginUsername')
        email.type(Cypress.env('testLogin'))
        const password = cy.get('#enLoginPassword')
        password.type(Cypress.env('userPassword'))
        return cy.get('.button').click()
         
    }

    loginTestNewPass = () => {
        const email = cy.get('#enLoginUsername')
        email.type(Cypress.env('userTestLogin'))
        const password = cy.get('#enLoginPassword')
        password.type('247Yc3x6.;_ЫАЦПАУА')
        return cy.get('.button').click()
         
    }

    emailLogin(){
        return cy.get('#enLoginUsername').type(Cypress.env('userLogin'))
    }
    passwordLogin(){
        return cy.get('#enLoginPassword').type(Cypress.env('userPassword'))
    }
    loginButton(){
        return cy.get('.button').click()
    }
    logOut = () => {
        const close = cy.get('.dashboard__action--close')
        close.click()
        const navig = cy.get('.enLayout__navItem--hasSubNav > [href="#"]')
        navig.click()
        const navClose = cy.get('.enLayout__nav--secondary > .enLayout__navItem--hasSubNav > .enLayout__nav > ul > :nth-child(4) > a')
        navClose.click()
        cy.reload()
        return cy.url().should('contain','#login')
    }

    logOutTestPass = () => {
        const navig = cy.get('.enLayout__navItem--hasSubNav > [href="#"]')
        navig.click()
        const navClose = cy.get('.enLayout__nav--secondary > .enLayout__navItem--hasSubNav > .enLayout__nav > ul > :nth-child(4) > a')
        navClose.click()
        cy.reload()
        return cy.url().should('contains','#login')
    }
    enterSupporter(){
        return cy.get('.enDashboard__gadget__content > form > .userInput > .userInput__field > input')
    }
    searchSupporter(){
        return cy.get('.userInput__action > .button').click()
    }
    lookupSupporter(){
        return cy.get('.actions--data > .btn-view')
    }
    navigateSupporter(){
        return cy.get('.icon--search--color')
    }
    transactionType(){
        return cy.get('.gadget__transactionHistory__transaction__field__type', { timeout: 50000 })
    }
    donationSingle(){
       return cy.get('.gadget__singleDonations__donation__header')
    }
    donationRecur(){
        return cy.get('.gadget__recurringDonations__recurring__type')
    }
    receiptOrig(){
        return cy.get('.receiptOriginal')
    }
    receiptRep(){
        return cy.get('.receiptReplacement')
    }
    tax(){
        return cy.get('.tax')
    }
    refund(){
        return cy.get('.refund')
    }
    refundAmount(){
        return cy.get('#refund__amount')
    }
    searchNewSup(){
        return cy.get('.dashboard__action--close').contains('close')
    }
    goSupp(){
        return cy.get('.table__row__field--go > .button').click()
    }

    navigateToResetPassword(){
        const navigate= cy.get('.enLayout__navItem--hasSubNav > [href="#"]')
        navigate.click()
        const userProfile = cy.get('.enLayout__nav--secondary > .enLayout__navItem--hasSubNav > .enLayout__nav > ul > :nth-child(2) > a')
        return userProfile.click()
    }
    updatePassword(){
        return cy.get('.enPreferences--password > .enPreferences__actions > .button').click()
    }

    enterCurretPassword(){
        return cy.get('.userInput--passwordCurrent > .userInput__field > input').type(Cypress.env('userPassword'))
    }

    enterCurretPasswordNew(){
        return cy.get('.userInput--passwordCurrent > .userInput__field > input').type('247Yc3x6.;_ЫАЦПАУА')
    }

    updateNewPassword(){
        return cy.get('.enPreferences--password > .enPreferences__actions > .button').click()
    }
    enterNewSup(){
        return cy.get('#searchForm-q').clear()
    }
    eventTransaction(){
        return cy.get('.gadget__events__header')
    }
    eventResend(){
        return cy.get('.gadget__events__resend')
    }
    eventRefund(){
        return cy.get('.gadget__events__refund')
    }
    eventRefundAmount(){
        return cy.get('.refund__amount')
    }


    
}
export default en 