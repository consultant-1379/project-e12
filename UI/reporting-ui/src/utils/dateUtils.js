import React from 'react'

export function formatDate(time) {
  if(!time) return ''

  const currentTime = new Date(time)

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const year = currentTime.getFullYear()
  const month = currentTime.getMonth() + 1
  const day = currentTime.getDate()
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const seconds = currentTime.getSeconds()

  const timeZoneOffsetMinutes = currentTime.getTimezoneOffset()

  const timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffsetMinutes / 60))

  const timeZoneDirection = timeZoneOffsetMinutes > 0 ? '-' : '+'

  const timeZoneString = `<span style="color: green;">GMT${timeZoneDirection}${timeZoneOffsetHours}</span>`

  const timeString = `<span style="color: red;">${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}</span>`

  return (
      <div>
        { timeZone } <span dangerouslySetInnerHTML={{ __html: timeZoneString }} /> <span dangerouslySetInnerHTML={{ __html: timeString }} />
      </div>
  );
}