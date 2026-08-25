const http = require('http');

async function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function post(url, payload) {
  return new Promise((resolve, reject) => {
    const payloadStr = JSON.stringify(payload);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.write(payloadStr);
    req.end();
  });
}

async function runTests() {
  console.log("--------------------------------------------------");
  console.log("RUNNING ENDPOINT VERIFICATION TESTS");
  console.log("--------------------------------------------------");

  try {
    // 1. Verify Homepage load
    const home = await get('http://localhost:3000/');
    console.log(`[GET] Homepage: Status ${home.statusCode} - ${home.statusCode === 200 ? 'SUCCESS' : 'FAILED'}`);
    if (home.body.includes('I DON\'T JUST WRITE CODE. I BUILD SOLUTIONS.')) {
      console.log("  ✔ Homepage contains about heading");
    } else {
      console.log("  ✘ Homepage heading check failed");
    }

    // 2. Verify API Endpoints
    const apiEndpoints = [
      'profile',
      'about',
      'projects',
      'skills',
      'experience',
      'education',
      'services',
      'stats',
      'settings'
    ];

    for (const endpoint of apiEndpoints) {
      const res = await get(`http://localhost:3000/api/${endpoint}`);
      console.log(`[GET] /api/${endpoint}: Status ${res.statusCode} - ${res.statusCode === 200 ? 'SUCCESS' : 'FAILED'}`);
      if (res.statusCode === 200) {
        try {
          const parsed = JSON.parse(res.body);
          const keys = Object.keys(parsed);
          console.log(`  ✔ Valid JSON response (keys: ${keys.join(', ')})`);
          if (endpoint === 'projects') {
            console.log(`  ✔ Found ${parsed.projects?.length || 0} projects`);
          }
        } catch (e) {
          console.log(`  ✘ Failed to parse JSON response: ${e.message}`);
        }
      }
    }

    // 3. Verify Contact Form Submission
    const testMessage = {
      name: "Antigravity Verification Test",
      email: "antigravity@test.com",
      subject: "Test submission from verification agent",
      message: "Hello Prakash, this is an automated verification of the contact form for Phase 3."
    };

    const submitRes = await post('http://localhost:3000/api/messages', testMessage);
    console.log(`[POST] /api/messages: Status ${submitRes.statusCode} - ${submitRes.statusCode === 200 ? 'SUCCESS' : 'FAILED'}`);
    if (submitRes.statusCode === 200) {
      console.log("  ✔ Message submitted successfully!");
      console.log("  Response body:", submitRes.body);
    } else {
      console.log("  ✘ Message submission failed");
      console.log("  Response body:", submitRes.body);
    }

  } catch (err) {
    console.error("Test execution exception:", err);
  }
}

runTests();
