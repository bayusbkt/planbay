<?php

namespace App\Http\Controllers;

use App\Enums\CardStatus;
use App\Http\Resources\MyTaskResource;
use App\Models\Card;
use App\Models\Member;
use App\Models\User;
use App\Models\Workspace;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $tasks = Member::query()
            ->where('members.user_id', request()->user()->id)
            ->whereHasMorph('memberable', Card::class, fn($query) => $query->where('status', CardStatus::TODO->value))
            ->latest()
            ->limit(10)
            ->get();

        return Inertia('Dashboard', [
            'page_settings' => [
                'title' => 'Dashboard',
                'subtitle' => 'You can see a summary of the information here'
            ],
            'tasks' => MyTaskResource::collection($tasks),
            'productivity_chart' => $this->productivityChart(),
            'count' => [
                'users' => fn() => User::count(),
                'workspaces' => fn() => Member::query()
                    ->where('members.user_id', request()->user()->id)
                    ->whereHasMorph('memberable', Workspace::class)
                    ->count(),
                'tasks' => fn() => Member::query()
                    ->where('members.user_id', request()->user()->id)
                    ->whereHasMorph('memberable', Card::class)
                    ->count(),
                'dones' => fn() => Member::query()
                    ->where('members.user_id', request()->user()->id)
                    ->whereHasMorph('memberable', Card::class, fn($query) => $query->where('status', CardStatus::DONE->value))
                    ->count(),
            ]
        ]);
    }

    public function productivityChart(): array
    {
        $currentDate = Carbon::now();
        $sixMonthsAgo = $currentDate->copy()->addMonths(-5);

        $labels = [];
        $datasets = [
            [
                'label' => 'To Do',
                'data' => [],
                'backgroundColor' => 'rgba(239, 68, 68, 1)'
            ],
            [
                'label' => 'In Progress',
                'data' => [],
                'backgroundColor' => 'rgba(59, 130, 246, 1)'
            ],
            [
                'label' => 'On Review',
                'data' => [],
                'backgroundColor' => 'rgba(250, 204, 21, 1)'
            ],
            [
                'label' => 'Done',
                'data' => [],
                'backgroundColor' => 'rgba(34, 197, 94, 1)'
            ]
        ];

        for ($i = 0; $i < 6; $i++) {
            $month = $sixMonthsAgo->format('F');
            $labels[] = $month;

            $taskCountToDo = Member::query()
                ->where('members.user_id', request()->user()->id)
                ->whereHasMorph('memberable', Card::class, fn($query) => $query->where('status', CardStatus::TODO->value))
                ->whereMonth('created_at', $sixMonthsAgo->month)
                ->count();

            $taskCountInProgress = Member::query()
                ->where('members.user_id', request()->user()->id)
                ->whereHasMorph('memberable', Card::class, fn($query) => $query->where('status', CardStatus::INPROGRESS->value))
                ->whereMonth('created_at', $sixMonthsAgo->month)
                ->count();

            $taskCountOnReview = Member::query()
                ->where('members.user_id', request()->user()->id)
                ->whereHasMorph('memberable', Card::class, fn($query) => $query->where('status', CardStatus::ONREVIEW->value))
                ->whereMonth('created_at', $sixMonthsAgo->month)
                ->count();

            $taskCountDone = Member::query()
                ->where('members.user_id', request()->user()->id)
                ->whereHasMorph('memberable', Card::class, fn($query) => $query->where('status', CardStatus::DONE->value))
                ->whereMonth('created_at', $sixMonthsAgo->month)
                ->count();

            $datasets[0]['data'][] = $taskCountToDo;
            $datasets[1]['data'][] = $taskCountInProgress;
            $datasets[2]['data'][] = $taskCountOnReview;
            $datasets[3]['data'][] = $taskCountDone;

            $sixMonthsAgo->addMonth();
        }

        return [
            'label' => $labels,
            'datasets' => $datasets
        ];
    }
}
