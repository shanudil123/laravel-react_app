<?php

namespace App\Http\Controllers;

use Kreait\Firebase\Factory;

class FirebaseController extends Controller
{
    public function fetchDataFromFirebase()
    {
        // Initialize Firebase with the service account credentials
        $firebase = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));

        // Access Firebase services, e.g., Realtime Database
        $database = $firebase->createDatabase();

        // Example: Retrieve data from Firebase
        $reference = $database->getReference('path/to/data');
        $snapshot = $reference->getSnapshot();

        return $snapshot->getValue();
    }
}
