<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Employee List</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
  <div class="container my-5">
    <h2 class="mb-4">Employee List</h2>

    <div class="d-flex justify-content-end mb-3">
        <a href="registration.php" class="btn btn-success">
          <i class="bi bi-plus-circle me-1"></i> Add New Employee
        </a>
    </div>

    <div class="card shadow">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover table-bordered align-middle">
              <thead class="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Emp #</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Hire Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                  <?php
                    include 'db_connection.php';

                    try {
                        $query = "
                            SELECT 
                                e.Id, e.Number, e.FirstName, e.LastName, 
                                d.Name AS Department, e.Position, e.Salary, e.HireDate
                            FROM Employee e
                            INNER JOIN Department d ON e.DepartmentId = d.Id
                        ";
                        $stmt = $pdo->query($query);

                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                            echo "<tr>";
                            echo "<td>{$row['Id']}</td>";
                            echo "<td>{$row['Number']}</td>";
                            echo "<td>{$row['FirstName']}</td>";
                            echo "<td>{$row['LastName']}</td>";
                            echo "<td>{$row['Department']}</td>";
                            echo "<td>{$row['Position']}</td>";
                            echo "<td>$" . number_format($row['Salary'], 2) . "</td>";
                            echo "<td>{$row['HireDate']}</td>";
                            echo "<td>
                                    <a href='view.php?id={$row['Id']}' class='text-primary me-2' title='View'><i class='bi bi-eye-fill'></i></a>
                                    <a href='registration.php?id={$row['Id']}' class='text-warning me-2' title='Edit'><i class='bi bi-pencil-fill'></i></a>
                                    <a href='delete.php?id={$row['Id']}' class='text-danger' title='Delete'><i class='bi bi-trash-fill'></i></a>
                                  </td>";
                            echo "</tr>";
                        }
                    } catch (PDOException $e) {
                        echo "<tr><td colspan='9' class='text-danger'>Error fetching data: " . $e->getMessage() . "</td></tr>";
                    }
                  ?>
              </tbody>
            </table>
          </div>
        </div>
    </div>
      
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous":></script>
</body>
</html>

