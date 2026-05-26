import { ErrorScreen } from "@/components/errors/error-screen"
import { errorPages } from "@/content/errors"

export default function BadRequestPage() {
  const page = errorPages[400]

  return (
    <ErrorScreen
      code={page.code}
      title={page.title}
      description={page.description}
      image={page.image}
      imageAlt={page.imageAlt}
      primaryHref={page.primaryHref}
      primaryLabel={page.primaryLabel}
    />
  )
}
