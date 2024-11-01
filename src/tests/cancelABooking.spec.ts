import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, deleteVisit, getAccessToken } from '../support/testingHelperClient'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
    GlobalData.set('authToken', await getAccessToken({ request }))
    GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Create a booking via public ui', () => {
    const prisonerName: string = 'Arkmanain Editha'

    test.beforeEach(async ({ loginPage, homePage }) => {
        await loginPage.navigateTo('/')

        const name = await homePage.getPrisonerName()
        expect(name).toBe(prisonerName)
        await homePage.startBooking()
    })

    test('Cancel a visit', async ({
        homePage,
        visitorPage,
        visitCalendarPage,
        additionalSupportPage,
        mainContactPage,
        visitDetailsPage,
        bookingConfirmationPage,
        bookingsPage
    }) => {
        await visitorPage.checkOnPage('Who is going on the visit?')
        await visitorPage.slectLastVisitor()
        const visitors = await visitorPage.getAllTheVisitorsNamesWithAge()
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
        await mainContactPage.selectNoPhoneNumberProvided()
        const mainContact = await mainContactPage.getMainContactName()
        await mainContactPage.continueToNextPage()

        await visitDetailsPage.checkOnPage('Check the visit details before booking')
        const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
        const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
        const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
        const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
        const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

        expect(prisonerNameOnDetails).toBe(prisonerName)
        expect(visitorsNamesOnDetails).toEqual(visitors)
        expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
        expect(additionalSupportDetailsOnDetails).toBe('None')
        expect(mainContactNameOnDetails).toContain(mainContact)

        await visitDetailsPage.submitBooking()

        await bookingConfirmationPage.checkOnPage('Visit booked')
        expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
        expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
        const visitReference = await bookingConfirmationPage.getReferenceNumber()
        const nameOfThePrison = await bookingConfirmationPage.getPisonName()
        const prisonContactNumber = await bookingConfirmationPage.getPisonNumber()
        expect(nameOfThePrison).toContain('Foston Hall (HMP & YOI)')
        expect(prisonContactNumber).toContain('0123 456 7890')
        await bookingConfirmationPage.clickCancelBooking()

        bookingsPage.checkOnPage('Bookings')
        await bookingsPage.clickCancelBookingLink()
        await homePage.checkOnPage('Are you sure you want to cancel your booking?')
        await homePage.cancelBooking()
        await homePage.clickConfirm()
        await homePage.checkOnPage('Booking cancelled')
        const message = await homePage.getConfirmationMessage()
        expect(message).toContain('The main contact for this booking will get a text message to confirm it has been cancelled.')
        console.log('Confirmation message: ', visitReference)
    })

    test('Select do not cancel a visit', async ({
        homePage,
        visitorPage,
        visitCalendarPage,
        additionalSupportPage,
        mainContactPage,
        visitDetailsPage,
        bookingConfirmationPage,
        bookingsPage
    }) => {
        await visitorPage.checkOnPage('Who is going on the visit?')
        await visitorPage.slectLastVisitor()
        const visitors = await visitorPage.getAllTheVisitorsNamesWithAge()
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
        await mainContactPage.selectNoPhoneNumberProvided()
        const mainContact = await mainContactPage.getMainContactName()
        await mainContactPage.continueToNextPage()

        await visitDetailsPage.checkOnPage('Check the visit details before booking')
        const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
        const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
        const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
        const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
        const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

        expect(prisonerNameOnDetails).toBe(prisonerName)
        expect(visitorsNamesOnDetails).toEqual(visitors)
        expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
        expect(additionalSupportDetailsOnDetails).toBe('None')
        expect(mainContactNameOnDetails).toContain(mainContact)

        await visitDetailsPage.submitBooking()

        await bookingConfirmationPage.checkOnPage('Visit booked')
        expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
        expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
        const visitReference = await bookingConfirmationPage.getReferenceNumber()
        const nameOfThePrison = await bookingConfirmationPage.getPisonName()
        const prisonContactNumber = await bookingConfirmationPage.getPisonNumber()
        expect(nameOfThePrison).toContain('Foston Hall (HMP & YOI)')
        expect(prisonContactNumber).toContain('0123 456 7890')
        await bookingConfirmationPage.clickCancelBooking()

        bookingsPage.checkOnPage('Bookings')
        await bookingsPage.clickCancelBookingLink()
        await homePage.checkOnPage('Are you sure you want to cancel your booking?')
        await homePage.selectKeepThislBooking()
        await homePage.clickConfirm()
        await homePage.checkOnPage('Visit booking details')
        const refNumberInBookingDetails = await homePage.getBookingRefNumber()
        expect(visitReference).toEqual(refNumberInBookingDetails)

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
