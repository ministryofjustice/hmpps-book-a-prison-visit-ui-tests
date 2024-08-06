import { IApplication } from '../data/IApplication'
import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import {
  cancelVisit,
  createApplication,
  createVisit,
  deleteApplication,
  deleteVisit,
  getAccessToken,
  updateModifyTimestamp,
  updateOpenSessionCapacity,
} from '../support/testingHelperClient'

const applicationReference: string[] = [
'pvy-fyo-mmp',
'evy-cpw-oqg',
'gvy-csq-evq',
'jvy-hny-vpa',
'vvy-fpa-oob',
'wvy-cwm-mzw',
'kvy-uqb-dbn',
'zwy-fxo-dxr',
'awy-hee-rne',
'lwy-hwr-drl',
'xky-czy-qoj',
'mky-uwg-yzy',
'qky-crd-mvo',
'rky-isa-ylb',
'bky-har-poj',
'oky-cod-sla',
'dky-uzz-xnx',
'sky-fsb-oav',
'nvy-udd-xnp',
'nky-hjq-xzx',
'pky-uss-wgb',
'eky-hml-qyn',
]

const visitReference: string[] = [
  'lz-lh-go-ry',
  'yz-lu-nm-zl',
  'xz-lh-ej-dy',
  'mz-lh-yj-pp',
]

test.beforeAll(async ({ request }) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
})

test.describe('Create a booking to visit a prisoner - Fixtures', () => {
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

  test('Create an applicatioin', async ({ request }) => {
    const application: IApplication = {
      prisonCode: 'FHI',
      // prisonerId: 'G5808UP',
      prisonerId: 'G1672UD',
      sessionDate: '2024-08-18',
      sessionStart: '09:30',
      sessionEnd: '11:30',
      userType: 'STAFF',
      contactName: 'HS',
      visitors: [4539726],
      visitRestriction: 'OPEN',
    }

    const res = await createApplication({ request }, application)
    console.log('Ref:', res.applicationRef)
    console.log('Status:', res.status)
    expect(res.status).toBe(200)
    await new Promise(resolve => setTimeout(resolve, 500))

    const createVisitRes = await createVisit({ request }, res.applicationRef)
    console.log('Visit Ref:', createVisitRes.visitRef)
    expect(createVisitRes.status).toBe(200)
    await new Promise(resolve => setTimeout(resolve, 500))
  })

  test('Cancel visit', async ({ request }) => {
    for (const visitRef of visitReference) {
      const status = await cancelVisit({ request }, visitRef)
      expect(status).toBe(200)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  })

  test('Delete an applicatioin', async ({ request }) => {
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
    const status = await updateOpenSessionCapacity({ request }, 'lpy-izy-vba', 24)
    expect(status).toBe(200)
  })

  test('Update timestamp for an application', async ({ request }) => {
    const updatedStatus = await updateModifyTimestamp({ request }, 'eqa-ivw-jqz', '20')
    expect(updatedStatus).toBe(200)
  })
})
