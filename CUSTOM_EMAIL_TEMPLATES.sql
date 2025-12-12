-- CUSTOM EMAIL TEMPLATES FOR TRACKER HUB
-- Run these in your Supabase SQL Editor to create beautiful email templates

-- =====================================================
-- CONFIRMATION EMAIL TEMPLATE
-- =====================================================

-- This creates a custom email template for user confirmation
-- You'll need to configure this in Supabase Dashboard → Authentication → Email Templates

/*
CONFIRMATION EMAIL TEMPLATE (HTML):
Copy this HTML and paste it in Supabase Dashboard → Authentication → Email Templates → Confirm signup

Subject: Welcome to Tracker Hub! Please confirm your email 🎉

HTML Body:
*/

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Tracker Hub</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .title {
            color: #1f2937;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin: 0;
        }
        .content {
            margin: 30px 0;
        }
        .welcome-text {
            font-size: 18px;
            color: #374151;
            margin-bottom: 20px;
        }
        .features {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .feature {
            display: flex;
            align-items: center;
            margin: 10px 0;
            font-size: 14px;
            color: #4b5563;
        }
        .feature-icon {
            background: #10b981;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 12px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-1px);
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .security-note {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TH</div>
            <h1 class="title">Welcome to Tracker Hub!</h1>
            <p class="subtitle">Your all-in-one productivity companion</p>
        </div>
        
        <div class="content">
            <p class="welcome-text">
                Hi there! 👋<br>
                Thank you for joining Tracker Hub. We're excited to help you track your habits, manage tasks, monitor finances, and achieve your goals!
            </p>
            
            <div class="features">
                <h3 style="margin-top: 0; color: #374151;">What you can do with Tracker Hub:</h3>
                <div class="feature">
                    <span class="feature-icon">✓</span>
                    <span><strong>Habit Tracking</strong> - Build consistency with daily routines</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">✓</span>
                    <span><strong>Task Management</strong> - Organize your to-dos with priorities</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">✓</span>
                    <span><strong>Finance Tracking</strong> - Budget and monitor your expenses</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">✓</span>
                    <span><strong>Vision Boards</strong> - Visualize and achieve your dreams</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">✓</span>
                    <span><strong>Privacy First</strong> - All data stored securely and privately</span>
                </div>
            </div>
            
            <div style="text-align: center;">
                <p style="font-size: 16px; color: #374151; margin-bottom: 10px;">
                    <strong>Click the button below to confirm your email and get started:</strong>
                </p>
                
                <a href="{{ .ConfirmationURL }}" class="cta-button">
                    Confirm Email & Start Tracking 🚀
                </a>
            </div>
            
            <div class="security-note">
                <strong>🔒 Security Note:</strong> This confirmation link will expire in 24 hours. If you didn't create an account with Tracker Hub, you can safely ignore this email.
            </div>
        </div>
        
        <div class="footer">
            <p>
                <strong>Tracker Hub</strong><br>
                Your personal productivity companion<br>
                <a href="https://your-domain.com" style="color: #10b981;">Visit our website</a>
            </p>
            <p style="font-size: 12px; margin-top: 20px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #6b7280; word-break: break-all;">{{ .ConfirmationURL }}</a>
            </p>
        </div>
    </div>
</body>
</html>

-- =====================================================
-- RECOVERY EMAIL TEMPLATE
-- =====================================================

/*
RECOVERY EMAIL TEMPLATE (HTML):
Copy this HTML and paste it in Supabase Dashboard → Authentication → Email Templates → Reset password

Subject: Reset your Tracker Hub password 🔐

HTML Body:
*/

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Tracker Hub</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .title {
            color: #1f2937;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin: 0;
        }
        .content {
            margin: 30px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .security-note {
            background: #fef2f2;
            border: 1px solid #ef4444;
            border-radius: 6px;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐</div>
            <h1 class="title">Reset Your Password</h1>
            <p class="subtitle">Tracker Hub Password Recovery</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; color: #374151;">
                Hi there!<br><br>
                We received a request to reset your password for your Tracker Hub account. If you made this request, click the button below to create a new password.
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="cta-button">
                    Reset My Password 🔐
                </a>
            </div>
            
            <div class="security-note">
                <strong>🚨 Security Alert:</strong> This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </div>
        </div>
        
        <div class="footer">
            <p>
                <strong>Tracker Hub</strong><br>
                Your personal productivity companion
            </p>
            <p style="font-size: 12px; margin-top: 20px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #6b7280; word-break: break-all;">{{ .ConfirmationURL }}</a>
            </p>
        </div>
    </div>
</body>
</html>

-- =====================================================
-- MAGIC LINK EMAIL TEMPLATE
-- =====================================================

/*
MAGIC LINK EMAIL TEMPLATE (HTML):
Copy this HTML and paste it in Supabase Dashboard → Authentication → Email Templates → Magic Link

Subject: Your secure login link for Tracker Hub ✨

HTML Body:
*/

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login Link - Tracker Hub</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .title {
            color: #1f2937;
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin: 0;
        }
        .content {
            margin: 30px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .security-note {
            background: #f3e8ff;
            border: 1px solid #8b5cf6;
            border-radius: 6px;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
            color: #5b21b6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">✨</div>
            <h1 class="title">Your Login Link</h1>
            <p class="subtitle">Secure access to Tracker Hub</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; color: #374151;">
                Hi there!<br><br>
                Click the button below to securely log in to your Tracker Hub account. No password required!
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="cta-button">
                    Log In to Tracker Hub ✨
                </a>
            </div>
            
            <div class="security-note">
                <strong>🔒 Security Note:</strong> This login link will expire in 1 hour and can only be used once. If you didn't request this login link, please ignore this email.
            </div>
        </div>
        
        <div class="footer">
            <p>
                <strong>Tracker Hub</strong><br>
                Your personal productivity companion
            </p>
            <p style="font-size: 12px; margin-top: 20px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #6b7280; word-break: break-all;">{{ .ConfirmationURL }}</a>
            </p>
        </div>
    </div>
</body>
</html>