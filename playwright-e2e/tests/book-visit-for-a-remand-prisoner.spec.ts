import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { getAccessToken, deleteApplication, deleteVisit, } from '../support/testingHelperClient'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
    GlobalData.set('authToken', await getAccessToken({ request }))
    GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Book a visit for remand prisoners', () => {

    test.beforeEach(async ({ context,loginPage, homePage }) => {
        await context.clearCookies()
        
         const prisonerName: string = "Ef'liaico Olivetria"
        await loginPage.navigateTo('/')
        await loginPage.clickStartNowButton()
        await loginPage.goToSignInPage()
        await loginPage.signInWith(UserType.REMAND_PRISONER_VISITOR)
        await homePage.checkOnPage('Book a visit')
        const name = await homePage.getPrisonerName()
        expect(name).toBe(prisonerName)

    })
   // This tests also verifies the fuctionality of displaying "visit requested" intead of visit booked. 
    test('Should be able to book a visit for remand prisoner', async ({
        homePage,
        visitorPage,
        visitCalendarPage,
        additionalSupportPage,
        mainContactPage,
        visitDetailsPage,
        bookingConfirmationPage,
        bookingsPage,
        contactDetailsPage
    }) => {
        test.slow()
        await homePage.startBooking()
        await visitorPage.checkOnPage('Who is going on the visit?')
        await visitorPage.selectLastVisitor()
        await visitorPage.continueToNextPage()

        await visitCalendarPage.checkOnPage('Choose the visit time')
        await visitCalendarPage.selectFirstAvailableDate()
        await visitCalendarPage.selectFirstAvailableTime()

        const visitDate = await visitCalendarPage.getSelectedDate()
        const visitTime = await visitCalendarPage.getSelectedTime()
        await visitCalendarPage.continueToNextPage()

        await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
        await additionalSupportPage.selectNoSupport()
        const applicationReference = await additionalSupportPage.getApplicationReference()
        GlobalData.set('applicationReference', applicationReference)
        await additionalSupportPage.continueToNextPage()

        await mainContactPage.checkOnPage('Who is the main contact for this booking?')
        await mainContactPage.selectMainContact()
        await mainContactPage.continueToNextPage()
        await contactDetailsPage.enterEmailAdd()
        await contactDetailsPage.enterPhoneNumber()
        await contactDetailsPage.continueToNextPage()

        await visitDetailsPage.checkOnPage('Check the visit details')
        await visitDetailsPage.submitBooking()

        expect(await bookingConfirmationPage.checkOnPage('Visit requested'))
    
        const visitReference = await bookingConfirmationPage.getRequestRefNumber()
        GlobalData.set('visitReference', visitReference)
    })
    test.afterAll('Teardown test data', async ({ request }) => {
        let appRef = GlobalData.getAll('applicationReference')
        let visitRef = GlobalData.getAll('visitReference')

        for (const visitId of visitRef) {
            await deleteVisit({ request }, visitId)
        }

        for (const applicationId of appRef) {
            await deleteApplication({ request }, applicationId)
        }
    })
})
