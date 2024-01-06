import { describe, expect, it } from 'bun:test'
import sanitize from 'sanitize-filename';

const dirtyStr = 'ああああああああ<script>ああああ</script>あああ<!<!---- comment ---->>ああああ<script>alert(1)</script foo="bar">ああ<!--ddddd-->ああああ'
const expected = 'ああああああああscriptああああscriptあああ!!---- comment ----ああああscriptalert(1)script foo=barああ!--ddddd--ああああ'

describe('サニタイズ', () => {
	it('script要素とコメントを除去する', () => {
		const result = sanitize(dirtyStr)
		console.log(result)
		expect(result).toEqual(expected)
	})
})