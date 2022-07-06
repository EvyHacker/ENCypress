/// <reference types="Cypress" />
import ENobjects from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENobjects.cy.js'
import ENpageObject from '/Users/ievgeniiagaidarenko/ENS/ENCypress/cypress/e2e/pageObject/ENpageObject.cy.js'
const EN = new ENobjects()
const ENpage = new ENpageObject()
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
const todaysDate = dayjs().format('MM-DD-YYYY')
const tomorrowsDate = dayjs().add(1, 'day').format('MM-DD-YYYY')
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false

})


describe('test Single and/or Recurring donation ', () => {

  const emailSingle = ('st_premiumgifts_single_' + todaysDate + '@engagingnetworks.online')
  const emailRecur = ('st_premiumgifts_recur_' + tomorrowsDate + '@engagingnetworks.online')
  const emailNoGift = ('st_premiumgift_nogift_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallas') + 'page/13534/shop/1?mode=DEMO')
  })

  it('loads with correct page 1 content', () => {

    ENpage.firstName().should('have.value', 'ST')
    ENpage.lastName().should('have.value', 'Premium')
    ENpage.emailPage().should('have.value', 'st_premiumgifts@engagingnetworks.online')
    ENpage.address1Page().should('have.value', 'add1')
    ENpage.cityPage().should('have.value', 'city')
    ENpage.regionPage().should('have.value', 'IN')
    ENpage.postCodePage().should('have.value', '36985')
    ENpage.countryPage().should('have.value', 'US')
    cy.get('#en__field_transaction_paymenttype').should('have.value', 'Visa')
    cy.get('#en__field_supporter_creditCardHolderName').should('have.value', 'ST_Premium CC Name')
    cy.get('#en__field_transaction_ccnumber').should('have.value', '4222222222222220')
    cy.get('#en__field_transaction_ccvv').should('have.value', '123')

  })

  it('can submit reccuring donation', () => {

    ENpage.emailPage().clear().type(emailRecur)
    cy.get('#en__field_transaction_donationAmt1').click()
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2023')
    cy.get('#en__field_transaction_recurrfreq').type('MONTHLY')
    cy.get('#en__field_transaction_shipenabled1').click()
    ENpage.submitPage()

    validateThankYouPage()

    cy.get('.en__component--column--1 > .en__component > :nth-child(6)').contains(emailRecur)
    cy.get('.en__component > :nth-child(13)').contains('CREDIT_RECURRING')
    cy.get(':nth-child(20)').contains('$5.00')

  })

  it('can submit single donation', () => {

    ENpage.emailPage().clear().type(emailSingle)
    cy.get('#en__field_transaction_donationAmt2').click()
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2023')
    cy.get('#en__field_transaction_recurrpay').click()

    cy.get('#en__field_transaction_recurrfreq').type('MONTHLY')
    cy.get('.en__pg__name').should('have.text', 'CareBears1 ')
    cy.get('#en__field_transaction_shipenabled0').click()

    addShippingDetails()

    ENpage.submitPage()

    validateThankYouPage()

    cy.get('.en__component--column--1 > .en__component > :nth-child(6)').contains(emailSingle)
    cy.get('.en__component > :nth-child(13)').contains('CREDIT_SINGLE')
    cy.get(':nth-child(20)').contains('$10.00')

  })

  it('can submit donation without a gift', () => {

    ENpage.emailPage().clear().type(emailNoGift)
    cy.get('#en__field_transaction_donationAmt3').click()
    cy.get('.en__field--radio > .en__field__element > .en__field__item--other > .en__field__input').type('25.00')
    ENpage.ccExpiryDate().type('01')
    cy.get('.en__field--splittext > .en__field__element > :nth-child(3) > .en__field__input').type('2023')
    cy.get('#en__field_transaction_recurrpay').click()

    cy.get('#en__field_transaction_recurrfreq').type('MONTHLY')
    ENpage.submitPage()

    validateThankYouPage()

    cy.get('.en__component--column--1 > .en__component > :nth-child(6)').contains(emailNoGift)
    cy.get('.en__component > :nth-child(13)').contains('CREDIT_SINGLE')
    cy.get(':nth-child(20)').contains('$25.00')
  })

  function validateThankYouPage() {

    cy.location('pathname').should('include', '/page/13534/shop/2')

    cy.get('.en__component--row--2 > .en__component--column--1 > .en__component > :nth-child(1)').contains('ST')
    cy.get('.en__component--row--2 > .en__component--column--1 > .en__component > :nth-child(2)').contains('Premium')
    cy.get('.en__component--row--2 > .en__component--column--1 > .en__component > :nth-child(3)').contains('add1')
    cy.get('.en__component--row--2 > .en__component--column--1 > .en__component > :nth-child(4)').contains('city')
    cy.get('.en__component--row--2 > .en__component--column--1 > .en__component > :nth-child(5)').contains('IN')
    cy.get('.en__component--column--1 > .en__component > :nth-child(7)').contains('36985')
    cy.get('.en__component--column--1 > .en__component > :nth-child(8)').contains('US')
    cy.get('.en__component--column--1 > .en__component > :nth-child(9)').contains('ST_Premium CC Name')
    cy.get('.en__component > :nth-child(11)').contains('39811')
    cy.get('.en__component > :nth-child(14)').contains('USD')
    cy.get('.en__component > :nth-child(16)').contains('IATS North America')
    cy.get('.en__component > :nth-child(17)').contains('VISA')

  }

  function addShippingDetails() {

    cy.get('#en__field_transaction_shipfname').should('have.value', 'ST Prem Donation')
    cy.get('#en__field_transaction_shiplname').should('have.value', 'Shipping Donation')
    cy.get('#en__field_transaction_shipemail').should('have.value', 'st_premiumdonationfs@engagingnetworks.online')
    cy.get('#en__field_transaction_shipadd1').should('have.value', 'Shipping_Address 1')
    cy.get('#en__field_transaction_shipcity').should('have.value', 'Shipping_City')
    cy.get('#en__field_transaction_shipregion').should('have.value', 'OK')
    cy.get('#en__field_transaction_shippostcode').should('have.value', '112233')
    cy.get('#en__field_transaction_shipcountry').should('have.value', 'USA')
    cy.get('#en__field_transaction_shipnotes').type('Shipping Test')
  }
})
describe('test us.e-activist LogIn ', () => {

  const emailSingle = ('st_premiumgifts_single_' + todaysDate + '@engagingnetworks.online')
  const emailRecur = ('st_premiumgifts_recur_' + tomorrowsDate + '@engagingnetworks.online')
  const emailNoGift = ('st_premiumgift_nogift_' + todaysDate + '@engagingnetworks.online')

  beforeEach(() => {
    cy.visit(Cypress.env('dallasLogIn') + '#login')
    EN.login()
  })

  it('searches for the supporters recurring donation transaction', () => {


    EN.enterSupporter()
      .type(emailRecur)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('ptm')
      expect(text.trim()).contains('fcr')
    })
    cy.get('.gadget__transactionHistory__transaction__field__name').invoke('text').then((text) => {
      const deliveryAddress = expect(text.trim()).contains('Premium Cactus')

    })
  })

  it('searches for the supporters single donation transaction', () => {


    EN.enterSupporter()
      .type(emailSingle)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('ptm')
      expect(text.trim()).contains('fcs')
    })
  })

  it('searches for the supporters with no gift donation transaction', () => {


    EN.enterSupporter()
      .type(emailNoGift)
    EN.searchSupporter()
    EN.lookupSupporter().click()
    EN.transactionType().invoke('text').then((text) => {
      expect(text.trim()).contains('fcs')
    })
    EN.logOut()
  })
})