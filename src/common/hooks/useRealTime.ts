"use client"

import { useState, useEffect } from "react"

export const useRealTime = (orderCreatedAt?: string) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const displayTime = orderCreatedAt
    ? new Date(orderCreatedAt).toLocaleString("vi-VN")
    : currentTime.toLocaleString("vi-VN")

  return { displayTime, currentTime }
}

