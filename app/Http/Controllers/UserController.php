<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\HasFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use HasFile;

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

    public function create(): Response
    {
        return Inertia('Users/Create', [
            'page_settings' => [
                'title' => 'Create Person',
                'subtitle' => "Fill out this form to add a new person",
                'method' => 'POST',
                'action' => route('users.store')
            ]
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        User::create([
           'name' => $request->name,
           'username' => $request->username,
           'email' => $request->email,
           'password' => Hash::make($request->password),
           'avatar' => $this->upload_file($request, 'avatar', 'users') 
        ]);

        flashMessage('User information saved successfully');

        return to_route('users.index');
    }

    public function edit(User $user): Response
    {
        return Inertia('Users/Edit', [
            'user' => $user,
            'page_settings' => [
                'title' => 'Edit Person',
                'subtitle' => "Fill out this form to edit a new person",
                'method' => 'PUT',
                'action' => route('users.update', $user)
            ]
        ]);
    }

    public function update(User $user, UserRequest $request): RedirectResponse
    {
        $user->update([
           'name' => $request->name,
           'username' => $request->username,
           'email' => $request->email,
           'password' => $request->password ? Hash::make($request->password) : $user->password,
           'avatar' => $request->hasFile('avatar') ? $this->upload_file($request, 'avatar', 'users') : $user->avatar 
        ]);

        flashMessage('Successfully updated user information');

        return to_route('users.index');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->delete_file($user, 'avatar');
        $user->delete();

        flashMessage('The user has been successfully deleted');

        return to_route('users.index');
    }
}
