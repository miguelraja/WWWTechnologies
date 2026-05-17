<?php
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        $id = intval($_GET['id']);

        try {
            $query = "
                SELECT 
                    e.Id, e.Number, e.FirstName, e.LastName, 
                    e.DepartmentId, e.Position, e.Salary, e.HireDate
                FROM Employee e
                WHERE e.Id = :id
            ";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $employee = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($employee) {
                $number = $employee['Number'];
                $firstName = $employee['FirstName'];
                $lastName = $employee['LastName'];
                $departmentId = $employee['DepartmentId'];
                $position = $employee['Position'];
                $salary = $employee['Salary'];
                $hireDate = $employee['HireDate'];
            }
        } catch (PDOException $e) {
            echo "<div class='alert alert-danger'>Error fetching employee data: " . $e->getMessage() . "</div>";
        }
    }
?>