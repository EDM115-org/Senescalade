import * as validators from "@vuelidate/validators"

export function createI18nValidators(t) {
  const { createI18nMessage } = validators

  const withI18nMessage = createI18nMessage({
    t,
    messagePath: ({ $validator }) => `validations.${$validator}`
  })

  return {
    required: withI18nMessage(validators.required),
    email: withI18nMessage(validators.email),
    minLength: withI18nMessage(validators.minLength, { withArguments: true }),
    sameAs: withI18nMessage(validators.sameAs, { withArguments: true })
  }
}
