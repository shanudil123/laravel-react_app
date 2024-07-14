<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Passport\HasApiTokens;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth as FirebaseAuth;
use Exception;

class AuthController extends Controller
{
    protected $firebaseAuth;

    public function __construct()
    {
        $this->firebaseAuth = app('firebase.auth');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|min:10',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
            ]);

            $token = $user->createToken('LaravelAuthApp')->accessToken;

            return response()->json(['token' => $token], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('LaravelAuthApp')->accessToken;

            // Send 2FA code via Firebase
            try {
                $phone = $user->phone;
                $this->firebaseAuth->sendSmsVerification($phone);
                return response()->json(['token' => $token, 'phone' => $phone], 200);
            } catch (Exception $e) {
                return response()->json(['error' => 'Failed to send 2FA code', 'message' => $e->getMessage()], 500);
            }
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function validate2FA(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string',
        ]);

        try {
            $checkCode = $this->firebaseAuth->verifyPhoneNumber($request->phone, $request->code);

            if ($checkCode) {
                return response()->json(['message' => '2FA validated'], 200);
            } else {
                return response()->json(['error' => 'Invalid 2FA code'], 401);
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to validate 2FA', 'message' => $e->getMessage()], 500);
        }
    }
}
