<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('home');
});

Route::get('/home', function () {
    return redirect()->route('inbox');
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/api-login', function () {
    return Inertia::render('api-login');
})->name('api-login');

Route::get('/inbox', function () {
    return Inertia::render('inbox');
})->name('inbox');

require __DIR__.'/settings.php';