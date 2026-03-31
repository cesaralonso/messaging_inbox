<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@messaging-inbox.com'],
            [
                'name' => 'Admin ',
                'password' => '123456',
            ]
        );

        User::updateOrCreate(
            ['email' => 'ana@example.com'],
            [
                'name' => 'Ana Pérez',
                'password' => '123456',
            ]
        );

        User::updateOrCreate(
            ['email' => 'soporte@example.com'],
            [
                'name' => 'Soporte Interno',
                'password' => '123456',
            ]
        );
    }
}