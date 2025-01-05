<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Card $card, Request $request): RedirectResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255']
        ]);

        $request->user()->tasks()->create([
            'card_id' => $card->id,
            'title' => $request->title
        ]);

        flashMessage('Task was saved successfully');
        return back();
    }

    public function destroy(Card $card, Task $task): RedirectResponse
    {
        $task->delete();
        flashMessage('The task was successfully deleted.');

        return back();
    }
}
