<?php

namespace App\Http\Controllers;

use App\Http\Resources\MyTaskResource;
use App\Models\Card;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Response;

class MyTaskController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $tasks = Member::query()->where('members.user_id', $request->user()->id)
            ->whereHasMorph('memberable', Card::class)
            ->when(request()->search, function ($query, $value) {
                return $query->whereHasMorph('memberable', Card::class, function ($subquery) use ($value) {
                    $subquery->where('title', 'REGEXP', $value);
                });
            })->when(request()->field && request()->direction, function ($query) {
                return $query->join('cards', 'members.memberable_id', '=', 'cards.id')
                    ->orderBy('cards.title', request()->direction);
            })->paginate(request()->load ?? 10);

        return Inertia('Tasks/Index', [
            'tasks' => fn() => MyTaskResource::collection($tasks)->additional([
                'meta' => [
                    'has_pages' => $tasks->hasPages()
                ]
            ]),
            'page_settings' => [
                'title' => "Tasks",
                'subtitle' => "A list of all the task in your platform"
            ],
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10
            ]
        ]);
    }
}
