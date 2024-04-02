import { describe, expect, it } from 'bun:test'
import sanitize from 'sanitize-filename';

const dirtyStr = 'ああああああああ<script>ああああ</script>あああ<!<!---- comment ---->>ああああ<script>alert(1)</script foo="bar">ああ<!--ddddd-->ああああ'
const expected = 'ああああああああscriptああああscriptあああ!!---- comment ----ああああscriptalert(1)script foo=barああ!--ddddd--ああああ'

const dirtyStr2 = `ああああああああ<script>ああああ</script>あああ<!<!---- comment ---->>ああああ<script>alert(1)</script foo="bar">ああ

<!--ddddd-->ああああ`
const expected2 = `あああああああああああ>ああああああ

ああああ`

describe('サニタイズ', () => {
	it('script要素とコメントを除去する', () => {
		const result = sanitize(dirtyStr)
		console.log(result)
		expect(result).toEqual(expected)
	})
	it('改行のあるコメントの改行を残してサニタイズする', () => {
		const result2 = sanitize_recive(sanitize_send(dirtyStr2))
		console.log(result2)
		expect(result2).toEqual(expected2)
	})
})

// 送信用サニタイズ
const sanitize_send = (str) => {
    str=(str+'').replace(/\\n/g, '-r-n%n-r-')
    return DOMPurify.sanitize(str)
}
// 受信用サニタイズ
const sanitize_recive = (str) => {
    str=str.replace(/-r-n%n-r-/g, '<br />')
    return DOMPurify.sanitize(str)
}