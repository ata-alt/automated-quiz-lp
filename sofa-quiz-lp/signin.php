<?php
session_start();
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
require_once '../api/config/database.php';
require_once '../api/auth-helper.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Please enter both email and password';
    } else {
        try {
            $database = new Database();
            $db = $database->getConnection();

            if (!$db) {
                $error = 'Database connection failed';
            } else {
                $auth = new AuthHelper($db);
                $user = $auth->authenticate($email, $password);

                if ($user && !isset($user['error'])) {
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_user_id'] = $user['id'];
                    $_SESSION['admin_email'] = $user['email'];
                    $_SESSION['admin_username'] = $user['username'];
                    $_SESSION['admin_full_name'] = $user['full_name'];
                    $_SESSION['user_role'] = $user['role'] ?? 'editor'; // Add role to session
                    $_SESSION['login_time'] = time();

                    header('Location: dashboard.php');
                    exit;
                } elseif (isset($user['error'])) {
                    $error = $user['error'];
                } else {
                    $error = 'Invalid email or password';
                }
            }
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            $error = 'An error occurred. Please try again later.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="popup" content="0">
    <meta name="robots" content="noindex, nofollow">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            background: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-weight: 300;
            letter-spacing: 0.02em;
        }

        .signin-container {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 0;
            padding: 60px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
        }

        h1 {
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 0.1em;
            margin-bottom: 40px;
            text-align: center;
            text-transform: uppercase;
            color: #000000;
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            font-size: 10px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #6b6b6b;
            margin-bottom: 8px;
        }

        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid #e0e0e0;
            border-radius: 0;
            font-size: 14px;
            font-family: inherit;
            font-weight: 300;
            background: white;
            color: #000000;
            transition: all 0.25s ease;
        }

        input[type="email"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #000000;
        }

        .btn {
            width: 100%;
            padding: 16px 32px;
            border: 1px solid #000000;
            border-radius: 0;
            cursor: pointer;
            font-size: 11px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            background: #000000;
            color: #ffffff;
            transition: all 0.25s ease;
            margin-top: 32px;
        }

        .btn:hover {
            background: #1a1a1a;
            border-color: #1a1a1a;
        }

        .btn:active {
            opacity: 0.8;
        }

        .label-required:after {
            content: "*";
            color: #e42118;
            font-size: 22px;
            line-height: 0.4;
            padding: 0 0 0 5px;
            position: relative;
            top: 2px;
        }

        .error-message {
            background: white;
            color: #000000;
            border: 1px solid #000000;
            padding: 12px 20px;
            border-radius: 0;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 24px;
            text-align: center;
        }

        @media (max-width: 480px) {
            .signin-container {
                padding: 40px 30px;
            }

            h1 {
                font-size: 20px;
                margin-bottom: 30px;
            }

            input[type="email"],
            input[type="password"] {
                padding: 12px 14px;
                font-size: 16px;
            }

            .btn {
                padding: 14px 24px;
            }
        }
    </style>
</head>

<body>
    <div class="signin-container">
        <img src="../cdn-cgi/image/quality=75,f=auto/site-assets/img/logos/logo-horizontal-text.png" alt="Logo" style="width: 100%; max-width: 200px; margin: 0 auto 40px auto; display: block;">
        <h1>Welcome</h1>

        <?php if ($error): ?>
            <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label for="email" class="label-required">Email Address</label>
                <input type="email" id="email" name="email" required autofocus>
            </div>

            <div class="form-group">
                <label for="password" class="label-required">Password</label>
                <input type="password" id="password" name="password" required>
            </div>

            <button type="submit" class="btn">Sign In</button>
        </form>

        <p style="margin-top: 24px; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b6b6b;">
            Contact the system admin in case you have forgotten your password.
        </p>
    </div>
</body>

</html>