/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYY-hh_mm')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYY-hh_mm')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})

describe('test redirect links when conditions are met', ()=>{
  
    const iatsRedirect = ('en_iats_redirect_' + todaysDate + '@engagingnetworks.online')
    

    beforeEach(() => {
        cy.visit(Cypress.env('dallas')+'page/20483/donate/1')
      })

    it('it redirects to https://example.cypress.io/commands/location when supporter is new', () =>{


        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10')
        ENpage. otherAmount2().type('12')
        ENpage.submitPage()
        cy.url().should('eq', 'https://example.cypress.io/commands/location')


    })

    it('redirects to https://test.engagingnetworks.app/page/14073/donate/1?mode=DEMO when lastName contains test', () =>{

        ENpage.lastName().clear().type('I can do testing')
        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10')
        cy.get('#en__field_transaction_othamt2').type('12')
        ENpage.submitPage()
        cy.url().should('eq', 'https://test.engagingnetworks.app/page/14073/donate/1?mode=DEMO')
    })

    it('redirects to https://speca.io/engagingnetworks/engaging-network-services?key=726cda99f0551ef286486bb847f5fb5d when firstName = IATS1', () =>{

        ENpage.firstName().clear().type('IATS1')
        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10')
        cy.get('#en__field_transaction_othamt2').type('12')
        ENpage.submitPage()
        cy.url().should('eq', 'https://speca.io/engagingnetworks/engaging-network-services?key=726cda99f0551ef286486bb847f5fb5d')
})

    it('redirects to https://docs.cypress.io/guides/overview/why-cypress when donationAmount = 50', () =>{

        cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
        cy.get('.en__field__input').eq(1).type('50.00')
        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10')
        cy.get('#en__field_transaction_othamt2').type('12')
        ENpage.submitPage()
        cy.url().should('eq', 'https://docs.cypress.io/guides/overview/why-cypress')
  
    })

    it('redirects to https://devhints.io/xpath when other1 = 10', () =>{
        
        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10')
        cy.get('#en__field_transaction_othamt2').type('12')
        ENpage.submitPage()
        cy.url().should('eq', 'https://devhints.io/xpath')

  
    })

    it('redirects to https://test.engagingnetworks.app/page/13224/event/1?mode=DEMO when other2 = 12', () =>{

        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10.00')
        cy.get('#en__field_transaction_othamt2').type('12')
        ENpage.submitPage()
        cy.url().should('eq', 'https://test.engagingnetworks.app/page/13224/event/1?mode=DEMO')
  
    })

    it('redirects to https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestorswhen recurring donation is submitted', () =>{

        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay0').check()
        cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
        cy.get('#en__field_transaction_recurrfreq').type('DAILY')
        ENpage. otherAmount1().type('10')
        cy.get('#en__field_transaction_othamt2').type('12')
        ENpage.submitPage()
        cy.url().should('eq', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors')
  
    })

    it('redirects to https://esqa.moneris.com/mpg/index.php when donationAmount > 125', () =>{

        cy.get('#en__field_transaction_donationAmt').select('Other').should('have.value', 'Other')
        cy.get('.en__field__input').eq(1).type('150.00')
        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10.00')
        cy.get('#en__field_transaction_othamt2').type('12.00')
        ENpage.submitPage()
        cy.url().should('eq', 'https://esqa.moneris.com/mpg/index.php')

  
    })

    it('redirects to fallback url https://www.iatspayments.com/login/login.asp', () =>{

        ENpage.emailPage().clear().type(iatsRedirect)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('10.00')
        cy.get('#en__field_transaction_othamt2').type('12.00')
        ENpage.submitPage()
        cy.url().should('eq', 'https://www.iatspayments.com/login/login.asp')
  
    })

})

