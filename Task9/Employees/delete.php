<?php
    include 'db_connection.php';

    $id = $firstName = $lastName = $departmentId = $position = '';

    include 'get_employee.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Delete Employee</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
  <div class="container my-5">
    <h2 class="mb-4 text-danger">Confirm Delete</h2>

    <div class="alert alert-warning" role="alert">
      <h4 class="alert-heading">Are you sure?</h4>
      <p>You are about to delete the following employee:</p>
    </div>

    <div class="row mb-4">
      <div class="col-sm-12 col-md-6 col-lg-3"><strong>Name:</strong> <?php echo $firstName . ' ' . $lastName ; ?> </div>
      <div class="col-sm-12 col-md-6 col-lg-3"><strong>Department:</strong> 
      <?php
            try {
                $query = "SELECT Name FROM Department WHERE Id = ?";
                $stmt = $pdo->prepare($query);
                $stmt->execute([$departmentId]);
                $department = $stmt->fetch(PDO::FETCH_ASSOC);
                echo $department['Name'];
            } catch (PDOException $e) {
                echo "Error loading department";
            }
      ?>
      </div>      <div class="col-sm-12 col-md-6 col-lg-3"><strong>Position:</strong> <?php echo $position; ?></div>
    </div>

    <div class="d-flex justify-content-between">
      <a href="list.php" class="btn btn-secondary">
        <i class="bi bi-arrow-left"></i> Back to List
      </a>
      <form action="process_delete.php" method="POST" class="d-inline">
        <input type="hidden" name="id" value="<?php echo $id; ?>">
        <button type="submit" class="btn btn-danger">
          <i class="bi bi-trash-fill"></i> Confirm Delete
        </button>
      </form>
    </div>
  </div>
</body>
</html>
