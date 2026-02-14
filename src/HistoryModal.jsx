import React, { useEffect, useRef, useState } from "react";
import { X, Trash2 } from "lucide-react";

const CLOSE_DISTANCE = 120; // how much drag required to close

const HistoryModal = ({
    show,
    onClose,
    history,
    onClearHistory,
    onUseExpression,
    onUseResult,
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    // ✅ drag states
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const startYRef = useRef(null);

    // Mount/unmount logic for animation
    useEffect(() => {
        if (show) {
            setShouldRender(true);
            setIsClosing(false);
            setDragY(0);
        } else if (shouldRender) {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
                setDragY(0);
            }, 220);

            return () => clearTimeout(timer);
        }
    }, [show]);

    const closeWithAnimation = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShouldRender(false);
            setIsClosing(false);
            setDragY(0);
            onClose();
        }, 220);
    };

    if (!shouldRender) return null;

    /* ===========================
       ✅ Swipe Down Handlers
       =========================== */

    const startDrag = (clientY) => {
        setIsDragging(true);
        startYRef.current = clientY;
    };

    const moveDrag = (clientY) => {
        if (!isDragging || startYRef.current === null) return;

        const delta = clientY - startYRef.current;

        // only allow drag down
        if (delta > 0) setDragY(delta);
    };

    const endDrag = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // close if pulled down enough
        if (dragY > CLOSE_DISTANCE) {
            closeWithAnimation();
        } else {
            // snap back
            setDragY(0);
        }
    };

    // Touch events
    const onTouchStart = (e) => startDrag(e.touches[0].clientY);
    const onTouchMove = (e) => moveDrag(e.touches[0].clientY);
    const onTouchEnd = () => endDrag();

    // Mouse events (optional but helpful)
    const onMouseDown = (e) => startDrag(e.clientY);
    const onMouseMove = (e) => moveDrag(e.clientY);
    const onMouseUp = () => endDrag();

    return (
        <div
            className={`history-overlay ${isClosing ? "closing" : ""}`}
            onClick={closeWithAnimation}
        >
            <div
                className={`history-modal ${isClosing ? "closing" : ""} ${isDragging ? "dragging" : ""
                    }`}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                style={{
                    transform: `translateY(${dragY}px)`,
                }}
            >
                {/* ✅ drag handle bar */}
                <div className="drag-handle" />

                <div className="history-header">
                    <h3>History</h3>

                    <div className="history-actions">
                        <button
                            className="clear-history"
                            onClick={onClearHistory}
                            title="Clear history"
                        >
                            <Trash2 size={18} />
                        </button>

                        <button
                            className="close-history"
                            onClick={closeWithAnimation}
                            title="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="history-list">
                    {history.length === 0 ? (
                        <div className="no-history">No calculations yet</div>
                    ) : (
                        history.map((item) => (
                            <div className="history-item" key={item.time}>
                                <div
                                    className="history-exp"
                                    onClick={() => onUseExpression(item.expression)}
                                    title="Use expression"
                                >
                                    {item.expression}
                                </div>

                                <div
                                    className="history-res"
                                    onClick={() => onUseResult(item.result)}
                                    title="Use result"
                                >
                                    = {item.result}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
