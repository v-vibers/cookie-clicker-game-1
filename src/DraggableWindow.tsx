import { useState, useRef, useEffect, ReactNode } from 'react'

interface DraggableWindowProps {
  id: string
  title: string
  children: ReactNode
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  onPositionChange?: (position: { x: number; y: number }) => void
  onSizeChange?: (size: { width: number; height: number }) => void
}

function DraggableWindow({
  id,
  title,
  children,
  defaultPosition = { x: 0, y: 0 },
  defaultSize = { width: 400, height: 600 },
  onPositionChange,
  onSizeChange,
}: DraggableWindowProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  // Load saved position and size from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`window-${id}`)
    if (savedData) {
      const { position: savedPos, size: savedSize } = JSON.parse(savedData)
      setPosition(savedPos)
      setSize(savedSize)
    }
  }, [id])

  // Save position and size to localStorage
  useEffect(() => {
    localStorage.setItem(`window-${id}`, JSON.stringify({ position, size }))
    onPositionChange?.(position)
    onSizeChange?.(size)
  }, [position, size, id, onPositionChange, onSizeChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y

        // Keep window within viewport
        const maxX = window.innerWidth - size.width
        const maxY = window.innerHeight - size.height

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        })
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

        const newWidth = Math.max(280, Math.min(resizeStart.width + deltaX, window.innerWidth - position.x))
        const newHeight = Math.max(400, Math.min(resizeStart.height + deltaY, window.innerHeight - position.y))

        setSize({
          width: newWidth,
          height: newHeight,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, position, size, resizeStart])

  return (
    <div
      ref={windowRef}
      className="draggable-window"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header">
        <h3 className="window-title">{title}</h3>
        <div className="window-drag-hint">✋ Drag to move</div>
      </div>
      <div className="window-content">{children}</div>
      <div className="window-resize-handle" onMouseDown={handleResizeMouseDown}>
        ⇲
      </div>
    </div>
  )
}

export default DraggableWindow