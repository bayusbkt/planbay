<?php

use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MemberCardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('auth');

Route::controller(WorkspaceController::class)->group(function () {
    Route::get('/workspaces/create', 'create')->name('workspaces.create');
    Route::post('/workspaces/create', 'store')->name('workspaces.store');
    Route::get('/workspaces/p/{workspace:slug}', 'show')->name('workspaces.show');
    Route::get('/workspaces/edit/{workspace:slug}', 'edit')->name('workspaces.edit');
    Route::put('/workspaces/edit/{workspace:slug}', 'update')->name('workspaces.update');
    Route::delete('/workspaces/destroy/{workspace:slug}', 'destroy')->name('workspaces.destroy');

    Route::post('/workspaces/member/{workspace:slug}/store', 'member_store')->name('workspaces.member_store');
    Route::delete('/workspaces/member/{workspace}/destroy/{member}', 'member_destroy')->name('workspaces.member_destroy');
});

Route::controller(CardController::class)->group(function () {
    Route::get('/cards/{workspace:slug}/create', 'create')->name('cards.create');
    Route::post('/cards/{workspace:slug}/create', 'store')->name('cards.store');
    Route::get('/cards/{workspace:slug}/detail/{card}', 'show')->name('cards.show');
    Route::get('/cards/{workspace:slug}/edit/{card}', 'edit')->name('cards.edit');
    Route::put('/cards/{workspace:slug}/edit/{card}', 'update')->name('cards.update');
    Route::post('/cards/{workspace:slug}/{card}/reoder', 'reorder')->name('cards.reorder');
    Route::delete('/cards/{workspace:slug}/destroy/{card}', 'destroy')->name('cards.destroy');
})->middleware('auth');

Route::controller(MemberCardController::class)->group(function () {
    Route::post('/cards/member/{card}/store', 'store')->name('member_card.store');
    Route::delete('/cards/member/{card}/destroy/{member}', 'destroy')->name('member_card.destroy');
})->middleware('auth');

Route::controller(AttachmentController::class)->group(function () {
    Route::post('/cards/attachment/{card}/store', 'store')->name('attachments.store');
    Route::delete('/cards/attachment/{card}/destroy/{attachment}', 'destroy')->name('attachments.destroy');
})->middleware('auth');

Route::controller(TaskController::class)->group(function () {
    Route::post('/cards/task/{card}/store', 'store')->name('tasks.store');
    Route::delete('/cards/task/{card}/destroy/{task}', 'destroy')->name('tasks.destroy');

    Route::post('/cards/task/{card}/{task}/item', 'item')->name('tasks.item');
})->middleware('auth');

require __DIR__ . '/auth.php';
