import { useMotionTemplate, useSpring, useTransform } from 'motion/react'
import { type RefObject, useState } from 'react'

const SPRING = { damping: 35, stiffness: 200 }

export function useFoilTilt(ref: RefObject<HTMLDivElement | null>, dragging: boolean) {
  const [beamX, setBeamX] = useState(50)
  const rotX = useSpring(0, SPRING)
  const rotY = useSpring(0, SPRING)
  const foilBgX = useTransform(rotY, [-8, 8], [80, 20])
  const foilBgY = useTransform(rotX, [-8, 8], [20, 80])
  const foilBgPos = useMotionTemplate`${foilBgX}% ${foilBgY}%`

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setBeamX(x)
    rotX.set((y - 50) * -0.14)
    rotY.set((x - 50) * 0.14)
  }

  const onPointerLeave = () => {
    rotX.set(0)
    rotY.set(0)
  }

  return { beamX, foilBgPos, onPointerLeave, onPointerMove, rotX, rotY }
}
