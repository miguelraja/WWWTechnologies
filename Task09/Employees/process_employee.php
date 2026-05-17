<?php
    include 'db_connection.php';


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = isset($_POST['id']) ? intval($_POST['id']) : null;
        $number = $_POST['empNumber'];
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $departmentId = intval($_POST['departmentId']);
        $position = $_POST['position'];
        $salary = floatval($_POST['salary']);
        $hireDate = $_POST['hireDate'];

        try {
            if ($id) {
                $query = "
                    UPDATE Employee
                    SET Number = :number, FirstName = :firstName, LastName = :lastName,
                        DepartmentId = :departmentId, Position = :position, Salary = :salary, HireDate = :hireDate
                    WHERE Id = :id
                ";
                $stmt = $pdo->prepare($query);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            } else {
                $query = "
                    INSERT INTO Employee (Number, FirstName, LastName, DepartmentId, Position, Salary, HireDate)
                    VALUES (:number, :firstName, :lastName, :departmentId, :position, :salary, :hireDate)
                ";
                $stmt = $pdo->prepare($query);
            }

            $stmt->bindParam(':number', $number, PDO::PARAM_STR);
            $stmt->bindParam(':firstName', $firstName, PDO::PARAM_STR);
            $stmt->bindParam(':lastName', $lastName, PDO::PARAM_STR);
            $stmt->bindParam(':departmentId', $departmentId, PDO::PARAM_INT);
            $stmt->bindParam(':position', $position, PDO::PARAM_STR);
            $stmt->bindParam(':salary', $salary, PDO::PARAM_STR);
            $stmt->bindParam(':hireDate', $hireDate, PDO::PARAM_STR);

            $stmt->execute();

            header('Location: list.php');
            exit;
        } catch (PDOException $e) {
            die("Error: " . $e->getMessage());
        }
    } else {
        header('Location: registration.php');
        exit;
    }
?>