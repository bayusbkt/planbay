import { CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import CardList from './Partials/CardList';
import StatusList from './Partials/StatusList';

export default function Show({ workspace, statuses, cards }) {
    const [statusesState, setStatusesState] = useState(statuses);
    const [cardsState, setCardState] = useState(cards);
    const [activeStatus, setActiveStatus] = useState(null);
    const [activeCard, setActiveCard] = useState(null);

    const statusesId = useMemo(() => statusesState.map((status) => status.value), [statusesState]);

    const handleDeleteCard = (id) => {
        router.delete(
            route('cards.destroy', {
                workspace: workspace,
                card: id,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (success) => {
                    const flash = flashMessage(success);
                    if (flash) {
                        toast[flash.type](flash.message);
                    }
                },
            },
        );

        const newCards = cards.filter((card) => card.id !== id);
        setCardState(newCards);
    };

    const handleDataCard = (current) => {
        return {
            type: current.type,
            data: current.type === 'Card' ? current.card.id : current.status.value,
        };
    };

    const handleReorderCard = (active, over) => {
        router.post(
            route('cards.reorder', {
                workspace: workspace,
                card: active.data.current.card.id,
            }),
            {
                cardActive: handleDataCard(active.data.current),
                cardOver: handleDataCard(over.data.current),
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (success) => {
                    const flash = flashMessage(success);
                    if (flash) {
                        toast[flash.type](flash.message);
                    }
                },
            },
        );
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
    );

    const onDragStart = (event) => {
        if (event.active.data.current?.type === 'Card') {
            setActiveCard(event.active.data.current.card);
            return;
        }
    };

    const onDragEnd = (event) => {
        setActiveStatus(null);
        setActiveCard(null);

        const { active, over } = event;
        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            return;
        }

        const isActiveAStatus = active.data.current?.type === 'Status';

        if (!isActiveAStatus) {
            return;
        }

        setStatusesState((statuses) => {
            const activeStatusIndex = statuses.findIndex((status) => status.value === activeId);
            const overStatusIndex = statuses.findIndex((status) => status.value === overId);
            return arrayMove(statuses, activeStatusIndex, overStatusIndex);
        });
    };

    const onDragOver = (event) => {
        const { active, over } = event;
        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            return;
        }

        const isActiveACard = active.data.current?.type === 'Card';
        const isOverACard = over.data.current?.type === 'Card';

        if (!isActiveACard) {
            return;
        }

        if (isActiveACard && isOverACard) {
            setCardState((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeId);
                const overIndex = cards.findIndex((card) => card.id === overId);

                if (cards[activeIndex].status !== cards[overIndex].status) {
                    cards[activeIndex].status = cards[overIndex].status;
                    return arrayMove(cards, activeIndex, overIndex - 1);
                }

                return arrayMove(cards, activeIndex, overIndex);
            });
        }

        const isOverAStatus = over.data.current?.type === 'Status';
        if (isActiveACard && isOverAStatus) {
            setCardState((cards) => {
                const activeIndex = cards.findIndex((card) => card.id === activeId);
                cards[activeIndex].status = overId;
                return arrayMove(cards, activeIndex, activeIndex);
            });
        }

        handleReorderCard(active, over);
    };

    return (
        <>
            <div>
                <img className="h-32 w-full object-cover lg:h-48" src={workspace.cover} alt={workspace.name} />
            </div>
            <div className="px-2 sm:px-4">
                <div className="-mt-12 sm:flex sm:items-center sm:space-x-5">
                    <div className="flex">
                        <img
                            className="h-24 w-24 rounded-full object-cover ring-4 ring-white sm:h-32 sm:w-32"
                            src={workspace.logo}
                            alt={workspace.name}
                        />
                    </div>
                    <div className="items-center sm:flex sm:min-w-0 sm:flex-1 sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="mt-6 min-w-0 flex-1">
                            <CardTitle className="text-4xl leading-relaxed tracking-tighter">
                                {workspace.name}
                            </CardTitle>
                        </div>
                        <div className="mt-8 flex items-center gap-x-8">
                            <Link
                                href={route('cards.create', [workspace])}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors hover:font-bold hover:text-red-500 hover:no-underline hover:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Create Card
                            </Link>
                            {workspace.can.edit_workspace && (
                                <Link
                                    href={route('workspaces.edit', [workspace])}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors hover:font-bold hover:text-red-500 hover:no-underline hover:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Settings
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                {/* Card */}
                <div className="mt-8 flex w-full flex-col justify-start gap-x-5 gap-y-8 sm:flex-row">
                    <DndContext
                        sensors={sensors}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                    >
                        <div className="mt-8 flex w-full flex-col justify-start gap-x-5 gap-y-8 sm:flex-row">
                            <SortableContext items={statusesId}>
                                {statuses.map((status) => (
                                    <StatusList
                                        key={status.value}
                                        status={status}
                                        cards={cardsState.filter((card) => card.status === status.value)}
                                        workspace={workspace}
                                        handleDeleteCard={handleDeleteCard}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                        {createPortal(
                            <DragOverlay>
                                {activeStatus && (
                                    <StatusList
                                        status={activeStatus}
                                        cards={cardsState.filter((card) => card.status === activeStatus.value)}
                                        workspace={workspace}
                                        handleDeleteCard={handleDeleteCard}
                                    />
                                )}
                                {activeCard && <CardList card={activeCard} workspace={workspace} />}
                            </DragOverlay>,
                            document.body,
                        )}
                    </DndContext>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <AppLayout children={page} title={page.props.workspace.name} />;
