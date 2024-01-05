import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia';

const parseSetCookies = (headers: Headers, setCookie: string[]) => {
	if (!headers || !Array.isArray(setCookie)) return headers

	headers.delete('Set-Cookie')

	for (let i = 0; i < setCookie.length; i++) {
		const index = setCookie[i].indexOf('=')

		headers.append(
			'Set-Cookie',
			`${setCookie[i].slice(0, index)}=${setCookie[i].slice(index + 1)}`
		)
	}

	return headers
}
describe('Parse Set Cookie', () => {
	it('空の配列を処理する必要がある', () => {
		const headers = new Headers([])
		const setCookie: string[] = []
		const result = parseSetCookies(headers, setCookie)
		expect(result).toEqual(headers)
	})

	it('1つの要素に1つのキーと値のペアが含まれるsetCookie配列を処理する必要があります', () => {
		const headers = new Headers([])
		const setCookie = ['key=value']
		const result = parseSetCookies(headers, setCookie)
		expect(result.get('Set-Cookie')).toEqual('key=value')
	})

	it('複数の要素を持つ setCookie 配列を処理する必要があります', () => {
		const headers = new Headers([])
		const setCookie = ['key1=value1', 'key2=value2']
		const result = parseSetCookies(headers, setCookie)
		expect(result.get('Set-Cookie')).toEqual('key1=value1, key2=value2')
	})

	it('複数のキーと値のペアを含む1つの要素を持つ setCookie 配列を処理する必要があります', () => {
		const headers = new Headers([])
		const setCookie = ['key1=value1; key2=value2']
		const result = parseSetCookies(headers, setCookie)
		expect(result.get('Set-Cookie')).toEqual('key1=value1; key2=value2')
	})

	it('複数の要素を持つ setCookie 配列を処理する必要があり、それぞれが複数のキーと値のペアを含む ', () => {
		const headers = new Headers([])
		const setCookie = [
			'key1=value1; key2=value2',
			'key3=value3; key4=value4'
		]
		const result = parseSetCookies(headers, setCookie)
		expect(result.get('Set-Cookie')).toEqual(
			'key1=value1; key2=value2, key3=value3; key4=value4'
		)
	})

	it('null 値を処理する必要があります', () => {
		const headers = null
		const setCookie = null
		// @ts-ignore
		const result = parseSetCookies(headers, setCookie)
		expect(result).toBeNull()
	})
})