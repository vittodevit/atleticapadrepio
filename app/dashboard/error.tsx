'use client'

import {useEffect, useState} from 'react'
import ErrorAlert from "@/components/error-alert";

export default function Error({
                                error
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setErrorMessage(error.message)
  }, [error])

  return (
    <div>
      <ErrorAlert error={errorMessage} />
    </div>
  )
}