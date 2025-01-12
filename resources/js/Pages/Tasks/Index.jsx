import GetStatusBadge from '@/Components/GetStatusBadge';
import Header from '@/Components/Header';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { PiArrowsDownUp, PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';

export default function Index({ page_settings, tasks }) {
    return (
        <>
            <Header title={page_settings.title} subtitle={page_settings.subtitle} />
            <Card>
                <CardContent>
                    <div className="my-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block w-full py-2 align-middle sm:px-2">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th
                                                className="px-2 py-3.5 text-left text-sm font-semibold text-foreground"
                                                scope="col"
                                            >
                                                <Button variant="ghost" className="group inline-flex">
                                                    Title
                                                    <span className="ml-2 flex-none rounded text-foreground">
                                                        <PiArrowsDownUp className="h-5 w-5" />
                                                    </span>
                                                </Button>
                                            </th>
                                            <th
                                                className="px-2 py-3.5 text-left text-sm font-semibold text-foreground"
                                                scope="col"
                                            >
                                                <Button variant="ghost" className="group inline-flex">
                                                    Status
                                                    <span className="ml-2 flex-none rounded text-foreground">
                                                        <PiArrowsDownUp className="h-5 w-5" />
                                                    </span>
                                                </Button>
                                            </th>
                                            <th
                                                className="px-2 py-3.5 text-left text-sm font-semibold text-foreground"
                                                scope="col"
                                            >
                                                <Button variant="ghost" className="group inline-flex">
                                                    Created At
                                                    <span className="ml-2 flex-none rounded text-foreground">
                                                        <PiArrowsDownUp className="h-5 w-5" />
                                                    </span>
                                                </Button>
                                            </th>
                                            <th
                                                className="px-2 py-3.5 text-left text-sm font-semibold text-foreground"
                                                scope="col"
                                            >
                                                <span className="sr-only">Action</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task, index) => (
                                            <tr key={index}>
                                                <td className="text-small whitespace-nowrap px-6 py-8 font-medium text-foreground">
                                                    {task.memberable.title}
                                                </td>
                                                <td className="text-small whitespace-nowrap px-6 py-8 font-medium text-foreground">
                                                    <GetStatusBadge status={task.memberable.status} />
                                                </td>
                                                <td className="text-small whitespace-nowrap px-6 py-8 font-medium text-foreground">
                                                    {task.memberable.created_at}
                                                </td>
                                                <td className="text-small relative space-x-4 whitespace-nowrap px-6 py-8 text-right">
                                                    <div className="flex justify-end">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <PiDotsThreeOutlineVerticalFill className="size-4" />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={task.memberable.detail}>Detail</Link>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

Index.layout = (pages) => <AppLayout children={pages} title={pages.props.page_settings.title} />;
