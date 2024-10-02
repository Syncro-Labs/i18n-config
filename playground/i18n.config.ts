import datetimeFormats from './.nuxt/i18n/datetimeFormats.json'
import numberFormats from './.nuxt/i18n/numberFormats.json'
export default defineI18nConfig(async () => {

  // try {
  //   const datetimeFormats = await import('./.nuxt/i18n/datetimeFormats.json')
  //   const numberFormats = await import('./.nuxt/i18n/numberFormats.json')

  //   return {
  //     datetimeFormats: datetimeFormats,
  //     numberFormats: numberFormats
  //   }
  // } catch (e) {
  //   return {

  //   }
  // }

  return {
    datetimeFormats: datetimeFormats,
    numberFormats: numberFormats
  }

})
