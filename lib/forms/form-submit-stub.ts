
export function isFormSubmitStubEnabled(): boolean {
  const value = process.env.NEXT_PUBLIC_FORM_SUBMIT_STUB?.trim().toLowerCase()
  return value === "1" || value === "true" || value === "yes"
}

export const formSubmitStubDelayMs = 400
