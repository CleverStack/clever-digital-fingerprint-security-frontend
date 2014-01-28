# Cleverstack Digital Fingerprint Security Module

This module provides digital fingerprint security for your web application.

## Dependencies
This module requires the [cleverstack backend digital fingerprint security module](https://github.com/clevertech/clever-digitial-fingerprint-security-backend/) to be installed.

## Setup
1. Add 'cs_digitalfingerprint' to your app/modules/main.js file.
It belongs in the `package` array at the top.

2. Add `cs_digitalfingerprint` to your app/modules/application/main.js file.
It belongs in the array of required modules.

3. Add `cs_digitalfingerprint` to your app/modules/application/module.js file.
`cs_digitalfingerprint` belongs in your `app` module's array of required modules.

## Usage
Go to /dflogin (or integrate with main login form)

## Diagram
![Digital Fingerprint Security](/assets/digital-fingerprint-diagram.jpg "Digital Fingerprint Security")
