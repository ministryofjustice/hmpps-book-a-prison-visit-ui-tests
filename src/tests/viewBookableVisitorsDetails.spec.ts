import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { getAccessToken } from '../support/testingHelperClient'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
    GlobalData.set('authToken', await getAccessToken({ request }))
    GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Verify details of visitors a booker can book for', () => {

    test.beforeEach(async ({ context, loginPage, homePage }) => {
        context.clearCookies()
        await loginPage.navigateTo('/')
        await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
        await loginPage.goToSignInPage()
        await loginPage.signInWith(UserType.USER_NAME)
    })

    // Number of bookable visitors for this booker is 5 & one of them (Uhoyneke Tevyon) is banned.
    test("List all visitors asssociated with a booker", async ({ homePage, bookableVisitorsPage }) => {
        await homePage.navigateToVisitorsPage()
        const pageHeading = "Visitors you can book for"
        const vistorPageHeading = await bookableVisitorsPage.getPageHeading()
        const vistorsCount = await bookableVisitorsPage.getVisitorsCount()
        expect(pageHeading).toBe(vistorPageHeading)
        expect(vistorsCount).toBe(5)
    })

    // Banned visitors(Uhoyneke Tevyon) are not displayed when selecting visitors who can visit
    test("Banned visitors are not displayed when trying to book a visit", async ({ homePage, visitorPage }) => {
        await homePage.startBooking()
        await visitorPage.checkOnPage('Who is going on the visit?')
        await visitorPage.selectVisitors(4)
        const visitors = await visitorPage.getAllTheVisitorsNamesWithAge()
        expect(visitors).not.toContain("Uhoyneke Tevyon")
    })
})
