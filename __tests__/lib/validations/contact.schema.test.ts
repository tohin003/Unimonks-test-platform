import assert from 'node:assert/strict'
import test from 'node:test'

import { CreateLeadContactSchema } from '../../../lib/validations/contact.schema'

test('CreateLeadContactSchema accepts email-only leads', () => {
    const parsed = CreateLeadContactSchema.parse({
        name: 'Alice Lead',
        email: ' alice@example.com ',
        phone: '   ',
    })

    assert.deepEqual(parsed, {
        name: 'Alice Lead',
        email: 'alice@example.com',
        phone: undefined,
    })
})

test('CreateLeadContactSchema accepts phone-only leads', () => {
    const parsed = CreateLeadContactSchema.parse({
        name: 'Bob Lead',
        phone: '+91 98765 43210',
    })

    assert.equal(parsed.name, 'Bob Lead')
    assert.equal(parsed.phone, '+91 98765 43210')
    assert.equal(parsed.email, undefined)
})

test('CreateLeadContactSchema rejects leads without any contact method', () => {
    const result = CreateLeadContactSchema.safeParse({
        name: 'Charlie Lead',
        email: '   ',
        phone: '   ',
    })

    assert.equal(result.success, false)
    if (result.success) return

    assert.equal(result.error.issues.some((issue) => issue.message === 'Email or phone is required'), true)
})

test('CreateLeadContactSchema rejects invalid phones', () => {
    const result = CreateLeadContactSchema.safeParse({
        name: 'Dana Lead',
        phone: '12345',
    })

    assert.equal(result.success, false)
})
