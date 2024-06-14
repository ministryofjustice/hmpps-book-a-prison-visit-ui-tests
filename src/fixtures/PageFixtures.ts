import { test as baseTest, expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage'
import AdditionalSupportPage from '../pages/AdditionalSupportPage'
import HomePage from '../pages/HomePage'
import MainContactPage from '../pages/MainContactPage'
import VisitorPage from '../pages/VisitorPage'
import VisitsCalendarPage from '../pages/VisitsCalendarPage'

type PageFixtures = {
  loginPage: LoginPage
  homePage: HomePage
  visitorPage: VisitorPage
  visitCalendarPage: VisitsCalendarPage
  additionalSupportPage: AdditionalSupportPage
  mainContactPage: MainContactPage
}

const test = baseTest.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },

  visitorPage: async ({ page }, use) => {
    await use(new VisitorPage(page))
  },

  visitCalendarPage: async ({ page }, use) => {
    await use(new VisitsCalendarPage(page))
  },

  additionalSupportPage: async ({ page }, use) => {
    await use(new AdditionalSupportPage(page))
  },

  mainContactPage: async ({ page }, use) => {
    await use(new MainContactPage(page))
  },
})

export { test, expect }
