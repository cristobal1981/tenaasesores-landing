export type OnboardingCountryOption = {
  id: number
  code: string
  name: string
}

export type OnboardingProvinceOption = {
  id: number
  name: string
  countryId: number
}

export type OnboardingAddressCatalog = {
  countries: OnboardingCountryOption[]
  provinces: OnboardingProvinceOption[]
  defaultCountryId: number
}
