import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class CancelledBookingsPage extends BasePage {
    private readonly cancelledBookings: Locator

    constructor(page:Page) {
        super(page)
        this.cancelledBookings = page.locator('[class^=bookings-content]')
    }
    async getCancelledBookingsCount(): Promise<number> {
        return await this.cancelledBookings.count()
      }}