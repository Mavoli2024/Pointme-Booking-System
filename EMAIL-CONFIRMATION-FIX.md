# Email Confirmation Fix Guide

## 🚨 Issue: "Email not confirmed" Error

The error you're seeing occurs because Supabase requires email confirmation by default, but the test users haven't confirmed their email addresses.

## 🔧 Solutions

### Option 1: Disable Email Confirmation (Recommended for Development)

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication > Settings**
3. **Find "Email Confirmation" section**
4. **Disable "Enable email confirmations"**
5. **Save the changes**

This will allow users to sign in without email confirmation.

### Option 2: Use the Resend Confirmation Button

I've added a "Resend Confirmation Email" button to the sign-in page that will:
- Show when email confirmation is required
- Allow users to resend the confirmation email
- Provide clear instructions

### Option 3: Create Test Users with Confirmed Emails

Use the `create-test-user.js` script I created to create test users with pre-confirmed emails:

```bash
node create-test-user.js
```

This will create:
- `test@business.com` / `test123` (Business user)
- `test@customer.com` / `test123` (Customer user)

## 🧪 Testing the Business Dashboard

Once you've fixed the email confirmation issue, you can test the business functionality:

### Test Credentials (if using seed data):
- **Email**: `sarah@cleanpro.co.za`
- **Password**: `test123` (or whatever password you set)
- **Role**: Business Owner

### Test Steps:
1. Go to `http://localhost:3007/auth/sign-in`
2. Enter the business user credentials
3. You should be redirected to `/business/dashboard`
4. Verify all dashboard features work correctly

## 🔍 Troubleshooting

### If you still get "Email not confirmed":
1. Check your Supabase dashboard settings
2. Make sure email confirmation is disabled
3. Try creating a new user with the test script
4. Check your email spam folder for confirmation emails

### If you get "Invalid login credentials":
1. Verify the email and password are correct
2. Check that the user exists in your Supabase database
3. Make sure the user has the correct role

### If the business dashboard doesn't load:
1. Check the browser console for errors
2. Verify the user has a business record in the database
3. Make sure the business status is "approved"

## 📧 Email Configuration (Optional)

If you want to keep email confirmation enabled, you'll need to configure SMTP:

1. **Go to Supabase Dashboard > Authentication > Settings**
2. **Find "SMTP Settings"**
3. **Configure with your email provider:**
   - **Gmail**: `smtp.gmail.com`, port 587
   - **Outlook**: `smtp-mail.outlook.com`, port 587
   - **Custom SMTP**: Use your provider's settings

## ✅ Quick Fix for Development

The fastest solution for development is to **disable email confirmation** in your Supabase dashboard. This will allow immediate testing without email setup.

---

*After fixing the email confirmation issue, the business dashboard should work perfectly with all the features we've implemented!*

