export default class ENV {
  public static readonly BASE_URL = process.env.BASE_URL

  public static readonly USER_NAME = process.env.USER_NAME
  public static readonly NEW_USER_NAME = process.env.NEW_USER_NAME
  public static readonly UNKNOWN_USER_NAME = process.env.UNKNOWN_USER_NAME
  public static readonly NO_VO_USER_NAME = process.env.NO_VO_USER_NAME
  public static readonly ONE_VO_BALANCE_USER_NAME = process.env.ONE_VO_BALANCE_USER_NAME

  public static readonly PASSWORD = process.env.PASSWORD

  public static readonly INTEG_USER_NAME = process.env.INTEG_USER_NAME
  public static readonly INTEG_PASSWORD = process.env.INTEG_PASSWORD
  public static readonly DEV_USER = process.env.DEV_USER
  public static readonly DEV_PASSWORD = process.env.DEV_PASSWORD

  public static readonly HMPPS_AUTH_URL = process.env.HMPPS_AUTH_URL
  public static readonly TEST_HELPER_API_URL = process.env.TEST_HELPER_API_URL
  public static readonly CLIENT_ID = process.env.CLIENT_ID
  public static readonly CLIENT_SECRET = process.env.CLIENT_SECRET
}
