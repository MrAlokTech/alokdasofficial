#!/usr/bin/env node

/**
 * admin-ice.js — Family Emergency (ICE) Admin CLI Tool
 * Used by family owner to generate secret tokens, encrypt person data locally,
 * and push encrypted payloads directly to Cloudflare KV using Wrangler.
 *
 * Usage:
 *   node scripts/admin-ice.js generate-token
 *   node scripts/admin-ice.js encrypt --key="YOUR_32BYTE_KEY" --input="person.json"
 *   node scripts/admin-ice.js decrypt --key="YOUR_32BYTE_KEY" --input="encrypted.json"
 *   node scripts/admin-ice.js sample
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Command line parsing
const args = process.argv.slice(2);
const command = args[0];

function parseFlags() {
  const flags = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, val] = arg.slice(2).split('=');
      flags[key] = val || true;
    }
  });
  return flags;
}

const flags = parseFlags();

// Helper to generate AES-256 key
function deriveAesKey(secretStr) {
  if (/^[0-9a-fA-F]{64}$/.test(secretStr)) {
    return Buffer.from(secretStr, 'hex');
  }
  return crypto.createHash('sha256').update(secretStr).digest();
}

// Encrypt payload using AES-256-GCM
function encrypt(dataObj, secretStr) {
  const key = deriveAesKey(secretStr);
  const iv = crypto.randomBytes(12); // 96-bit IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const jsonStr = JSON.stringify(dataObj);
  let ciphertext = cipher.update(jsonStr, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const authTag = cipher.getAuthTag();

  // Combine authTag into ciphertext buffer for standard WebCrypto GCM compatibility
  const cipherBuffer = Buffer.from(ciphertext, 'base64');
  const fullCipherBuffer = Buffer.concat([cipherBuffer, authTag]);

  return {
    iv: iv.toString('base64'),
    ciphertext: fullCipherBuffer.toString('base64')
  };
}

// Decrypt payload using AES-256-GCM
function decrypt(envelope, secretStr) {
  const key = deriveAesKey(secretStr);
  const iv = Buffer.from(envelope.iv, 'base64');
  const fullBuffer = Buffer.from(envelope.ciphertext, 'base64');

  // Last 16 bytes are GCM Auth Tag
  const authTag = fullBuffer.slice(fullBuffer.length - 16);
  const cipherTextBuffer = fullBuffer.slice(0, fullBuffer.length - 16);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherTextBuffer, 'binary', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

// -------------------------------------------------------------
// CLI Actions
// -------------------------------------------------------------

switch (command) {
  case 'generate-token': {
    const token = crypto.randomBytes(20).toString('hex'); // 40 chars hex
    console.log('\n==================================================');
    console.log('🔑 New Secret Person Token Generated:');
    console.log(`Token: ${token}`);
    console.log(`Secret URL: https://alokdasofficial.in/ice/${token}`);
    console.log('==================================================\n');
    break;
  }

  case 'sample': {
    const samplePerson = {
      person: {
        fullName: "Alok Das",
        dateOfBirth: "1998-05-15",
        bloodType: "O+",
        primaryLanguage: "English / Hindi",
        photoUrl: ""
      },
      emergencyContacts: [
        { name: "Primary Family Contact", relationship: "Parent / Spouse", phone: "+919876543210", priority: 1 },
        { name: "Secondary Family Contact", relationship: "Sibling", phone: "+919876543211", priority: 2 }
      ],
      medical: {
        allergies: ["Penicillin", "Peanuts"],
        medicalConditions: ["Asthma"],
        medications: ["Albuterol Inhaler"],
        medicalNotes: "Wears medical alert bracelet. Keep inhaler nearby in case of respiratory distress."
      },
      homeAddress: {
        street: "123 Main Street, Sector 4",
        city: "Bhubaneswar",
        state: "Odisha",
        postalCode: "751001",
        country: "India"
      },
      physicianDetails: {
        name: "Dr. S. K. Sharma",
        clinic: "City Hospital",
        phone: "+916742555555"
      },
      insuranceDetails: {
        provider: "Star Health Insurance",
        policyNumber: "SH-99281726"
      }
    };
    const samplePath = path.join(process.cwd(), 'sample-person.json');
    fs.writeFileSync(samplePath, JSON.stringify(samplePerson, null, 2));
    console.log(`\n✅ Sample person data template written to: ${samplePath}`);
    break;
  }

  case 'encrypt': {
    const key = flags.key || process.env.DATA_ENCRYPTION_KEY;
    const inputPath = flags.input;
    const token = flags.token || crypto.randomBytes(20).toString('hex');

    if (!key) {
      console.error('❌ Error: --key="YOUR_KEY" or DATA_ENCRYPTION_KEY environment variable required.');
      process.exit(1);
    }
    if (!inputPath || !fs.existsSync(inputPath)) {
      console.error('❌ Error: --input="file.json" is required and must exist.');
      process.exit(1);
    }

    const dataObj = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const envelope = encrypt(dataObj, key);

    console.log('\n==================================================');
    console.log('🔒 Encrypted KV Envelope Created:');
    console.log(`Token: ${token}`);
    console.log(`URL:   https://alokdasofficial.in/ice/${token}`);
    console.log('--------------------------------------------------');
    console.log('Run this Wrangler command to deploy to Cloudflare KV:\n');
    console.log(`npx wrangler kv key put --remote --binding=ICE_KV "ice:person:${token}" '${JSON.stringify(envelope)}'`);
    console.log('==================================================\n');
    break;
  }

  case 'decrypt': {
    const key = flags.key || process.env.DATA_ENCRYPTION_KEY;
    const inputPath = flags.input;

    if (!key || !inputPath || !fs.existsSync(inputPath)) {
      console.error('❌ Usage: node scripts/admin-ice.js decrypt --key="KEY" --input="encrypted.json"');
      process.exit(1);
    }

    const envelope = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const decrypted = decrypt(envelope, key);
    console.log('\n🔓 Decrypted Data Payload:');
    console.log(JSON.stringify(decrypted, null, 2));
    break;
  }

  default: {
    console.log(`
Usage:
  node scripts/admin-ice.js generate-token
  node scripts/admin-ice.js sample
  node scripts/admin-ice.js encrypt --key="SECRET_KEY" --input="person.json" [--token="CUSTOM_TOKEN"]
  node scripts/admin-ice.js decrypt --key="SECRET_KEY" --input="encrypted.json"
    `);
  }
}
