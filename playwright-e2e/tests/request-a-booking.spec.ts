import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { getAccessToken, deleteApplication, deleteVisit, } from '../support/testingHelperClient'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
    GlobalData.set('authToken', await getAccessToken({ request }))
    GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Request a booking', () => {

    test.beforeEach(async ({ context, loginPage }) => {
        await context.clearCookies()
        await loginPage.navigateTo('/')
        await loginPage.clickStartNowButton()
        await loginPage.goToSignInPage()

    })
    // A booking would be requested instead of confirmed based on the alerts applicable for a prisoner.
    test('Booking is requested , not confirmed, if alerts apply to the prisoner.', async ({
        loginPage,
        homePage,
        visitorPage,
        visitCalendarPage,
        additionalSupportPage,
        mainContactPage,
        visitDetailsPage,
        contactDetailsPage,
        visitRequestedPage

    }) => {
        test.slow()
        await loginPage.signInWith(UserType.USER_WITH_PRISONER_ALERTS)
        const prisonerName: string = "Vsip_alert Do Not Use"
        await homePage.checkOnPage('Book a visit')
        const name = await homePage.getPrisonerName()
        expect(name).toBe(prisonerName)
        await homePage.startBooking()
        await visitorPage.checkOnPage('Who is going on the visit?')
        await visitorPage.selectLastVisitor()
        await visitorPage.continueToNextPage()

        await visitCalendarPage.checkOnPage('Choose the visit time')
        await visitCalendarPage.selectFirstAvailableDate()
        await visitCalendarPage.selectFirstAvailableTime()

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

        await visitRequestedPage.checkOnPage('Visit requested')

        const reviewMsg = await visitRequestedPage.getReviewMsg()
        const decisionMsg = await visitRequestedPage.getPrisonDecisionMessageText()
        expect(reviewMsg).toContain('It will now be reviewed by Hewell (HMP)')
        expect(decisionMsg).toBe('Hewell (HMP) will confirm or reject your request.')

        const visitReference = await visitRequestedPage.getRequestRefNumber()

        GlobalData.set('visitReference', visitReference)
    })
    // A booking would be requested instead of confirmed based on the restrictions applicable for a prisoner.
    test('Booking is requested , not confirmed, if restrictions apply to the prisoner.', async ({
        loginPage,
        homePage,
        visitorPage,
        visitCalendarPage,
        additionalSupportPage,
        mainContactPage,
        visitDetailsPage,
        contactDetailsPage,
        visitRequestedPage

    }) => {
        test.slow()
        await loginPage.signInWith(UserType.USER_WITH_PRISONER_RESTRICTIONS)
        const prisonerName: string = "Visp_restricted Do Not Use"
        await homePage.checkOnPage('Book a visit')
        const name = await homePage.getPrisonerName()
        expect(name).toBe(prisonerName)
        await homePage.startBooking()
        await visitorPage.checkOnPage('Who is going on the visit?')
        await visitorPage.selectLastVisitor()
        await visitorPage.continueToNextPage()

        await visitCalendarPage.checkOnPage('Choose the visit time')
        await visitCalendarPage.selectFirstAvailableDate()
        await visitCalendarPage.selectFirstAvailableTime()

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

        await visitRequestedPage.checkOnPage('Visit requested')

        const reviewMsg = await visitRequestedPage.getReviewMsg()
        const decisionMsg = await visitRequestedPage.getPrisonDecisionMessageText()
        expect(reviewMsg).toContain('It will now be reviewed by Hewell (HMP)')
        expect(decisionMsg).toBe('Hewell (HMP) will confirm or reject your request.')

        const visitReference = await visitRequestedPage.getRequestRefNumber()

        GlobalData.set('visitReference', visitReference)
    })

    //A booking would be requested instead of confirmed based on the restrictions applicable for a visistor.
    test('Booking is requested , not confirmed, if restrictions apply to the visitor.', async ({
        loginPage,
        homePage,
        visitorPage,
        visitCalendarPage,
        additionalSupportPage,
        mainContactPage,
        visitDetailsPage,
        contactDetailsPage,
        visitRequestedPage

    }) => {
        test.slow()
        await loginPage.signInWith(UserType.USER_WITH_VISITOR_RESTRICTIONS)
        const prisonerName: string = "Vsip_visitor_restriction Do Not Change"
        await homePage.checkOnPage('Book a visit')
        const name = await homePage.getPrisonerName()
        expect(name).toBe(prisonerName)
        await homePage.startBooking()
        await visitorPage.checkOnPage('Who is going on the visit?')
        await visitorPage.selectLastVisitor()
        await visitorPage.continueToNextPage()

        await visitCalendarPage.checkOnPage('Choose the visit time')
        await visitCalendarPage.selectFirstAvailableDate()
        await visitCalendarPage.selectFirstAvailableTime()

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

        await visitRequestedPage.checkOnPage('Visit requested')

        const reviewMsg = await visitRequestedPage.getReviewMsg()
        const decisionMsg = await visitRequestedPage.getPrisonDecisionMessageText()
        expect(reviewMsg).toContain('It will now be reviewed by Hewell (HMP)')
        expect(decisionMsg).toBe('Hewell (HMP) will confirm or reject your request.')

        const visitReference = await visitRequestedPage.getRequestRefNumber()

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
