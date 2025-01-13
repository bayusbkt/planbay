<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'username', 'avatar', 'created_at'])
            ->when(request()->search, function ($query, $value) {
                $query->whereAny([
                    'name',
                    'username',
                    'email'
                ], 'REGEXP', $value);
            })
            ->when(request()->field && request()->direction, fn($query) => $query->orderBy(request()->field, request()->direction))
            ->paginate(request()->load ?? 10)
            ->appends(request()->query());

        return Inertia('Users/Index', [
            'users' => fn() => UserResource::collection($users)->additional([
                'meta' => [
                    'has_pages' => $users->hasPages()
                ]
            ]),
            'page_settings' => [
                'title' => 'Peoples',
                'subtitle' => 'A list of all the peoples in your platform'
            ],
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10
            ]
        ]);
    }
}
