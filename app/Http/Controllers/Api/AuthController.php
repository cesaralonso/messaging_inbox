<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\AuthUserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $user = Auth::guard('api')->user();

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new AuthUserResource($user),
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'data' => new AuthUserResource(Auth::guard('api')->user()),
        ]);
    }

    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}