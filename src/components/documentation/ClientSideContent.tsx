'use client'

import { useEffect, useState } from 'react'

export function ClientSideContent() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-6 mt-10">
      <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
      <p className="mb-2">
        This content is rendered client-side to avoid hydration mismatches.
      </p>
      <button className="bg-blue-500 text-white font-semibold py-1 px-2 rounded hover:bg-blue-600 mx-2">
        Build Now
      </button>
    </div>
  )
}