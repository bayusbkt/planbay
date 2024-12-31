import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { flashMessage } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function UpdateCard({ page_settings, statuses, priorities, card }) {
    const { data, setData, errors, reset, recentlySuccessful, processing, post } = useForm({
        title: card.title ?? '',
        description: card.description ?? '',
        deadline: card.deadline?.unformatted ?? '',
        priority: card.priority,
        status: card.status,
        _method: page_settings.method,
    });

    const onHandleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) {
                    toast[flash.type](flash.message);
                }
            },
        });
    };

    return (
        <Card className="md:col-span-2">
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="py-6">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8">
                            <div className="col-span-full">
                                <InputLabel htmlFor="title" value="Title" />
                                <TextInput
                                    type="text"
                                    name="title"
                                    id="title"
                                    isFocused={true}
                                    onChange={onHandleChange}
                                    value={data.title}
                                    onErrors={errors.title && <InputError message={errors.title} />}
                                />
                            </div>
                            <div className="col-span-full">
                                <InputLabel htmlFor="description" value="Description" />
                                <TextInput
                                    type="text"
                                    name="description"
                                    id="description"
                                    onChange={onHandleChange}
                                    value={data.description}
                                    onErrors={errors.description && <InputError message={errors.description} />}
                                />
                            </div>
                            <div className="col-span-full">
                                <InputLabel htmlFor="deadline" value="Deadline" />
                                <TextInput
                                    type="date"
                                    name="deadline"
                                    id="deadline"
                                    onChange={onHandleChange}
                                    value={data.deadline}
                                    onErrors={errors.deadline && <InputError message={errors.deadline} />}
                                />
                            </div>
                            <div className="col-span-full">
                                <InputLabel htmlFor="priority" value="Priority" />
                                <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {priorities.find((priority) => priority.value == data.priority)?.label ??
                                                'Select a Priority'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map((priority, index) => (
                                            <SelectItem key={index} value={priority.value}>
                                                {priority.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.priority && <InputError message={errors.priority} />}
                            </div>
                            <div className="col-span-full">
                                <InputLabel htmlFor="status" value="Status" />
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {statuses.find((status) => status.value == data.status)?.label ??
                                                'Select a Status'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status, index) => (
                                            <SelectItem key={index} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && <InputError message={errors.status} />}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-2 py-6">
                        <Button type="button" variant="ghost" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button type="submit" variant="red" disabled={processing}>
                            Save
                        </Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}