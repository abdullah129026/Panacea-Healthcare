#!/bin/bash

# Integration Testing Script for Panacea Portal
# Tests Backend B3 CRUD APIs against real frontend integration
# Usage: bash integration-test.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="http://localhost:4000/api"
HEALTH_CHECK="http://localhost:4000/health"
TEST_TIMESTAMP=$(date +%s)

# Test data
CLINIC_A_EMAIL="clinic-a-${TEST_TIMESTAMP}@test.com"
CLINIC_A_NAME="Clinic A ${TEST_TIMESTAMP}"
CLINIC_A_PASSWORD="TestPassword123!"
CLINIC_A_USER_NAME="User A"

CLINIC_B_EMAIL="clinic-b-${TEST_TIMESTAMP}@test.com"
CLINIC_B_NAME="Clinic B ${TEST_TIMESTAMP}"
CLINIC_B_PASSWORD="TestPassword123!"
CLINIC_B_USER_NAME="User B"

# Global variables to store test results
PASSED=0
FAILED=0
CLINIC_A_TOKEN=""
CLINIC_A_ID=""
CLINIC_A_USER_ID=""
CLINIC_B_TOKEN=""
CLINIC_B_ID=""
PATIENT_ID=""
APPOINTMENT_ID=""
INVOICE_ID=""
INVENTORY_ID=""

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_test() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_pass() {
    echo -e "${GREEN}✓ PASS: $1${NC}"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}✗ FAIL: $1${NC}"
    echo -e "${RED}  Details: $2${NC}"
    ((FAILED++))
}

# Make API request and return response
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4

    local url="${API_BASE}${endpoint}"
    local headers="-H 'Content-Type: application/json'"

    if [ -n "$token" ]; then
        headers="$headers -H 'Authorization: Bearer $token'"
    fi

    if [ -z "$data" ]; then
        eval "curl -s -X $method $headers '$url'"
    else
        eval "curl -s -X $method $headers -d '$data' '$url'"
    fi
}

# Check if API is healthy
check_api_health() {
    print_header "Health Check"
    print_test "Checking backend health..."

    local response=$(curl -s -w "\n%{http_code}" "$HEALTH_CHECK")
    local status=$(echo "$response" | tail -n 1)

    if [ "$status" = "200" ]; then
        print_pass "Backend is running on $HEALTH_CHECK"
    else
        print_fail "Backend health check failed" "Status code: $status"
        exit 1
    fi
}

# Phase 1: Authentication
phase_auth() {
    print_header "PHASE 1: Authentication"

    # Register Clinic A
    print_test "Register Clinic A..."
    local reg_data="{\"email\":\"$CLINIC_A_EMAIL\",\"password\":\"$CLINIC_A_PASSWORD\",\"name\":\"$CLINIC_A_USER_NAME\",\"clinicName\":\"$CLINIC_A_NAME\",\"agree\":true}"
    local response=$(api_request "POST" "/auth/register" "$reg_data")

    CLINIC_A_TOKEN=$(echo "$response" | jq -r '.token // empty')
    if [ -z "$CLINIC_A_TOKEN" ]; then
        print_fail "Clinic A registration" "No token returned: $response"
        return 1
    fi
    print_pass "Clinic A registered and logged in"

    # Get Clinic A user ID
    CLINIC_A_ID=$(echo "$response" | jq -r '.user.clinicId // empty')
    CLINIC_A_USER_ID=$(echo "$response" | jq -r '.user.id // empty')
    if [ -z "$CLINIC_A_ID" ] || [ -z "$CLINIC_A_USER_ID" ]; then
        print_fail "Clinic A registration" "Missing clinic/user ID in response"
        return 1
    fi

    # Login test
    print_test "Login with Clinic A credentials..."
    local login_data="{\"email\":\"$CLINIC_A_EMAIL\",\"password\":\"$CLINIC_A_PASSWORD\"}"
    local login_response=$(api_request "POST" "/auth/login" "$login_data")

    local login_token=$(echo "$login_response" | jq -r '.token // empty')
    if [ -z "$login_token" ]; then
        print_fail "Clinic A login" "No token returned"
        return 1
    fi
    print_pass "Clinic A login successful"

    # Register Clinic B
    print_test "Register Clinic B..."
    local reg_b_data="{\"email\":\"$CLINIC_B_EMAIL\",\"password\":\"$CLINIC_B_PASSWORD\",\"name\":\"$CLINIC_B_USER_NAME\",\"clinicName\":\"$CLINIC_B_NAME\",\"agree\":true}"
    local response_b=$(api_request "POST" "/auth/register" "$reg_b_data")

    CLINIC_B_TOKEN=$(echo "$response_b" | jq -r '.token // empty')
    CLINIC_B_ID=$(echo "$response_b" | jq -r '.user.clinicId // empty')
    if [ -z "$CLINIC_B_TOKEN" ] || [ -z "$CLINIC_B_ID" ]; then
        print_fail "Clinic B registration" "No token/clinic ID returned"
        return 1
    fi
    print_pass "Clinic B registered and logged in"
}

# Phase 2: Patients CRUD
phase_patients() {
    print_header "PHASE 2: Patients CRUD"

    # List patients (should be empty)
    print_test "List patients (expect empty list)..."
    local list_response=$(api_request "GET" "/patients" "" "$CLINIC_A_TOKEN")
    local count=$(echo "$list_response" | jq '.data.items | length // 0')
    if [ "$count" = "0" ]; then
        print_pass "Patient list is empty"
    else
        print_fail "Patient list should be empty" "Found $count patients"
    fi

    # Create patient
    print_test "Create patient..."
    local patient_data="{\"name\":\"John Doe\",\"email\":\"john@test.com\",\"status\":\"active\"}"
    local create_response=$(api_request "POST" "/patients" "$patient_data" "$CLINIC_A_TOKEN")

    PATIENT_ID=$(echo "$create_response" | jq -r '.data.id // empty')
    if [ -z "$PATIENT_ID" ]; then
        print_fail "Create patient" "No ID returned: $create_response"
        return 1
    fi
    print_pass "Patient created: $PATIENT_ID"

    # Get patient detail
    print_test "Get patient detail..."
    local detail_response=$(api_request "GET" "/patients/$PATIENT_ID" "" "$CLINIC_A_TOKEN")
    local patient_name=$(echo "$detail_response" | jq -r '.data.name // empty')
    if [ "$patient_name" = "John Doe" ]; then
        print_pass "Patient detail retrieved"
    else
        print_fail "Get patient detail" "Name mismatch: $patient_name"
    fi

    # Update patient
    print_test "Update patient status..."
    local update_data="{\"status\":\"inactive\"}"
    local update_response=$(api_request "PATCH" "/patients/$PATIENT_ID" "$update_data" "$CLINIC_A_TOKEN")
    local updated_status=$(echo "$update_response" | jq -r '.data.status // empty')
    if [ "$updated_status" = "inactive" ]; then
        print_pass "Patient updated successfully"
    else
        print_fail "Update patient" "Status not updated: $updated_status"
    fi

    # Soft delete patient
    print_test "Delete patient (soft delete)..."
    local delete_response=$(api_request "DELETE" "/patients/$PATIENT_ID" "" "$CLINIC_A_TOKEN")
    # 204 No Content has no body, so check if response is empty
    if [ -z "$(echo "$delete_response" | tr -d '[:space:]')" ] || [ "$(echo "$delete_response" | jq -r '.success // false')" = "false" ]; then
        # Try to fetch deleted patient - should get 404
        local verify_response=$(api_request "GET" "/patients/$PATIENT_ID" "" "$CLINIC_A_TOKEN")
        local error=$(echo "$verify_response" | jq -r '.error // empty')
        if [ -n "$error" ] || [ "$(echo "$verify_response" | jq -r '.success // false')" = "false" ]; then
            print_pass "Patient soft-deleted (404 on access)"
        else
            print_fail "Soft delete verification" "Patient still accessible"
        fi
    else
        print_pass "Patient delete successful"
    fi
}

# Phase 3: Appointments
phase_appointments() {
    print_header "PHASE 3: Appointments"

    # Create a new patient for appointment test
    print_test "Create patient for appointment..."
    local patient_data="{\"name\":\"Jane Doe\",\"email\":\"jane@test.com\",\"status\":\"active\"}"
    local patient_response=$(api_request "POST" "/patients" "$patient_data" "$CLINIC_A_TOKEN")
    local apt_patient_id=$(echo "$patient_response" | jq -r '.data.id // empty')
    if [ -z "$apt_patient_id" ]; then
        print_fail "Create patient for appointment" "Failed to create patient"
        return 1
    fi

    # Create appointment
    print_test "Create appointment..."
    local apt_data="{\"patientId\":\"$apt_patient_id\",\"doctorId\":\"$CLINIC_A_USER_ID\",\"title\":\"Consultation\",\"startTime\":\"2026-07-20T10:00:00Z\",\"endTime\":\"2026-07-20T10:30:00Z\"}"
    local apt_response=$(api_request "POST" "/appointments" "$apt_data" "$CLINIC_A_TOKEN")

    APPOINTMENT_ID=$(echo "$apt_response" | jq -r '.data.id // empty')
    if [ -z "$APPOINTMENT_ID" ]; then
        print_fail "Create appointment" "No ID returned: $apt_response"
        return 1
    fi
    print_pass "Appointment created: $APPOINTMENT_ID"

    # Test conflict detection
    print_test "Test appointment conflict detection..."
    local conflict_data="{\"patientId\":\"$apt_patient_id\",\"doctorId\":\"$CLINIC_A_USER_ID\",\"title\":\"Overlap\",\"startTime\":\"2026-07-20T10:15:00Z\",\"endTime\":\"2026-07-20T10:45:00Z\"}"
    local conflict_response=$(api_request "POST" "/appointments" "$conflict_data" "$CLINIC_A_TOKEN")
    local conflict_error=$(echo "$conflict_response" | jq -r '.error // empty')

    if [ -n "$conflict_error" ]; then
        print_pass "Appointment conflict detected: $conflict_error"
    else
        print_fail "Conflict detection" "Should reject overlapping appointment"
    fi

    # Get schedule slots
    print_test "Get appointment schedule slots..."
    local schedule_response=$(api_request "GET" "/appointments/schedule?date=2026-07-20&doctorId=$CLINIC_A_USER_ID" "" "$CLINIC_A_TOKEN")
    local slot_count=$(echo "$schedule_response" | jq '.data.slots | length // 0')
    if [ "$slot_count" -gt 0 ]; then
        print_pass "Schedule slots retrieved: $slot_count slots"
    else
        print_fail "Get schedule" "No slots returned"
    fi
}

# Phase 4: Invoices
phase_invoices() {
    print_header "PHASE 4: Invoices"

    # Create patient for invoice
    print_test "Create patient for invoice..."
    local patient_data="{\"name\":\"Invoice Patient\",\"email\":\"invoice@test.com\",\"status\":\"active\"}"
    local patient_response=$(api_request "POST" "/patients" "$patient_data" "$CLINIC_A_TOKEN")
    local inv_patient_id=$(echo "$patient_response" | jq -r '.data.id // empty')
    if [ -z "$inv_patient_id" ]; then
        print_fail "Create patient for invoice" "Failed"
        return 1
    fi

    # Create invoice
    print_test "Create invoice..."
    local invoice_data="{\"patientId\":\"$inv_patient_id\",\"lineItems\":[{\"description\":\"Consultation\",\"quantity\":1,\"unitPrice\":100}],\"currency\":\"USD\"}"
    local invoice_response=$(api_request "POST" "/invoices" "$invoice_data" "$CLINIC_A_TOKEN")

    INVOICE_ID=$(echo "$invoice_response" | jq -r '.data.id // empty')
    local invoice_number=$(echo "$invoice_response" | jq -r '.data.invoiceNumber // empty')
    if [ -z "$INVOICE_ID" ] || [ -z "$invoice_number" ]; then
        print_fail "Create invoice" "No ID or invoice number: $invoice_response"
        return 1
    fi
    print_pass "Invoice created: $invoice_number (ID: $INVOICE_ID)"

    # Update invoice status
    print_test "Update invoice to paid..."
    local update_data="{\"status\":\"paid\",\"paidAmount\":100}"
    local update_response=$(api_request "PATCH" "/invoices/$INVOICE_ID" "$update_data" "$CLINIC_A_TOKEN")
    local status=$(echo "$update_response" | jq -r '.data.status // empty')
    if [ "$status" = "paid" ]; then
        print_pass "Invoice status updated to paid"
    else
        print_fail "Update invoice status" "Status: $status"
    fi
}

# Phase 5: Inventory
phase_inventory() {
    print_header "PHASE 5: Inventory"

    # Create inventory item
    print_test "Create inventory item..."
    local inv_data="{\"name\":\"Bandages\",\"sku\":\"BAND-001-$TEST_TIMESTAMP\",\"quantity\":50,\"reorderLevel\":10}"
    local inv_response=$(api_request "POST" "/inventory" "$inv_data" "$CLINIC_A_TOKEN")

    INVENTORY_ID=$(echo "$inv_response" | jq -r '.data.id // empty')
    local status=$(echo "$inv_response" | jq -r '.data.status // empty')
    if [ -z "$INVENTORY_ID" ]; then
        print_fail "Create inventory item" "No ID returned: $inv_response"
        return 1
    fi
    if [ "$status" = "in-stock" ]; then
        print_pass "Inventory item created: $INVENTORY_ID (status: $status)"
    else
        print_fail "Inventory status" "Expected in-stock, got: $status"
    fi

    # Update to low-stock
    print_test "Update inventory to low-stock..."
    local update_data="{\"quantity\":5}"
    local update_response=$(api_request "PATCH" "/inventory/$INVENTORY_ID" "$update_data" "$CLINIC_A_TOKEN")
    local updated_status=$(echo "$update_response" | jq -r '.data.status // empty')
    if [ "$updated_status" = "low-stock" ]; then
        print_pass "Inventory status updated to low-stock"
    else
        print_fail "Update inventory status" "Expected low-stock, got: $updated_status"
    fi
}

# Phase 6: Clinic Isolation (CRITICAL)
phase_clinic_isolation() {
    print_header "PHASE 6: Clinic Isolation (CRITICAL)"

    # Clinic A has a patient, Clinic B should NOT see it
    print_test "Create patient in Clinic A..."
    local patient_data="{\"name\":\"Clinic A Only\",\"email\":\"clinic-a-only@test.com\",\"status\":\"active\"}"
    local patient_response=$(api_request "POST" "/patients" "$patient_data" "$CLINIC_A_TOKEN")
    local isolation_patient_id=$(echo "$patient_response" | jq -r '.data.id // empty')
    if [ -z "$isolation_patient_id" ]; then
        print_fail "Create isolation test patient" "Failed"
        return 1
    fi
    print_pass "Test patient created in Clinic A"

    # Try to access from Clinic B (should get 404)
    print_test "Try to access Clinic A's patient from Clinic B..."
    local access_response=$(api_request "GET" "/patients/$isolation_patient_id" "" "$CLINIC_B_TOKEN")
    local success=$(echo "$access_response" | jq -r '.success // false')
    local error=$(echo "$access_response" | jq -r '.error // empty')

    if [ "$success" = "false" ] && [ -n "$error" ]; then
        print_pass "Clinic isolation verified: Cross-clinic access denied"
    else
        print_fail "CRITICAL: Clinic isolation broken" "Clinic B could access Clinic A's data!"
    fi

    # Clinic B patient list should be empty
    print_test "Verify Clinic B has no patients..."
    local clinic_b_list=$(api_request "GET" "/patients" "" "$CLINIC_B_TOKEN")
    local clinic_b_count=$(echo "$clinic_b_list" | jq '.data.items | length // 0')
    if [ "$clinic_b_count" = "0" ]; then
        print_pass "Clinic B has isolated patient list"
    else
        print_fail "Clinic B isolation" "Found $clinic_b_count patients in empty clinic"
    fi
}

# Phase 7: Error Handling & Validation
phase_validation() {
    print_header "PHASE 7: Validation & Error Handling"

    # Invalid email
    print_test "Test invalid email validation..."
    local invalid_data="{\"email\":\"not-an-email\",\"password\":\"TestPassword123!\"}"
    local invalid_response=$(api_request "POST" "/auth/login" "$invalid_data")
    local invalid_error=$(echo "$invalid_response" | jq -r '.error // empty')
    if [ -n "$invalid_error" ]; then
        print_pass "Email validation working"
    else
        print_fail "Email validation" "Should reject invalid email"
    fi

    # Missing required field
    print_test "Test missing required fields..."
    local missing_data="{\"name\":\"\"}"
    local missing_response=$(api_request "POST" "/patients" "$missing_data" "$CLINIC_A_TOKEN")
    local missing_error=$(echo "$missing_response" | jq -r '.error // empty')
    if [ -n "$missing_error" ]; then
        print_pass "Required field validation working"
    else
        print_fail "Required field validation" "Should reject empty name"
    fi

    # Unauthenticated access
    print_test "Test unauthenticated access..."
    local unauth_response=$(api_request "GET" "/patients" "")
    local unauth_error=$(echo "$unauth_response" | jq -r '.error // empty')
    if [ -n "$unauth_error" ]; then
        print_pass "Authentication enforcement working"
    else
        print_fail "Authentication enforcement" "Should reject unauthenticated request"
    fi
}

# Phase 8: Pagination & Filtering
phase_pagination() {
    print_header "PHASE 8: Pagination & Filtering"

    # Create multiple patients
    print_test "Creating 5 test patients..."
    for i in {1..5}; do
        local patient_data="{\"name\":\"Patient $i\",\"email\":\"patient-$i-$TEST_TIMESTAMP@test.com\",\"status\":\"active\"}"
        api_request "POST" "/patients" "$patient_data" "$CLINIC_A_TOKEN" > /dev/null
    done
    print_pass "5 patients created"

    # Test pagination
    print_test "Test pagination (page 1, size 3)..."
    local page1=$(api_request "GET" "/patients?page=1&size=3" "" "$CLINIC_A_TOKEN")
    local page1_count=$(echo "$page1" | jq '.data.items | length // 0')
    local has_more=$(echo "$page1" | jq '.data.hasMore // false')
    if [ "$page1_count" = "3" ] && [ "$has_more" = "true" ]; then
        print_pass "Pagination working (page 1 has 3 items, hasMore=true)"
    else
        print_fail "Pagination" "Expected 3 items with hasMore=true, got: $page1_count items, hasMore=$has_more"
    fi

    # Test filtering
    print_test "Test search/status filtering..."
    local filter=$(api_request "GET" "/patients?status=active" "" "$CLINIC_A_TOKEN")
    local filter_count=$(echo "$filter" | jq '.data.items | length // 0')
    if [ "$filter_count" -gt 0 ]; then
        print_pass "Filtering working (found $filter_count active patients)"
    else
        print_fail "Filtering" "No results for status=active filter"
    fi
}

# Print final summary
print_summary() {
    print_header "TEST SUMMARY"
    echo ""
    echo -e "${GREEN}PASSED: $PASSED${NC}"
    echo -e "${RED}FAILED: $FAILED${NC}"
    echo ""

    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed! Integration is working correctly.${NC}"
        return 0
    else
        echo -e "${RED}✗ Some tests failed. Review the details above.${NC}"
        return 1
    fi
}

# Main execution
main() {
    print_header "Panacea Portal - Integration Test Suite"
    echo "API Base: $API_BASE"
    echo "Start time: $(date)"
    echo ""

    check_api_health
    phase_auth
    phase_patients
    phase_appointments
    phase_invoices
    phase_inventory
    phase_clinic_isolation
    phase_validation
    phase_pagination

    print_summary
}

# Run tests
main
exit $?
