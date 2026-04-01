<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('inbox');
});

Route::get('/api-login', function () {
    return Inertia::render('api-login');
})->name('api-login');

Route::get('/inbox', function () {
    return Inertia::render('inbox');
})->name('inbox');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth'])->name('dashboard');