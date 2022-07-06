class ENpage{

    //* DONATION PAGE *//

    firstName(){
        return cy.get('#en__field_supporter_firstName')
    }
    lastName(){
        return cy.get('#en__field_supporter_lastName')
    }
    emailPage()
    {
        return cy.get('#en__field_supporter_emailAddress')
    }
    address1Page(){
    return  cy.get('#en__field_supporter_address1')
    }
    cityPage(){
        return cy.get('#en__field_supporter_city')
    }
    regionPage(){
        return cy.get('#en__field_supporter_region')
    }
    countryPage(){
        return cy.get('#en__field_supporter_country')
    }
    postCodePage(){
        return cy.get('#en__field_supporter_postcode')
    }
    submitPage(){
        return  cy.get('button').click()
    }
    otherAmount1(){
        return cy.get('#en__field_transaction_othamt1')
    }
    otherAmount2(){
        return cy.get('#en__field_transaction_othamt2')
    }

    //* EVENT PAGE *//

    addTicket(){
        return cy.get('.en__ticket__plus')
    }
    addAdditionalAmount(){
        return cy.get('.en__additional__input')
    }
    eventCheckOut(){
        return cy.get('.en__ticketSummary__checkout')
    }
    eventTotalSummary(){
        return cy.get('.en__orderSummary__data--totalAmount')
    }
    eventDiscount(){
        return cy.get('.en__additional__code')
    }
    eventRfd(){
        return cy.get(':nth-child(2) > .gadget__events__wrap > .gadget__events__header > .gadget__events__name', 
        { timeout: 10000 }).should('be.visible').click()
    }
    eventESCrfd(){
        return cy.get(':nth-child(3) > .gadget__events__wrap > .gadget__events__header > .gadget__events__name',
        { timeout: 10000 }).should('be.visible').click()
    }
    eventESCpartial(){
        return cy.get(':nth-child(4) > .gadget__events__wrap > .gadget__events__header > .gadget__events__name',
        { timeout: 10000 }).should('be.visible').click()
    }

     //* TRANSACTION DETAILS *//

     ccExpiryDate(){
         return cy.get('#en__field_transaction_ccexpire')
     }
     ccExpiryYear(){
         return cy.get(':nth-child(3) > .en__field__input')
     }
     creditCard(){
         return cy.get('#en__field_transaction_ccnumber')
     }

}
export default ENpage