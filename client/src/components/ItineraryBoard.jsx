import {
    DndContext,
    useDroppable,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import "./ItineraryBoard.css";


function handleAddStop(e) {
    e.preventDefault();

    if (!newStop.name.trim()) return;

    const stop = {
        ...newStop,
        id: crypto.randomUUID(),
        estimated_cost: Number(newStop.estimated_cost)
    };

    setItinerary(previous => ({
        ...previous,

        days: previous.days.map(day =>
            day.day === addingToDay
                ? {
                    ...day,
                    stops: [...day.stops, stop]
                }
                : day
        )
    }));

    setNewStop({
        name: "",
        description: "",
        duration: "1 hour",
        estimated_cost: 0
    });

    setAddingToDay(null);
}
function StopCard({ stop, onEdit, onDelete }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: stop.id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : "auto"
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="stop-card"
        >
            <div className="card-top">

                <button
                    className="drag-handle"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag destination"
                >
                    ⠿
                </button>

                <div className="card-actions">
                    <button onClick={() => onEdit(stop)}>
                        Edit
                    </button>

                    <button onClick={() => onDelete(stop.id)}>
                        Delete
                    </button>
                </div>

            </div>

            <h3>{stop.name}</h3>
            <p>{stop.description}</p>

            <div className="stop-meta">
                <span>◷ {stop.duration}</span>
                <span>₹{stop.estimated_cost}</span>
            </div>
        </div>
    );
}
function DayColumn({ day, onEdit, onDelete, onAdd }) {

    const { setNodeRef, isOver } = useDroppable({
        id: `day-${day.day}`
    });

    return (
        <div
            ref={setNodeRef}
            className={`day-column ${isOver ? "drag-over" : ""}`}
        >
            <div className="day-header">
                <h2>Day {day.day}</h2>
                <span>{day.stops.length} stops</span>
            </div>

            <h4>{day.title}</h4>

            <SortableContext
                items={day.stops.map(stop => stop.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="stops-list">

                    {day.stops.map(stop => (
                        <StopCard
                            key={stop.id}
                            stop={stop}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {<button
                        className="add-stop-button"
                        onClick={() => onAdd(day.day)}
                    >
                        + Add destination
                    </button>}

                    {day.stops.length === 0 && (
                        <p className="empty-day">
                            Drop destinations here
                        </p>
                    )}

                </div>
            </SortableContext>
        </div>
    );
}
export default function ItineraryBoard({
    itinerary,
    setItinerary
}) {

    const [addingToDay, setAddingToDay] = useState(null);

    const [newStop, setNewStop] = useState({
        name: "",
        description: "",
        duration: "1 hour",
        estimated_cost: 0
    });

    const [editingStop, setEditingStop] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5
            }
        })
    );

    function handleDragEnd(event) {

        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const activeId = active.id;
        const overId = over.id;

        setItinerary(previous => {

            const newDays = previous.days.map(day => ({
                ...day,
                stops: [...day.stops]
            }));

            // Find source day
            const sourceDay = newDays.find(day =>
                day.stops.some(stop => stop.id === activeId)
            );

            if (!sourceDay) return previous;

            // Find destination day
            const targetDay = String(overId).startsWith("day-")
                ? newDays.find(
                    day => day.day === Number(
                        String(overId).replace("day-", "")
                    )
                )
                : newDays.find(day =>
                    day.stops.some(stop => stop.id === overId)
                );

            if (!targetDay) return previous;

            // Same-day reordering
            if (sourceDay.day === targetDay.day) {

                const oldIndex = sourceDay.stops.findIndex(
                    stop => stop.id === activeId
                );

                const newIndex = sourceDay.stops.findIndex(
                    stop => stop.id === overId
                );

                if (newIndex === -1) return previous;

                sourceDay.stops = arrayMove(
                    sourceDay.stops,
                    oldIndex,
                    newIndex
                );

            } else {

                // Remove from original day
                const oldIndex = sourceDay.stops.findIndex(
                    stop => stop.id === activeId
                );

                const [movedStop] = sourceDay.stops.splice(
                    oldIndex,
                    1
                );

                // Insert before the selected destination
                const targetIndex = targetDay.stops.findIndex(
                    stop => stop.id === overId
                );

                if (targetIndex === -1) {
                    targetDay.stops.push(movedStop);
                } else {
                    targetDay.stops.splice(
                        targetIndex,
                        0,
                        movedStop
                    );
                }
            }

            return {
                ...previous,
                days: newDays
            };
        });
    }

    function handleDelete(stopId) {

        setItinerary(previous => ({
            ...previous,

            days: previous.days.map(day => ({
                ...day,
                stops: day.stops.filter(
                    stop => stop.id !== stopId
                )
            }))
        }));
    }

    function handleEdit(updatedStop) {

        setItinerary(previous => ({
            ...previous,

            days: previous.days.map(day => ({
                ...day,

                stops: day.stops.map(stop =>
                    stop.id === updatedStop.id
                        ? updatedStop
                        : stop
                )
            }))
        }));

        setEditingStop(null);
    }

    return (
        <div className="board-wrapper">

            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
            >
                <div className="itinerary-board">

                    {itinerary.days.map(day => (
                        <DayColumn
                            key={day.day}
                            day={day}
                            onEdit={setEditingStop}
                            onDelete={handleDelete}
                            onAdd={setAddingToDay}
                        />
                    ))}

                </div>
            </DndContext>

            {editingStop && (
                <EditStopModal
                    stop={editingStop}
                    onSave={handleEdit}
                    onClose={() => setEditingStop(null)}
                />
            )}



            {addingToDay !== null && (
                <div className="modal-backdrop">
                    <form
                        className="edit-modal"
                        onSubmit={handleAddStop}
                    >
                        <h2>Add destination</h2>

                        <label>Destination name</label>
                        <input
                            placeholder="Destination name"
                            value={newStop.name}
                            onChange={(e) =>
                                setNewStop({
                                    ...newStop,
                                    name: e.target.value,
                                })
                            }
                            required
                        />

                        <label>Description</label>
                        <textarea
                            placeholder="Description"
                            value={newStop.description}
                            onChange={(e) =>
                                setNewStop({
                                    ...newStop,
                                    description: e.target.value,
                                })
                            }
                        />

                        <label>Duration</label>
                        <input
                            placeholder="Duration"
                            value={newStop.duration}
                            onChange={(e) =>
                                setNewStop({
                                    ...newStop,
                                    duration: e.target.value,
                                })
                            }
                            required
                        />

                        <label>Estimated cost (₹)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Estimated cost"
                            value={newStop.estimated_cost}
                            onChange={(e) =>
                                setNewStop({
                                    ...newStop,
                                    estimated_cost: e.target.value,
                                })
                            }
                            required
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setAddingToDay(null)}
                            >
                                Cancel
                            </button>

                            <button type="submit">
                                Add destination
                            </button>
                        </div>
                    </form>
                </div>
            )}




        </div>
    );
}


function EditStopModal({ stop, onSave, onClose }) {

    const [form, setForm] = useState({ ...stop });

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
    }

    return (
        <div className="modal-backdrop">
            <form className="edit-modal" onSubmit={handleSubmit}>

                <h2>Edit destination</h2>

                <label>Destination name</label>
                <input
                    value={form.name}
                    onChange={e => setForm({
                        ...form,
                        name: e.target.value
                    })}
                    required
                />

                <label>Description</label>
                <textarea
                    value={form.description}
                    onChange={e => setForm({
                        ...form,
                        description: e.target.value
                    })}
                    required
                />

                <label>Duration</label>
                <input
                    value={form.duration}
                    onChange={e => setForm({
                        ...form,
                        duration: e.target.value
                    })}
                    required
                />

                <label>Estimated cost (₹)</label>
                <input
                    type="number"
                    min="0"
                    value={form.estimated_cost}
                    onChange={e => setForm({
                        ...form,
                        estimated_cost: Number(e.target.value)
                    })}
                    required
                />

                <div className="modal-actions">
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>

                    <button type="submit">
                        Save changes
                    </button>
                </div>

            </form>
        </div>
    );
}