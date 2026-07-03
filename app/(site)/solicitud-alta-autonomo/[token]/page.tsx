import type { Metadata } from "next"

import { AltaAutonomoAccessError } from "@/components/pages/alta-autonomo-access-error"

import { AltaAutonomoFormPage } from "@/components/pages/alta-autonomo-form-page"

import type { OnboardingAddressCatalog } from "@/lib/alta-autonomo/onboarding-catalog"

import {

  resolveAltaAutonomoAccessError,

  resolveAltaAutonomoServiceError,

} from "@/lib/alta-autonomo/resolve-access-error"

import { validateAltaAutonomoOnboardingToken } from "@/lib/alta-autonomo/syntia-onboarding-client"



type PageProps = {

  params: Promise<{ token: string }>

}



export const metadata: Metadata = {

  title: "Solicitud alta autonomo | tenaasesores",

  description: "Formulario privado para tramitar el alta de autonomo.",

  robots: { index: false, follow: false },

}



export default async function SolicitudAltaAutonomoTokenPage({ params }: PageProps) {

  const { token } = await params

  const safeToken = typeof token === "string" ? token.trim() : ""



  if (!safeToken) {

    const error = resolveAltaAutonomoAccessError("not_found")

    return (

      <AltaAutonomoAccessError

        variant={error.variant}

        title={error.title}

        body={error.body}

        hint={error.hint}

      />

    )

  }



  let recipientEmail: string | undefined

  let catalog: OnboardingAddressCatalog | undefined



  try {

    const tokenResult = await validateAltaAutonomoOnboardingToken(safeToken)

    if (!tokenResult.ok || !tokenResult.valid || !tokenResult.catalog) {

      const error = resolveAltaAutonomoAccessError(tokenResult.error)

      return (

        <AltaAutonomoAccessError

          variant={error.variant}

          title={error.title}

          body={error.body}

          hint={error.hint}

        />

      )

    }

    recipientEmail = tokenResult.recipientEmail

    catalog = tokenResult.catalog

  } catch (error) {

    console.error("[alta-autonomo] token validation failed", error)

    const accessError = resolveAltaAutonomoServiceError()



    return (

      <AltaAutonomoAccessError

        variant={accessError.variant}

        title={accessError.title}

        body={accessError.body}

        hint={accessError.hint}

      />

    )

  }



  return (

    <AltaAutonomoFormPage

      token={safeToken}

      initialEmail={recipientEmail}

      addressCatalog={catalog}

    />

  )

}


