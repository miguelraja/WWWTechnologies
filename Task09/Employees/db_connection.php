<?php
    $host = 'localhost';
    $dbName = 'companyDB';
    $username = 'app_user';
    $password = '12345';
    $port = '3307';

    try {
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4", $username, $password);

        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //echo "Connected successfully to the database.";
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
?>