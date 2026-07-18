const http = require('http');

const API = "http://localhost:4000/api";
let PASSED = 0;
let FAILED = 0;

function makeRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    // Construct full URL
    const fullUrl = API + path;
    const url = new URL(fullUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, error: e.message });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function test_pass(msg) {
  console.log(`[PASS] ${msg}`);
  PASSED++;
}

function test_fail(msg, details) {
  console.log(`[FAIL] ${msg}`);
  if (details) console.log(`       ${details}`);
  FAILED++;
}

function print_section(title) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(title);
  console.log('='.repeat(60));
}

(async () => {
  const timestamp = Date.now().toString().substring(0, 13);
  const clinicAEmail = `clinic-a-${timestamp}@test.com`;
  const clinicAPassword = "TestPass@12345";
  let clinicAToken, clinicAId;

  print_section("PHASE 1: Authentication");

  console.log(">> Registering Clinic A...");
  try {
    const resp = await makeRequest("POST", "/auth/register", {
      email: clinicAEmail,
      password: clinicAPassword,
      name: "User A",
      clinicName: "Clinic A",
      agree: true
    });

    clinicAToken = resp.data.token;
    clinicAId = resp.data.user?.clinicId;

    if (clinicAToken && clinicAId) {
      test_pass("Clinic A registered and logged in");
    } else {
      test_fail("Register Clinic A", `Response: ${JSON.stringify(resp.data)}`);
    }
  } catch (e) {
    test_fail("Register Clinic A", e.message);
  }

  if (!clinicAToken) {
    console.log("\nCannot continue without auth token");
    process.exit(1);
  }

  print_section("PHASE 2: Patients CRUD");

  console.log(">> List patients...");
  try {
    const resp = await makeRequest("GET", "/patients", null, clinicAToken);
    const count = resp.data.data?.items?.length || 0;
    if (count === 0) {
      test_pass("Patient list is empty");
    } else {
      test_fail("Patient list", `Expected empty, found ${count}`);
    }
  } catch (e) {
    test_fail("List patients", e.message);
  }

  console.log(">> Create patient...");
  let patientId;
  try {
    const resp = await makeRequest("POST", "/patients", {
      name: "John Doe",
      email: "john@example.com",
      status: "active"
    }, clinicAToken);

    patientId = resp.data.data?.id;
    if (patientId) {
      test_pass(`Patient created: ${patientId}`);
    } else {
      test_fail("Create patient", `Response: ${JSON.stringify(resp.data)}`);
    }
  } catch (e) {
    test_fail("Create patient", e.message);
  }

  if (patientId) {
    console.log(">> Get patient detail...");
    try {
      const resp = await makeRequest("GET", `/patients/${patientId}`, null, clinicAToken);
      const name = resp.data.data?.name;
      if (name === "John Doe") {
        test_pass("Patient detail retrieved");
      } else {
        test_fail("Get patient", `Name mismatch: ${name}`);
      }
    } catch (e) {
      test_fail("Get patient detail", e.message);
    }

    console.log(">> Update patient...");
    try {
      const resp = await makeRequest("PATCH", `/patients/${patientId}`, {
        status: "inactive"
      }, clinicAToken);

      const status = resp.data.data?.status;
      if (status === "inactive") {
        test_pass("Patient updated successfully");
      } else {
        test_fail("Update patient", `Status: ${status}`);
      }
    } catch (e) {
      test_fail("Update patient", e.message);
    }

    console.log(">> Delete patient...");
    try {
      await makeRequest("DELETE", `/patients/${patientId}`, null, clinicAToken);

      const resp2 = await makeRequest("GET", `/patients/${patientId}`, null, clinicAToken);
      if (resp2.status === 404 || resp2.data.error) {
        test_pass("Patient soft-deleted (404 on access)");
      } else {
        test_fail("Soft delete", "Patient still accessible");
      }
    } catch (e) {
      test_fail("Delete patient", e.message);
    }
  }

  print_section("PHASE 3: Appointments");

  console.log(">> Create appointment patient...");
  try {
    const resp = await makeRequest("POST", "/patients", {
      name: "Jane Doe",
      email: "jane@example.com",
      status: "active"
    }, clinicAToken);

    const aptPatientId = resp.data.data?.id;

    if (aptPatientId) {
      console.log(">> Create appointment...");
      const resp2 = await makeRequest("POST", "/appointments", {
        patientId: aptPatientId,
        doctorId: clinicAId,
        title: "Consultation",
        startTime: "2026-08-20T10:00:00Z",
        endTime: "2026-08-20T10:30:00Z"
      }, clinicAToken);

      const aptId = resp2.data.data?.id;
      if (aptId) {
        test_pass(`Appointment created: ${aptId}`);
      } else {
        test_fail("Create appointment", `Response: ${JSON.stringify(resp2.data)}`);
      }
    }
  } catch (e) {
    test_fail("Appointments", e.message);
  }

  print_section("PHASE 4: Invoices");

  console.log(">> Create invoice patient...");
  try {
    const resp = await makeRequest("POST", "/patients", {
      name: "Invoice Patient",
      email: "invoice@example.com",
      status: "active"
    }, clinicAToken);

    const invPatientId = resp.data.data?.id;

    if (invPatientId) {
      console.log(">> Create invoice...");
      const resp2 = await makeRequest("POST", "/invoices", {
        patientId: invPatientId,
        lineItems: [{ description: "Consultation", quantity: 1, unitPrice: 100 }],
        currency: "USD"
      }, clinicAToken);

      const invId = resp2.data.data?.id;
      const invNumber = resp2.data.data?.invoiceNumber;

      if (invId && invNumber) {
        test_pass(`Invoice created: ${invNumber}`);
      } else {
        test_fail("Create invoice", `Response: ${JSON.stringify(resp2.data)}`);
      }
    }
  } catch (e) {
    test_fail("Invoices", e.message);
  }

  print_section("PHASE 5: Inventory");

  console.log(">> Create inventory item...");
  try {
    const resp = await makeRequest("POST", "/inventory", {
      name: "Bandages",
      sku: `BAND-${timestamp}`,
      quantity: 50,
      reorderLevel: 10
    }, clinicAToken);

    const itemId = resp.data.data?.id;
    const status = resp.data.data?.status;

    if (itemId && status === "in-stock") {
      test_pass(`Inventory item created (status: ${status})`);
    } else {
      test_fail("Create inventory", `Response: ${JSON.stringify(resp.data)}`);
    }
  } catch (e) {
    test_fail("Inventory", e.message);
  }

  print_section("TEST RESULTS");
  console.log(`\nPASSED: ${PASSED}`);
  console.log(`FAILED: ${FAILED}`);
  console.log();

  if (FAILED === 0) {
    console.log("SUCCESS: All integration tests passed!");
    process.exit(0);
  } else {
    console.log(`FAILURE: ${FAILED} test(s) failed`);
    process.exit(1);
  }
})().catch(e => {
  console.error("Fatal:", e);
  process.exit(1);
});
