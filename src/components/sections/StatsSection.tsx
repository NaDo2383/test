"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

export default function StatsSection() {
  const t = useTranslations("stats")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = [
    { number: 110, label: t("experts") },
    { number: 98, label: t("marketers") },
    { number: 560, label: t("solutions") },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className='py-24 bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}>
              <h3 className='text-6xl font-bold text-white mb-2'>
                {isVisible ? <CountUp end={stat.number} duration={2000} /> : "0"}
              </h3>
              <p className='text-gray-400 uppercase tracking-wider'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ end, duration }: { end: number; duration: number }) {
  const [count, setCount] = useState(0)
  const startTime = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    startTime.current = Date.now()

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime.current) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        rafId.current = requestAnimationFrame(updateCount)
      }
    }

    rafId.current = requestAnimationFrame(updateCount)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [end, duration])

  return <>{count}</>
}
