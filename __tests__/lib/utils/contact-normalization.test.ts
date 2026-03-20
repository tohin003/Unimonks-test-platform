import assert from 'node:assert/strict'
import test from 'node:test'

import {
    isValidPhoneNumber,
    normalizeEmail,
    normalizeOptionalEmail,
    normalizeOptionalPhone,
    normalizePhone,
} from '../../../lib/utils/contact-normalization'

test('normalizeEmail trims and lowercases emails', () => {
    assert.equal(normalizeEmail('  Student@Example.COM  '), 'student@example.com')
})

test('normalizeOptionalEmail returns null for blank values', () => {
    assert.equal(normalizeOptionalEmail('   '), null)
    assert.equal(normalizeOptionalEmail(undefined), null)
})

test('normalizePhone removes formatting characters and unifies 00-prefixed international numbers', () => {
    assert.equal(normalizePhone('+91 98765-43210'), '919876543210')
    assert.equal(normalizePhone('0091 (98765) 43210'), '919876543210')
})

test('normalizeOptionalPhone returns null for blank values', () => {
    assert.equal(normalizeOptionalPhone('   '), null)
    assert.equal(normalizeOptionalPhone(null), null)
})

test('isValidPhoneNumber enforces the shared digit-length bounds', () => {
    assert.equal(isValidPhoneNumber('9876543210'), true)
    assert.equal(isValidPhoneNumber('+1 202-555-0142'), true)
    assert.equal(isValidPhoneNumber('12345'), false)
})
