import { useState, useRef, useEffect, useCallback, type PropsWithChildren } from "react"
import type { WindowPosition } from "../config/windowConfigs"

interface ResizableWindowProps extends PropsWithChildren {
  title: string
  position: WindowPosition
  zIndex: number
  containerRef: React.RefObject<HTMLDivElement | null>
  onPositionChange: (position: WindowPosition) => void
  onClose: () => void
  onClick: () => void
}

const MIN_W = 200
const MIN_H = 150

export default function ResizableWindow({
  title,
  position,
  zIndex,
  containerRef,
  onPositionChange,
  onClose,
  onClick,
  children,
}: ResizableWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const constrainPosition = useCallback((x: number, y: number, width: number, height: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x, y, width, height }

    const finalWidth = Math.min(width, containerRect.width - 20)
    const finalHeight = Math.min(height, containerRect.height - 20)
    const constrainedX = Math.max(0, Math.min(x, containerRect.width - finalWidth))
    const constrainedY = Math.max(0, Math.min(y, containerRect.height - finalHeight))
    return { x: constrainedX, y: constrainedY, width: finalWidth, height: finalHeight }
  }, [containerRef])

  const handlePointerDown = (e: React.PointerEvent, type: 'drag' | 'resize', handle?: string) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()

    if (type === 'drag') {
      setIsDragging(true)
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        setDragOffset({
          x: e.clientX - (containerRect.left + position.x),
          y: e.clientY - (containerRect.top + position.y),
        })
      } else {
        setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    } else if (type === 'resize' && handle) {
      setIsResizing(true)
      setResizeHandle(handle)
    }
  }

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return

      if (isDragging) {
        const relativeX = e.clientX - dragOffset.x - containerRect.left
        const relativeY = e.clientY - dragOffset.y - containerRect.top
        const c = constrainPosition(relativeX, relativeY, position.width, position.height)
        onPositionChange({ x: c.x, y: c.y, width: c.width, height: c.height })
      } else if (isResizing && resizeHandle) {
        const rect = windowRef.current?.getBoundingClientRect()
        if (!rect) return

        let newWidth = position.width
        let newHeight = position.height
        let newX = position.x
        let newY = position.y

        switch (resizeHandle) {
          case 'se':
            // Clamp growth against the container's right/bottom edge before
            // constrainPosition runs, otherwise the next pointermove recomputes
            // size from a shifted rect and the window "walks" while inflating.
            newWidth = Math.max(MIN_W, Math.min(e.clientX - rect.left, containerRect.width - position.x))
            newHeight = Math.max(MIN_H, Math.min(e.clientY - rect.top, containerRect.height - position.y))
            break
          case 'sw':
            newWidth = Math.max(MIN_W, rect.right - e.clientX)
            newHeight = Math.max(MIN_H, Math.min(e.clientY - rect.top, containerRect.height - position.y))
            newX = position.x + (position.width - newWidth)
            newX = Math.max(0, newX)
            break
          case 'ne':
            newWidth = Math.max(MIN_W, Math.min(e.clientX - rect.left, containerRect.width - position.x))
            newHeight = Math.max(MIN_H, rect.bottom - e.clientY)
            newY = position.y + (position.height - newHeight)
            newY = Math.max(0, newY)
            break
          case 'nw':
            newWidth = Math.max(MIN_W, rect.right - e.clientX)
            newHeight = Math.max(MIN_H, rect.bottom - e.clientY)
            newX = position.x + (position.width - newWidth)
            newY = position.y + (position.height - newHeight)
            newX = Math.max(0, newX)
            newY = Math.max(0, newY)
            break
        }

        const c = constrainPosition(newX, newY, newWidth, newHeight)
        onPositionChange({ x: c.x, y: c.y, width: c.width, height: c.height })
      }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    }
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, isResizing, resizeHandle, dragOffset, position, onPositionChange, containerRef, constrainPosition])

  return (
    <div
      ref={windowRef}
      className="resizable-window"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        zIndex: isDragging || isResizing ? 1000 : zIndex,
      }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      <div
        className="window-titlebar"
        onPointerDown={(e) => handlePointerDown(e, 'drag')}
      >
        <div className="window-title">
          <div className="led green" />
          <span>{title}</span>
        </div>
        <button className="window-close" onClick={onClose}>×</button>
      </div>
      <div className="window-content">{children}</div>
      {(['se', 'sw', 'ne', 'nw'] as const).map(handle => (
        <div
          key={handle}
          className={`resize-handle ${handle}`}
          onPointerDown={(e) => handlePointerDown(e, 'resize', handle)}
        />
      ))}
    </div>
  )
}
