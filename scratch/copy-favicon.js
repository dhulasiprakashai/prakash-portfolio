const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\vinitha\\.gemini\\antigravity-ide\\brain\\8c3ad794-7d0c-4532-9232-dd7ec789fd6c\\favicon_1787657143537.jpg";
const dest = "E:\\Prakash-Portfolio\\public\\favicon.ico";

try {
  fs.copyFileSync(src, dest);
  console.log("Successfully copied favicon!");
} catch (err) {
  console.error("Failed to copy favicon:", err);
}
