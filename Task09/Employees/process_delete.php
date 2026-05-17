<?php
    include 'db_connection.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['id']) && is_numeric($_POST['id'])) {
            $id = intval($_POST['id']);

            try {
                $query = "DELETE FROM Employee WHERE Id = :id";
                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);

                if ($stmt->execute()) {
                    header('Location: list.php');
                    exit;
                } else {
                    header('Location: delete.php?id=' . $id);
                    exit;
                }
            } catch (PDOException $e) {
                die("Error: " . $e->getMessage());
            }
        } else {
            header('Location: list.php');
            exit;
        }
    } else {
        header('Location: list.php');
        exit;
    }
?>