import { ActionDialog } from '@/Components/ActionDialog';
import GetPriorityBadge from '@/Components/GetPriorityBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@inertiajs/react';
import { PiCheckSquare, PiDotsThreeOutlineFill, PiLinkSimple, PiUser } from 'react-icons/pi';

export default function CardList({ card, workspace, handleDeleteCard }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <Card
                ref={setNodeRef}
                style={style}
                className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border border-dashed border-muted-foreground p-2.5 text-left opacity-30"
            ></Card>
        );
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task hover: relative cursor-grab rounded-xl ring-inset hover:ring-2 hover:ring-red-500"
        >
            <CardHeader>
                <div className="flex items-center justify-between gap-x-4">
                    <CardTitle className="line-clamp-2 text-base leading-relaxed tracking-tighter">
                        <Link href={route('cards.show', [workspace, card])} className="hover:text-red-500">
                            {card.title}
                        </Link>
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <PiDotsThreeOutlineFill className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href={route('cards.edit', [workspace, card])}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuGroup>
                                <ActionDialog
                                    trigger={
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                    }
                                    title="Delete Card"
                                    description="Are you sure want to delete this card?"
                                    action={() => handleDeleteCard(card.id)}
                                />
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <GetPriorityBadge priority={card.priority} />
                </div>
                <CardDescription className="line-clamp-4 leading-relaxed tracking-tighter">
                    {card.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-8">
                    {card.has_task && (
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <p className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    <span className="font-medium text-red-500">{card.percentage}</span> of 100
                                </p>
                                <p className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                    {card.deadline > 0 ? (
                                        <span>{card.deadline} days left</span>
                                    ) : card.deadline == 0 ? (
                                        <span className="text-yellow-500">Today is deadline</span>
                                    ) : (
                                        <span className="text-red-500">Overdue</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-x-2">
                        {card.has_task && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex cursor-pointer items-center gap-x-1">
                                            <PiCheckSquare className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                                {card.tasks_count}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tasks</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {card.members_count > 1 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex cursor-pointer items-center gap-x-1">
                                            <PiUser className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                                {card.members_count}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Members</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {card.has_attachment && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex cursor-pointer items-center gap-x-1">
                                            <PiLinkSimple className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm leading-relaxed tracking-tighter text-muted-foreground">
                                                {card.attachments_count}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Attachments</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
