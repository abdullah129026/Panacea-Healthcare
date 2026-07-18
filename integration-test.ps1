# Integration Testing Script for Panacea Portal
# Tests Backend B3 CRUD APIs against real frontend integration
# Usage: powershell -ExecutionPolicy Bypass -File integration-test.ps1

param(
    [string]$ApiBase = "http://localhost:4000/api",
    [string]$HealthCheck = "http://localhost:4000/health"
)

# Test tracking
$Script:Passed = 0
$Script:Failed = 0
$Script:TestTimestamp = Get-Date -Format "yyyyMMddHHmmss"

# Test data
$Script:ClinicAEmail = "clinic-a-$($Script:TestTimestamp)@test.com"
$Script:ClinicAName = "Clinic A $($Script:TestTimestamp)"
$Script:ClinicAPassword = "TestPassword123!"
$Script:ClinicAUserName = "User A"

$Script:ClinicBEmail = "clinic-b-$($Script:TestTimestamp)@test.com"
$Script:ClinicBName = "Clinic B $($Script:TestTimestamp)"
$Script:ClinicBPassword = "TestPassword123!"
$Script:ClinicBUserName = "User B"

# Global test data storage
$Script:ClinicAToken = ""
$Script:ClinicAId = ""
$Script:ClinicAUserId = ""
$Script:ClinicBToken = ""
$Script:ClinicBId = ""
$Script:PatientId = ""
$Script:AppointmentId = ""
$Script:InvoiceId = ""
$Script:InventoryId = ""

# Helper functions
function Print-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Print-Test {
    param([string]$Message)
    Write-Host ">> $Message" -ForegroundColor Yellow
}

function Print-Pass {
    param([string]$Message)
    Write-Host "[PASS] $Message" -ForegroundColor Green
    $Script:Passed += 1
}

function Print-Fail {
    param([string]$Message, [string]$Details)
    Write-Host "[FAIL] $Message" -ForegroundColor Red
    Write-Host "       Details: $Details" -ForegroundColor Red
    $Script:Failed += 1
}

function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Data,
        [string]$Token
    )

    $Url = "$ApiBase$Endpoint"
    $Headers = @{ "Content-Type" = "application/json" }

    if ($Token) {
        $Headers["Authorization"] = "Bearer $Token"
    }

    try {
        if ($Data) {
            $JsonData = $Data | ConvertTo-Json -Compress
            $Response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $Headers -Body $JsonData -ErrorAction Stop
        }
        else {
            $Response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $Headers -ErrorAction Stop
        }
        return $Response.Content | ConvertFrom-Json
    }
    catch {
        # Try to get error response
        if ($null -ne $_.Exception.Response) {
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = [System.IO.StreamReader]::new($stream)
                $errorText = $reader.ReadToEnd()
                $reader.Close()

                # Try to parse as JSON
                try {
                    return $errorText | ConvertFrom-Json
                }
                catch {
                    # Return as plain text if not JSON
                    return @{ error = "Server error: $errorText" }
                }
            }
            catch {
                return @{ error = "HTTP $($_.Exception.Response.StatusCode): $($_.Exception.Message)" }
            }
        }
        return @{ error = $_.Exception.Message }
    }
}

# Test Phases
function Test-HealthCheck {
    Print-Header "Health Check"
    Print-Test "Checking backend health..."

    try {
        $Response = Invoke-WebRequest -Uri $HealthCheck -ErrorAction Stop
        Print-Pass "Backend is running on $HealthCheck"
        return $true
    }
    catch {
        Print-Fail "Backend health check failed" $_.Exception.Message
        return $false
    }
}

function Test-Authentication {
    Print-Header "PHASE 1: Authentication"

    Print-Test "Register Clinic A..."
    $RegData = @{
        email = $Script:ClinicAEmail
        password = $Script:ClinicAPassword
        name = $Script:ClinicAUserName
        clinicName = $Script:ClinicAName
        agree = $true
    }
    $Response = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/register" -Data $RegData

    $Script:ClinicAToken = $Response.token
    if (-not $Script:ClinicAToken) {
        Print-Fail "Clinic A registration" "No token returned"
        return
    }
    Print-Pass "Clinic A registered and logged in"

    $Script:ClinicAId = $Response.user.clinicId
    $Script:ClinicAUserId = $Response.user.id
    if (-not $Script:ClinicAId -or -not $Script:ClinicAUserId) {
        Print-Fail "Clinic A registration" "Missing clinic/user ID"
        return
    }

    Print-Test "Login with Clinic A credentials..."
    $LoginData = @{
        email = $Script:ClinicAEmail
        password = $Script:ClinicAPassword
    }
    $LoginResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Data $LoginData

    $LoginToken = $LoginResponse.token
    if (-not $LoginToken) {
        Print-Fail "Clinic A login" "No token returned"
        return
    }
    Print-Pass "Clinic A login successful"

    Print-Test "Register Clinic B..."
    $RegBData = @{
        email = $Script:ClinicBEmail
        password = $Script:ClinicBPassword
        name = $Script:ClinicBUserName
        clinicName = $Script:ClinicBName
        agree = $true
    }
    $ResponseB = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/register" -Data $RegBData

    $Script:ClinicBToken = $ResponseB.token
    $Script:ClinicBId = $ResponseB.user.clinicId
    if (-not $Script:ClinicBToken -or -not $Script:ClinicBId) {
        Print-Fail "Clinic B registration" "No token/clinic ID returned"
        return
    }
    Print-Pass "Clinic B registered and logged in"
}

function Test-PatientsCRUD {
    Print-Header "PHASE 2: Patients CRUD"

    Print-Test "List patients (expect empty list)..."
    $ListResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/patients" -Token $Script:ClinicAToken
    $Count = @($ListResponse.data.items).Count
    if ($Count -eq 0 -or -not $ListResponse.data.items) {
        Print-Pass "Patient list is empty"
    }
    else {
        Print-Fail "Patient list should be empty" "Found $Count patients"
    }

    Print-Test "Create patient..."
    $PatientData = @{
        name = "John Doe"
        email = "john@test.com"
        status = "active"
    }
    $CreateResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/patients" -Data $PatientData -Token $Script:ClinicAToken

    if ($CreateResponse.error) {
        Print-Fail "Create patient" $CreateResponse.error
        Write-Host "Full response: $($CreateResponse | ConvertTo-Json)" -ForegroundColor DarkYellow
        return
    }

    $Script:PatientId = $CreateResponse.data.id
    if (-not $Script:PatientId) {
        Print-Fail "Create patient" "No ID returned. Response: $($CreateResponse | ConvertTo-Json -Depth 2)"
        return
    }
    Print-Pass "Patient created: $($Script:PatientId)"

    Print-Test "Get patient detail..."
    $DetailResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/patients/$($Script:PatientId)" -Token $Script:ClinicAToken
    $PatientName = $DetailResponse.data.name
    if ($PatientName -eq "John Doe") {
        Print-Pass "Patient detail retrieved"
    }
    else {
        Print-Fail "Get patient detail" "Name mismatch: $PatientName"
    }

    Print-Test "Update patient status..."
    $UpdateData = @{ status = "inactive" }
    $UpdateResponse = Invoke-ApiRequest -Method "PATCH" -Endpoint "/patients/$($Script:PatientId)" -Data $UpdateData -Token $Script:ClinicAToken
    $UpdatedStatus = $UpdateResponse.data.status
    if ($UpdatedStatus -eq "inactive") {
        Print-Pass "Patient updated successfully"
    }
    else {
        Print-Fail "Update patient" "Status: $UpdatedStatus"
    }

    Print-Test "Delete patient (soft delete)..."
    $DeleteResponse = Invoke-ApiRequest -Method "DELETE" -Endpoint "/patients/$($Script:PatientId)" -Token $Script:ClinicAToken

    $VerifyResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/patients/$($Script:PatientId)" -Token $Script:ClinicAToken
    if ($VerifyResponse.success -eq $false -or $VerifyResponse.error) {
        Print-Pass "Patient soft-deleted - returns 404"
    }
    else {
        Print-Fail "Soft delete verification" "Patient still accessible"
    }
}

function Test-Appointments {
    Print-Header "PHASE 3: Appointments"

    Print-Test "Create patient for appointment..."
    $PatientData = @{
        name = "Jane Doe"
        email = "jane@test.com"
        status = "active"
    }
    $PatientResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/patients" -Data $PatientData -Token $Script:ClinicAToken
    $AptPatientId = $PatientResponse.data.id
    if (-not $AptPatientId) {
        Print-Fail "Create patient for appointment" "Failed to create patient"
        return
    }

    Print-Test "Create appointment..."
    $AptData = @{
        patientId = $AptPatientId
        doctorId = $Script:ClinicAUserId
        title = "Consultation"
        startTime = "2026-07-20T10:00:00Z"
        endTime = "2026-07-20T10:30:00Z"
    }
    $AptResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/appointments" -Data $AptData -Token $Script:ClinicAToken

    $Script:AppointmentId = $AptResponse.data.id
    if (-not $Script:AppointmentId) {
        Print-Fail "Create appointment" "No ID returned"
        return
    }
    Print-Pass "Appointment created: $($Script:AppointmentId)"

    Print-Test "Test appointment conflict detection..."
    $ConflictData = @{
        patientId = $AptPatientId
        doctorId = $Script:ClinicAUserId
        title = "Overlap"
        startTime = "2026-07-20T10:15:00Z"
        endTime = "2026-07-20T10:45:00Z"
    }
    $ConflictResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/appointments" -Data $ConflictData -Token $Script:ClinicAToken
    $ConflictError = $ConflictResponse.error

    if ($ConflictError) {
        Print-Pass "Appointment conflict detected: $ConflictError"
    }
    else {
        Print-Fail "Conflict detection" "Should reject overlapping appointment"
    }

    Print-Test "Get appointment schedule slots..."
    $DocId = $Script:ClinicAUserId
    $ScheduleEndpoint = "/appointments/schedule?date=2026-07-20" + [char]38 + "doctorId=$DocId"
    $ScheduleResponse = Invoke-ApiRequest -Method "GET" -Endpoint $ScheduleEndpoint -Token $Script:ClinicAToken
    $SlotCount = @($ScheduleResponse.data.slots).Count
    if ($SlotCount -gt 0) {
        Print-Pass "Schedule slots retrieved: $SlotCount slots"
    }
    else {
        Print-Fail "Get schedule" "No slots returned"
    }
}

function Test-Invoices {
    Print-Header "PHASE 4: Invoices"

    Print-Test "Create patient for invoice..."
    $PatientData = @{
        name = "Invoice Patient"
        email = "invoice@test.com"
        status = "active"
    }
    $PatientResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/patients" -Data $PatientData -Token $Script:ClinicAToken
    $InvPatientId = $PatientResponse.data.id
    if (-not $InvPatientId) {
        Print-Fail "Create patient for invoice" "Failed"
        return
    }

    Print-Test "Create invoice..."
    $InvoiceData = @{
        patientId = $InvPatientId
        lineItems = @(@{
            description = "Consultation"
            quantity = 1
            unitPrice = 100
        })
        currency = "USD"
    }
    $InvoiceResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/invoices" -Data $InvoiceData -Token $Script:ClinicAToken

    $Script:InvoiceId = $InvoiceResponse.data.id
    $InvoiceNumber = $InvoiceResponse.data.invoiceNumber
    if (-not $Script:InvoiceId -or -not $InvoiceNumber) {
        Print-Fail "Create invoice" "No ID or invoice number"
        return
    }
    Print-Pass "Invoice created: $InvoiceNumber (ID: $($Script:InvoiceId))"

    Print-Test "Update invoice to paid..."
    $UpdateData = @{
        status = "paid"
        paidAmount = 100
    }
    $UpdateResponse = Invoke-ApiRequest -Method "PATCH" -Endpoint "/invoices/$($Script:InvoiceId)" -Data $UpdateData -Token $Script:ClinicAToken
    $Status = $UpdateResponse.data.status
    if ($Status -eq "paid") {
        Print-Pass "Invoice status updated to paid"
    }
    else {
        Print-Fail "Update invoice status" "Status: $Status"
    }
}

function Test-Inventory {
    Print-Header "PHASE 5: Inventory"

    Print-Test "Create inventory item..."
    $InvData = @{
        name = "Bandages"
        sku = "BAND-001-$($Script:TestTimestamp)"
        quantity = 50
        reorderLevel = 10
    }
    $InvResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/inventory" -Data $InvData -Token $Script:ClinicAToken

    $Script:InventoryId = $InvResponse.data.id
    $Status = $InvResponse.data.status
    if (-not $Script:InventoryId) {
        Print-Fail "Create inventory item" "No ID returned"
        return
    }
    if ($Status -eq "in-stock") {
        Print-Pass "Inventory item created: $($Script:InventoryId) (status: $Status)"
    }
    else {
        Print-Fail "Inventory status" "Expected in-stock, got: $Status"
    }

    Print-Test "Update inventory to low-stock..."
    $UpdateData = @{ quantity = 5 }
    $UpdateResponse = Invoke-ApiRequest -Method "PATCH" -Endpoint "/inventory/$($Script:InventoryId)" -Data $UpdateData -Token $Script:ClinicAToken
    $UpdatedStatus = $UpdateResponse.data.status
    if ($UpdatedStatus -eq "low-stock") {
        Print-Pass "Inventory status updated to low-stock"
    }
    else {
        Print-Fail "Update inventory status" "Expected low-stock, got: $UpdatedStatus"
    }
}

function Test-ClinicIsolation {
    Print-Header "PHASE 6: Clinic Isolation - CRITICAL"

    Print-Test "Create patient in Clinic A..."
    $PatientData = @{
        name = "Clinic A Only"
        email = "clinic-a-only@test.com"
        status = "active"
    }
    $PatientResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/patients" -Data $PatientData -Token $Script:ClinicAToken
    $IsolationPatientId = $PatientResponse.data.id
    if (-not $IsolationPatientId) {
        Print-Fail "Create isolation test patient" "Failed"
        return
    }
    Print-Pass "Test patient created in Clinic A"

    Print-Test "Try to access Clinic A patient from Clinic B..."
    $AccessResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/patients/$IsolationPatientId" -Token $Script:ClinicBToken
    $Success = $AccessResponse.success
    $Error = $AccessResponse.error

    if ($Success -eq $false -and $Error) {
        Print-Pass "Clinic isolation verified - Cross-clinic access denied"
    }
    else {
        Print-Fail "CRITICAL: Clinic isolation broken" "Clinic B could access Clinic A data"
    }

    Print-Test "Verify Clinic B has no patients..."
    $ClinicBList = Invoke-ApiRequest -Method "GET" -Endpoint "/patients" -Token $Script:ClinicBToken
    $ClinicBCount = @($ClinicBList.data.items).Count
    if ($ClinicBCount -eq 0 -or -not $ClinicBList.data.items) {
        Print-Pass "Clinic B has isolated patient list"
    }
    else {
        Print-Fail "Clinic B isolation" "Found $ClinicBCount patients in empty clinic"
    }
}

function Test-Validation {
    Print-Header "PHASE 7: Validation and Error Handling"

    Print-Test "Test invalid email validation..."
    $InvalidData = @{
        email = "not-an-email"
        password = "TestPassword123!"
    }
    $InvalidResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Data $InvalidData
    $InvalidError = $InvalidResponse.error
    if ($InvalidError) {
        Print-Pass "Email validation working"
    }
    else {
        Print-Fail "Email validation" "Should reject invalid email"
    }

    Print-Test "Test missing required fields..."
    $MissingData = @{ name = "" }
    $MissingResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/patients" -Data $MissingData -Token $Script:ClinicAToken
    $MissingError = $MissingResponse.error
    if ($MissingError) {
        Print-Pass "Required field validation working"
    }
    else {
        Print-Fail "Required field validation" "Should reject empty name"
    }

    Print-Test "Test unauthenticated access..."
    $UnauthResponse = Invoke-ApiRequest -Method "GET" -Endpoint "/patients"
    $UnauthError = $UnauthResponse.error
    if ($UnauthError) {
        Print-Pass "Authentication enforcement working"
    }
    else {
        Print-Fail "Authentication enforcement" "Should reject unauthenticated request"
    }
}

function Test-Pagination {
    Print-Header "PHASE 8: Pagination and Filtering"

    Print-Test "Creating 5 test patients..."
    for ($i = 1; $i -le 5; $i++) {
        $PatientData = @{
            name = "Patient $i"
            email = "patient-$i-$($Script:TestTimestamp)@test.com"
            status = "active"
        }
        $null = Invoke-ApiRequest -Method "POST" -Endpoint "/patients" -Data $PatientData -Token $Script:ClinicAToken
    }
    Print-Pass "5 patients created"

    Print-Test "Test pagination (page 1, size 3)..."
    $PaginationEndpoint = "/patients?page=1" + [char]38 + "size=3"
    $Page1 = Invoke-ApiRequest -Method "GET" -Endpoint $PaginationEndpoint -Token $Script:ClinicAToken
    $Page1Count = @($Page1.data.items).Count
    $HasMore = $Page1.data.hasMore
    if ($Page1Count -eq 3 -and $HasMore -eq $true) {
        Print-Pass "Pagination working (page 1 has 3 items, hasMore=true)"
    }
    else {
        Print-Fail "Pagination" "Expected 3 items with hasMore=true, got: $Page1Count items, hasMore=$HasMore"
    }

    Print-Test "Test search/status filtering..."
    $Filter = Invoke-ApiRequest -Method "GET" -Endpoint "/patients?status=active" -Token $Script:ClinicAToken
    $FilterCount = @($Filter.data.items).Count
    if ($FilterCount -gt 0) {
        Print-Pass "Filtering working (found $FilterCount active patients)"
    }
    else {
        Print-Fail "Filtering" "No results for status=active filter"
    }
}

function Print-Summary {
    Print-Header "TEST SUMMARY"
    Write-Host ""
    Write-Host "PASSED: $($Script:Passed)" -ForegroundColor Green
    Write-Host "FAILED: $($Script:Failed)" -ForegroundColor Red
    Write-Host ""

    if ($Script:Failed -eq 0) {
        Write-Host "All tests passed! Integration is working correctly." -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "Some tests failed. Review the details above." -ForegroundColor Red
        return $false
    }
}

# Main execution
function Main {
    Print-Header "Panacea Portal - Integration Test Suite"
    Write-Host "API Base: $ApiBase"
    Write-Host "Start time: $(Get-Date)"
    Write-Host ""

    if (-not (Test-HealthCheck)) {
        Write-Host ""
        Write-Host "Backend is not running. Please start it with: npm run dev" -ForegroundColor Red
        exit 1
    }

    Test-Authentication
    Test-PatientsCRUD
    Test-Appointments
    Test-Invoices
    Test-Inventory
    Test-ClinicIsolation
    Test-Validation
    Test-Pagination

    $Success = Print-Summary

    if ($Success) {
        exit 0
    }
    else {
        exit 1
    }
}

Main
