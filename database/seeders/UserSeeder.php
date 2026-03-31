<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => 'password123',
            ]
        );

        User::updateOrCreate(
            ['email' => 'ana@example.com'],
            [
                'name' => 'Ana Pérez',
                'password' => 'password123',
            ]
        );

        User::updateOrCreate(
            ['email' => 'soporte@example.com'],
            [
                'name' => 'Soporte Interno',
                'password' => 'password123',
            ]
        );
    }
}