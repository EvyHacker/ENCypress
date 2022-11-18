/// <reference types="Cypress" />
import ENobjects from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/evyens/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'

const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY_mm')
const todaysDateVisa = dayjs().format('MM_DD_YYYY_mm')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY_mm')
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false

})

describe('test partial refund for IATS gateway for Single and Recurring transactions', () => {

    const donationSingle = ('en_stripe_fmv_partial_single_donation_' + todaysDate + '@engagingnetworks.online')
    const donationRecur = ('en_istripe_fmv_partial_recur_donation_' + tomorrowsDate + '@engagingnetworks.online')
    const donationSingleVisa = ('en_stripe_fmv_visa_partial_single_donation_' + todaysDateVisa + '@engagingnetworks.online')
    const donationTypeSingle = ('.gadget__singleDonations__donation__header')
    const donationTypeRecur = ('.gadget__recurringDonations__recurring__type')
    var newEmail


    it('can submit single donation with fee cover', () => {
        cy.visit(Cypress.env('dallas') + 'page/22874/donate/1?mode=DEMO')
        cy.get('#dd-input').type('Coke')
        cy.get('#dtd-selected-company-0').contains('Coke - The Coca-Cola Company').click()
        ENpage.emailPage().clear().type(donationSingle)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('other 1')
        cy.get('#en__field_transaction_othamt2').type('other 2')
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/22874/donate/2')

        cy.get('#en__field_transaction_donationAmt3').click()
        cy.get('.en__field__item--other > .en__field__input')
            .type('100.99')
        cy.get('#en__field_transaction_feeCover').check()

        context('Actions', () => {
            cy.getWithinIframe('[name="iban"]').type('NL39RABO0300065264')
        })
        ENpage.submitPage()
        cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'BANK_SINGLE')
        thankyouPageSepa()
    })


    it('can submit recurring donation', () => {

        cy.visit(Cypress.env('dallas') + 'page/22874/donate/1?mode=DEMO')
        cy.get('#dd-input').type('Coke')
        cy.get('#dtd-selected-company-0').contains('Coke - The Coca-Cola Company').click()
        ENpage.emailPage().clear().type(donationRecur)
        cy.get('#en__field_transaction_recurrpay0').check()
        cy.get('#en__field_transaction_recurrstart').type(tomorrowsDate)
        cy.get('#en__field_transaction_recurrfreq').type('DAILY')
        ENpage. otherAmount1().type('other 1')
        cy.get('#en__field_transaction_othamt2').type('other 2')
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/22874/donate/2')

        cy.get('#en__field_transaction_donationAmt3').click()
        cy.get('.en__field__item--other > .en__field__input')
            .type('100.99')
        cy.get('#en__field_transaction_feeCover').check()
        context('Actions', () => {
            cy.getWithinIframe('[name="iban"]').type('GB82WEST12345698765432')

        })
        ENpage.submitPage()
        cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'BANK_RECURRING')
        thankyouPageSepa()
    })


    it('can submit single visa donation with fee cover', () => {

        cy.visit(Cypress.env('dallas') + 'page/22874/donate/1?mode=DEMO')
        cy.get('#dd-input').type('Coke')
        cy.get('#dtd-selected-company-0').contains('Coke - The Coca-Cola Company').click()
        ENpage.emailPage().clear().type(donationSingleVisa)
        cy.get('#en__field_transaction_recurrpay1').check()
        ENpage. otherAmount1().type('other 1')
        cy.get('#en__field_transaction_othamt2').type('other 2')
        ENpage.submitPage()

        cy.location('pathname').should('include', '/page/22874/donate/2')

        cy.get('#en__field_transaction_donationAmt3').click()
        cy.get('.en__field__item--other > .en__field__input')
            .type('100.99')

        cy.get('#en__field_transaction_paymenttype').select('Visa')
        cy.get('#en__field_transaction_ccnumber').type('4000000000003220')
        cy.get('#en__field_transaction_ccvv').type('123')
        ENpage.ccExpiryDate().type('10')
        cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2024')
        cy.get('#en__field_transaction_feeCover').check()
        ENpage.submitPage()
        cy.wait(5000)
        cy.waitForStripe3dIframe().find("[id*=test-source-fail]").click()
        cy.location('pathname').should('include', 'page/22874/donate/2')
        cy.get('.en__error').should('have.text', 'We are unable to authenticate your payment method. Please choose a different payment method and try again.')

        ENpage.submitPage()
        cy.wait(5000)
        cy.failForStripe3dIframe().find("[id*=test-source-authorize]").click()
        cy.get('.en__component--column > .en__component > :nth-child(6)').should('contain.text', 'CREDIT_SINGLE')
        cy.get('.en__component--copyblock > :nth-child(17)').should('contain.text', '€111.09')
        cy.get('.en__component--copyblock > :nth-child(1)').then(($usage) => {
            newEmail = $usage.text()
        })

    })

    function thankyouPageSepa() {
        cy.location('pathname').should('include', 'page/22874/donate/3')
        cy.get('.corporate-information').should('include.text', 'Coca-Cola')
        cy.get('.en__component--column > .en__component').as('thankYouPage')
        cy.get('@thankYouPage').contains('59136')
        cy.get('@thankYouPage').contains('EUR')
        cy.get('@thankYouPage').contains('Stripe Gateway')
        cy.get('@thankYouPage').contains('€111.09')
        cy.get('@thankYouPage').contains('TEST: sepa_debit')
    }
    it('searches for a single transaction and completes partial refund', () => {

        cy.visit(Cypress.env('dallasLogIn') + '#login')
        EN.login()
        EN.enterSupporter()
            .type(donationSingle)
        EN.searchSupporter()
        EN.lookupSupporter().click()
        EN.transactionType().invoke('text')
            .then((text) => {
                expect(text.trim()).contains('fbs')
            })

        cy.get(donationTypeSingle).eq(0).click()
        cy.get('.gadget__singleDonations__transaction').invoke('text').should('include', 'change')
        cy.get(donationTypeSingle).eq(1).click()
        //cy.get('.gadget__singleDonations__transaction').invoke('text').should('include', 'success')
        EN.receiptOrig().should('be.visible')
        EN.receiptRep().should('be.visible')
        EN.tax().should('be.visible')
        EN.refund().click()
        cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 111.09 EUR')
        EN.refundAmount().type('85.99')
        cy.get('label > input').check()
        cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
        cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)')
            .should('have.value', '1')
        cy.get('.gadget__receipt__buttons__send').click()
        cy.get('.message__actions__confirm').click()
        cy.wait(5000)
        cy.reload()   
        cy.get(donationTypeSingle).eq(0).click()
        cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
        cy.get('@refund').should('include', '-85.99 EUR')
        cy.get(donationTypeSingle).eq(2).click()
        EN.refund().click()
        cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 25.1 EUR')
        EN.searchNewSup()
    })

    it('searches for a recurring transaction and completes partial refund', () => {

        cy.visit(Cypress.env('dallasLogIn') + '#login')
        EN.login()
        EN.enterSupporter()
            .type(donationRecur)
        EN.searchSupporter()
        EN.lookupSupporter().click()
        EN.transactionType().invoke('text')
            .then((text) => {
                expect(text.trim()).contains('fbr')
            })
        cy.get(donationTypeRecur).eq(0).click()
        cy.get('.gadget__recurringDetail__history__item').eq(1).click()
        cy.get('.gadget__recurringDetail__history__buttons__refund > .button').click()
        cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 111.09 EUR')
        EN.refundAmount().type('20.99')
        cy.get('label > input').check()
        cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
        cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)')
            .should('have.value', '1')
        cy.get('.gadget__receipt__buttons__send').click()
        cy.get('.message__actions__confirm').click()
        cy.wait(5000)
        cy.reload() 
        EN.transactionType().eq(0).invoke('text')
            .then((text) => {
                expect(text.trim()).contains('rfd')
            })
        EN.transactionType().eq(0).click()
        cy.get('.gadget__transactionHistory__transactionDetail').invoke('text').should('include', '-20.99 EUR')


    })

    it('searches for a single transaction and completes full refund', () => {

        cy.visit(Cypress.env('dallasLogIn') + '#login')
        EN.login()
        EN.enterSupporter()
            .type(newEmail)
        EN.searchSupporter()
        EN.lookupSupporter().click()
        EN.transactionType().invoke('text')
            .then((text) => {
                expect(text.trim()).contains('fcs')
            })

        cy.get(donationTypeSingle).eq(0).click().then((el) => {

            cy.get('.gadget__singleDonations__transaction').eq(0).invoke('text')
                .then((text) => {
                    if (text.includes('change')) {
                        cy.get(donationTypeSingle).eq(1).trigger('click')
                    } else {
                        cy.get(donationTypeSingle).eq(0).trigger('click')
                    }
                })
        })

        EN.receiptOrig().should('be.visible')
        EN.receiptRep().should('be.visible')
        EN.tax().should('be.visible')
        EN.refund().click()
        cy.get('.gadget__receipt > p').invoke('text').should('include', 'Amount Charged: 111.09 EUR')
        EN.refundAmount().type('111.09')
        cy.get('label > input').check()
        cy.get('.gadget__receipt__field__input__receipt').select('refund receipt 3 58').should('have.value', '177')
        cy.get('.gadget__receipt__field__input__template').select('Default for Donation Refund (single and recurring)')
            .should('have.value', '1')
        cy.get('.gadget__receipt__buttons__send').click()
        cy.get('.message__actions__confirm').click()
        cy.wait(5000)
        cy.reload() 
        cy.get(donationTypeSingle).eq(0).click()
        cy.get('.gadget__singleDonations__transaction').invoke('text').as('refund')
        cy.get('@refund').should('include', '-111.09 EUR')
        EN.logOut()
    })

})