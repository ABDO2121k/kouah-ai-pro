import { Card } from '@/components/ui/card'
import React from 'react'

// type Props = {
//   chatRoomId: string
//   setChats: React.Dispatch<
//     React.SetStateAction<
//       {
//         role: 'user' | 'assistant'
//         content: string
//         link?: string | undefined
//       }[]
//     >
//   >
// }

const RealTimeMode = () => {
//  useRealTime(chatRoomId, setChats)

  return (
    <Card className="px-3 rounded-full py-1 bg-[#06b6d4] font-bold text-white text-sm">
      Real Time
    </Card>
  )
}

export default RealTimeMode