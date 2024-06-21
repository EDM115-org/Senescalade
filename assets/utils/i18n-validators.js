// skipcq: JS-C1003
import * as validators from "@vuelidate/validators"

export function createI18nValidators(t) {
  const { createI18nMessage } = validators

  const withI18nMessage = createI18nMessage({
    t,
    messagePath: ({ $validator }) => `validations.${$validator}`
  })

  return {
    duree: withI18nMessage(validators.helpers.regex("duree", /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/)),
    email: withI18nMessage(validators.email),
    heure: withI18nMessage(validators.helpers.regex("heure", /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/)),
    maxLength: withI18nMessage(validators.maxLength, { withArguments: true }),
    minLength: withI18nMessage(validators.minLength, { withArguments: true }),
    numeric: withI18nMessage(validators.numeric),
    required: withI18nMessage(validators.required),
    sameAs: withI18nMessage(validators.sameAs, { withArguments: true })
  }
}
