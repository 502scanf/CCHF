import React, { useState, useRef, useEffect } from 'react'
import './RoomActionMenu.css'

const RoomActionMenu = ({ items }) => {
    const [open, setOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleToggle = (e) => {
        e.stopPropagation()
        setOpen(prev => !prev)
    }

    const handleItemClick = (e, item) => {
        e.stopPropagation()
        if (item.disabled) return
        item.onClick?.()
        setOpen(false)
    }

    return (
        <div className="action-menu-wrapper" ref={menuRef}>
            <button className="action-menu-trigger" onClick={handleToggle}>
                ⋯
            </button>
            {open && (
                <div className="action-menu-dropdown">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`action-menu-item ${item.disabled ? 'disabled' : ''}`}
                            onClick={(e) => handleItemClick(e, item)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RoomActionMenu
