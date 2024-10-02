import { defineLocale } from "../../../src/runtime/composables/defineLocale";

export default defineLocale({
  locale: { code: "da" },
  datetimeFormats: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    },
    dt: {
      dateStyle: "full",
      timeStyle: "long"
    }
    // new Intl.DateTimeFormat("da-DK", {
    //   dateStyle: "full",
    //   timeStyle: "long"
    // })
  },
  numberFormats: {
    currency: {
      style: "currency",
      signDisplay: "never",
      currency: "EUR"
    }
  }
})
