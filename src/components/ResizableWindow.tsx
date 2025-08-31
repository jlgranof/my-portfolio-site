import { useState, useRef, useEffect, type PropsWithChildren } from "react"
import type { WindowPosition } from "../config/windowConfigs"

interface ResizableWindowProps extends PropsWithChildren {
  title: string
  position: WindowPosition
  zIndex: number
  onPositionChange: (position: WindowPosition) => void
  onClose: () => void
  onClick: () => void
}

export default function ResizableWindow({ 
  title, 
  position, 
  zIndex,
  onPositionChange, 
  onClose, 
  onClick,
  children 
}: ResizableWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const getScreenBounds = () => {
    // Find the Screen component to get its bounds
    const screenElement = document.querySelector('.screen')
    if (screenElement) {
      const rect = screenElement.getBoundingClientRect()
      return {
        screenHeight: rect.height,
        screenWidth: rect.width,
        screenLeft: rect.left,
        screenTop: rect.top
      }
    }
    // Fallback to viewport if screen not found
    return {
      screenHeight: document.documentElement.clientHeight,
      screenWidth: document.documentElement.clientWidth,
      screenLeft: 0,
      screenTop: 0
    }
  }

  const constrainPosition = (x: number, y: number, width: number, height: number) => {
    // Get the window container's boundaries
    const windowContainerElement = document.querySelector('.window-container')
    const containerRect = windowContainerElement ? windowContainerElement.getBoundingClientRect() : null
    
    if (!containerRect) {
      return { x, y, width, height }
    }
    
    // Handle size constraints first - if window is too big, shrink it
    let finalWidth = width
    let finalHeight = height
    
    if (width > containerRect.width) {
      finalWidth = containerRect.width - 20 // Leave some margin
    }
    
    if (height > containerRect.height) {
      finalHeight = containerRect.height - 20 // Leave some margin
    }
    
    // Constrain position to container bounds (relative to container)
    const constrainedX = Math.max(0, Math.min(x, containerRect.width - finalWidth))
    const constrainedY = Math.max(0, Math.min(y, containerRect.height - finalHeight))
    
    return { x: constrainedX, y: constrainedY, width: finalWidth, height: finalHeight }
  }

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize', handle?: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Bring window to front when clicked
    onClick()
    
    if (type === 'drag') {
      setIsDragging(true)
      
      // Get the container's position to calculate the correct offset
      const windowContainerElement = document.querySelector('.window-container')
      const containerRect = windowContainerElement ? windowContainerElement.getBoundingClientRect() : null
      
      if (containerRect) {
        // Calculate offset relative to the container
        const absoluteWindowX = containerRect.left + position.x
        const absoluteWindowY = containerRect.top + position.y
        
        setDragOffset({
          x: e.clientX - absoluteWindowX,
          y: e.clientY - absoluteWindowY
        })
      } else {
        // Fallback to original calculation
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y
        })
      }
    } else if (type === 'resize' && handle) {
      setIsResizing(true)
      setResizeHandle(handle)
    }
  }

  const handleWindowClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        
        // Get the container's position to convert absolute to relative coordinates
        const windowContainerElement = document.querySelector('.window-container')
        const containerRect = windowContainerElement ? windowContainerElement.getBoundingClientRect() : null
        
        if (containerRect) {
          // Convert absolute coordinates to relative coordinates within the container
          const relativeX = newX - containerRect.left
          const relativeY = newY - containerRect.top
          
          const constrained = constrainPosition(relativeX, relativeY, position.width, position.height)
          
          onPositionChange({
            ...position,
            x: constrained.x,
            y: constrained.y,
            width: constrained.width,
            height: constrained.height
          })
        }
      } else if (isResizing && resizeHandle) {
        const rect = windowRef.current?.getBoundingClientRect()
        if (!rect) return

        const { screenHeight, screenWidth } = getScreenBounds()
        let newWidth = position.width
        let newHeight = position.height
        let newX = position.x
        let newY = position.y

        switch (resizeHandle) {
          case 'se':
            // Bottom-right: expand width and height, but don't go beyond screen
            newWidth = Math.max(200, Math.min(screenWidth - newX, e.clientX - rect.left))
            newHeight = Math.max(150, Math.min(screenHeight - newY, e.clientY - rect.top))
            break
          case 'sw':
            // Bottom-left: expand width leftward and height downward
            newWidth = Math.max(200, Math.min(newX + newWidth, rect.right - e.clientX))
            newHeight = Math.max(150, Math.min(screenHeight - newY, e.clientY - rect.top))
            newX = Math.max(0, Math.min(newX + newWidth - 200, e.clientX))
            break
          case 'ne':
            // Top-right: expand width rightward and height upward
            newWidth = Math.max(200, Math.min(screenWidth - newX, e.clientX - rect.left))
            newHeight = Math.max(150, Math.min(newY + newHeight, rect.bottom - e.clientY))
            newY = Math.max(0, Math.min(newY + newHeight - 150, e.clientY))
            break
          case 'nw':
            // Top-left: expand width leftward and height upward
            newWidth = Math.max(200, Math.min(newX + newWidth, rect.right - e.clientX))
            newHeight = Math.max(150, Math.min(newY + newHeight, rect.bottom - e.clientY))
            newX = Math.max(0, Math.min(newX + newWidth - 200, e.clientX))
            newY = Math.max(0, Math.min(newY + newHeight - 150, e.clientY))
            break
        }

        // Get the container's position to convert absolute to relative coordinates
        const windowContainerElement = document.querySelector('.window-container')
        const containerRect = windowContainerElement ? windowContainerElement.getBoundingClientRect() : null
        
        if (containerRect) {
          // Convert absolute coordinates to relative coordinates within the container
          const relativeX = newX - containerRect.left
          const relativeY = newY - containerRect.top
          
          // Apply constraints to ensure window stays within container bounds
          const constrained = constrainPosition(relativeX, relativeY, newWidth, newHeight)
          onPositionChange({ 
            x: constrained.x, 
            y: constrained.y, 
            width: constrained.width, 
            height: constrained.height 
          })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, resizeHandle, dragOffset, position, onPositionChange])

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
        zIndex: isDragging || isResizing ? 1000 : zIndex
      }}
      onClick={handleWindowClick}
    >
      <div 
        className="window-titlebar"
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      >
        <div className="window-title">
          <div className="led green" />
          <span>{title}</span>
        </div>
        <button className="window-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="window-content">
        {children}
      </div>
      <div 
        className="resize-handle se"
        onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
      />
      <div 
        className="resize-handle sw"
        onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
      />
      <div 
        className="resize-handle ne"
        onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
      />
      <div 
        className="resize-handle nw"
        onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
      />
    </div>
  )
}
