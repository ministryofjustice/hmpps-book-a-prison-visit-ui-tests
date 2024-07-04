import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import {
  cancelVisit,
  deleteApplication,
  deleteVisit,
  getAccessToken,
  updateModifyTimestamp,
  updateOpenSessionCapacity,
} from '../support/testingHelperClient'

const applicationReference: string[] = [
  'xup-wpq-jgz',
  'ofq-ope-dpx',
  'dus-mdd-pjg',
  'siy-yvs-ejv',
  'ncm-lxw-qnp',
  'puw-jva-bxg',
  'eun-oxe-sym',
  'kcl-abn-ezs',
  'zah-rxg-yzo',
  'aaf-dse-ona',
  'lah-vqs-ebx',
  'yac-jgm-wyj',
  'xah-aar-slr',
  'dah-mbl-sos',
  'sai-awj-mdy',
  'nai-xon-zaz',
  'pai-ozb-ewz',
  'eau-dsw-lpj',
]

const visitReference: string[] = [
  'xf-lx-vp-vp',
  'mf-yx-wv-dd',
  'qh-go-vy-zn',
  'ri-me-ae-qs',
  'bc-xq-pm-xp',
  'ou-wo-vy-yo',
  'di-em-xq-qs',
  'su-jz-zm-po',
  'nc-ev-dv-wb',
]

const additionalSupportDetails = 'Wheelchair access'

test.beforeAll(async ({ request }) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
})

test.describe.skip('Create a booking to visit a prisoner - Fixtures', () => {
  test('Test one', async ({
    loginPage,
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
  }) => {
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()

    homePage.checkOnPage('Book a visit')
    const prisonerName = await homePage.getPrisonerName()
    expect(prisonerName).toBe('Cinfsa Benison')
    GlobalData.set('prisonerName', prisonerName)
    await homePage.startBooking()

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(3)
    const visitors = await visitorPage.getAllTheVisitorsNames()
    console.log(`Visitors: ${visitors}`)
    GlobalData.set('visitors', visitors)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    const visitDate = await visitCalendarPage.getSelectedDate()
    const visitTime = await visitCalendarPage.getSelectedTime()
    GlobalData.set('visitDate', visitDate)
    GlobalData.set('visitTime', visitTime)
    console.log(`Visit Date: ${visitDate}`)
    console.log(`Visit Time: ${visitTime}`)
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectSupport(additionalSupportDetails)
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    console.log(`Application Reference: ${applicationReference}`)
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectMainContact()
    await mainContactPage.selectNoPhoneNumberProvided()
    const mainContact = await mainContactPage.getMainContactName()
    const phoneNumber = await mainContactPage.getPhoneNumber()
    GlobalData.set('mainContact', mainContact)
    GlobalData.set('phoneNumber', phoneNumber)
    console.log(`Main Contact: ${mainContact}`)
    console.log(`Phone Number: ${phoneNumber}`)
    await mainContactPage.continueToNextPage()
  })

  test('Test two', async ({
    loginPage,
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
  }) => {
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()

    homePage.checkOnPage('Book a visit')
    const prisonerName = await homePage.getPrisonerName()
    expect(prisonerName).toBe('Cinfsa Benison')
    GlobalData.set('prisonerName', prisonerName)
    await homePage.startBooking()

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(3)
    const visitors = await visitorPage.getAllTheVisitorsNames()
    console.log(`Visitors: ${visitors}`)
    GlobalData.set('visitors', visitors)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    const visitDate = await visitCalendarPage.getSelectedDate()
    const visitTime = await visitCalendarPage.getSelectedTime()
    GlobalData.set('visitDate', visitDate)
    GlobalData.set('visitTime', visitTime)
    console.log(`Visit Date: ${visitDate}`)
    console.log(`Visit Time: ${visitTime}`)
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectSupport(additionalSupportDetails)
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    console.log(`Application Reference: ${applicationReference}`)
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectMainContact()
    await mainContactPage.selectNoPhoneNumberProvided()
    const mainContact = await mainContactPage.getMainContactName()
    const phoneNumber = await mainContactPage.getPhoneNumber()
    GlobalData.set('mainContact', mainContact)
    GlobalData.set('phoneNumber', phoneNumber)
    console.log(`Main Contact: ${mainContact}`)
    console.log(`Phone Number: ${phoneNumber}`)
    await mainContactPage.continueToNextPage()
  })

  /* test('Update timestamp for an application', async ({ request }) => {
    const updatedStatus = await updateModifyTimestamp({ request }, 'mju-pva-dwm', '20')
    expect(updatedStatus).toBe(200)
  })

  test.only('Delete an applicatioin', async ({ request }) => {
    // console.log('Authtoket:', globalData.get('authToken'))

    for (const applicationId of applicationReference) {
      const status = await deleteApplication({ request }, applicationId)
      expect(status).toBe(200)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // const status = await deleteApplication({ request }, 'mju-pva-dwm')
    // expect(status).toBe(200)
  })

  test('Delete a visit', async ({ request }) => {
    const status = await deleteVisit({ request }, 'lm-fz-ld-yv')
    expect(status).toBe(200)
  })*/

  test('Cancel visit', async ({ request }) => {
    for (const visitRef of visitReference) {
      const status = await cancelVisit({ request }, visitRef)
      expect(status).toBe(200)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  })

  test('Delete an applicatioin', async ({ request }) => {
    // new application reference : gma-ubo-ayr
    for (const applicationId of applicationReference) {
      const status = await deleteApplication({ request }, applicationId)
      expect(status).toBe(200)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  })

  test('Delete a visit', async ({ request }) => {
    for (const visitRef of visitReference) {
      const status = await deleteVisit({ request }, visitRef)
      expect(status).toBe(200)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  })

  test('Update open sessions capacity', async ({ request }) => {
    const status = await updateOpenSessionCapacity({ request }, 'bqa-fqj-gyr', 24)
    expect(status).toBe(200)
  })

  test('Update timestamp for an application', async ({ request }) => {
    const updatedStatus = await updateModifyTimestamp({ request }, 'eqa-ivw-jqz', '20')
    expect(updatedStatus).toBe(200)
  })
})
