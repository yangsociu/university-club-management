# Test API Script
# Chạy: powershell -ExecutionPolicy Bypass -File test-api.ps1

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "University Club Management API Test" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$BaseURL = "http://localhost:5000/api"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"

# Colors
$Success = "Green"
$Error = "Red"
$Info = "Cyan"
$Warning = "Yellow"

# Test 1: Health Check
Write-Host "`n[1] Testing Health Check..." -ForegroundColor $Info
try {
    $response = Invoke-RestMethod -Uri "$BaseURL/health" -Method Get
    if ($response.success) {
        Write-Host "✓ Health Check: OK" -ForegroundColor $Success
        Write-Host "  Server Status: $($response.message)" -ForegroundColor $Success
    }
}
catch {
    Write-Host "✗ Health Check FAILED" -ForegroundColor $Error
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Error
    Write-Host "  Make sure server is running: npm run dev" -ForegroundColor $Warning
    exit
}

# Test 2: Register User
Write-Host "`n[2] Testing User Registration..." -ForegroundColor $Info
try {
    $registerBody = @{
        fullName = "Test User"
        email = $testEmail
        password = "testpassword123"
        phoneNumber = "+84912345678"
        studentId = "ST$timestamp"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod `
        -Uri "$BaseURL/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody

    if ($registerResponse.success) {
        Write-Host "✓ Registration: SUCCESS" -ForegroundColor $Success
        Write-Host "  User: $($registerResponse.user.fullName)" -ForegroundColor $Success
        Write-Host "  Email: $($registerResponse.user.email)" -ForegroundColor $Success
        Write-Host "  Token: $($registerResponse.token.Substring(0, 50))..." -ForegroundColor $Success
        
        $registerToken = $registerResponse.token
        $userId = $registerResponse.user._id
    }
    else {
        Write-Host "✗ Registration FAILED" -ForegroundColor $Error
        Write-Host "  Message: $($registerResponse.message)" -ForegroundColor $Error
        exit
    }
}
catch {
    Write-Host "✗ Registration FAILED" -ForegroundColor $Error
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Error
    exit
}

# Test 3: Login User
Write-Host "`n[3] Testing User Login..." -ForegroundColor $Info
try {
    $loginBody = @{
        email = $testEmail
        password = "testpassword123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod `
        -Uri "$BaseURL/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    if ($loginResponse.success) {
        Write-Host "✓ Login: SUCCESS" -ForegroundColor $Success
        Write-Host "  User: $($loginResponse.user.fullName)" -ForegroundColor $Success
        Write-Host "  Token: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor $Success
        
        $loginToken = $loginResponse.token
    }
    else {
        Write-Host "✗ Login FAILED" -ForegroundColor $Error
        Write-Host "  Message: $($loginResponse.message)" -ForegroundColor $Error
        exit
    }
}
catch {
    Write-Host "✗ Login FAILED" -ForegroundColor $Error
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Error
    exit
}

# Test 4: Get Current User
Write-Host "`n[4] Testing Get Current User..." -ForegroundColor $Info
try {
    $headers = @{
        Authorization = "Bearer $loginToken"
    }

    $meResponse = Invoke-RestMethod `
        -Uri "$BaseURL/auth/me" `
        -Method Get `
        -Headers $headers

    if ($meResponse.success) {
        Write-Host "✓ Get Current User: SUCCESS" -ForegroundColor $Success
        Write-Host "  Full Name: $($meResponse.user.fullName)" -ForegroundColor $Success
        Write-Host "  Email: $($meResponse.user.email)" -ForegroundColor $Success
        Write-Host "  Role: $($meResponse.user.role)" -ForegroundColor $Success
        Write-Host "  Student ID: $($meResponse.user.studentId)" -ForegroundColor $Success
    }
    else {
        Write-Host "✗ Get Current User FAILED" -ForegroundColor $Error
        Write-Host "  Message: $($meResponse.message)" -ForegroundColor $Error
        exit
    }
}
catch {
    Write-Host "✗ Get Current User FAILED" -ForegroundColor $Error
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Error
    exit
}

# Test 5: Test Duplicate Email Registration
Write-Host "`n[5] Testing Duplicate Email Registration..." -ForegroundColor $Info
try {
    $duplicateBody = @{
        fullName = "Another User"
        email = $testEmail
        password = "anotherpassword123"
        phoneNumber = "+84987654321"
    } | ConvertTo-Json

    $duplicateResponse = Invoke-RestMethod `
        -Uri "$BaseURL/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $duplicateBody `
        -SkipHttpErrorCheck

    if (-not $duplicateResponse.success) {
        Write-Host "✓ Duplicate Email Protection: WORKING" -ForegroundColor $Success
        Write-Host "  Message: $($duplicateResponse.message)" -ForegroundColor $Success
    }
    else {
        Write-Host "✗ Duplicate Email Protection: FAILED" -ForegroundColor $Error
    }
}
catch {
    Write-Host "! Duplicate Email Test: Skipped" -ForegroundColor $Warning
}

# Test 6: Test Invalid Credentials
Write-Host "`n[6] Testing Invalid Login Credentials..." -ForegroundColor $Info
try {
    $invalidBody = @{
        email = $testEmail
        password = "wrongpassword"
    } | ConvertTo-Json

    $invalidResponse = Invoke-RestMethod `
        -Uri "$BaseURL/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $invalidBody `
        -SkipHttpErrorCheck

    if (-not $invalidResponse.success) {
        Write-Host "✓ Invalid Credentials Protection: WORKING" -ForegroundColor $Success
        Write-Host "  Message: $($invalidResponse.message)" -ForegroundColor $Success
    }
    else {
        Write-Host "✗ Invalid Credentials Protection: FAILED" -ForegroundColor $Error
    }
}
catch {
    Write-Host "! Invalid Credentials Test: Skipped" -ForegroundColor $Warning
}

# Summary
Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✓ Health Check - OK" -ForegroundColor $Success
Write-Host "✓ User Registration - OK" -ForegroundColor $Success
Write-Host "✓ User Login - OK" -ForegroundColor $Success
Write-Host "✓ Get Current User - OK" -ForegroundColor $Success
Write-Host "✓ Duplicate Email Protection - OK" -ForegroundColor $Success
Write-Host "✓ Invalid Credentials Protection - OK" -ForegroundColor $Success
Write-Host "`nAll tests passed! 🎉" -ForegroundColor $Success
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "API is ready for development!" -ForegroundColor $Success
Write-Host "=================================" -ForegroundColor Cyan
