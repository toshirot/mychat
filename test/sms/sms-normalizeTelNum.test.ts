import { initDB, isSendingAllowed, insertTel, normalizeTelNum, chkTelLen } from '../../src/utils';
import { describe, expect, it } from 'bun:test'



describe('SMSをテストする', () => {
	it('電話番号のハイフンを除去できるか', () => {
		const expecttel = "12345678901"
		const result = normalizeTelNum("123-4567-8901")
		expect(expecttel).toEqual(result)
	})
    it('電話番号の空白を除去できるか', () => {
		const expecttel = "12345678901"
		const result = normalizeTelNum("123 4567 8901 ")
		expect(expecttel).toEqual(result)
	})
    it('電話番号の英数を除去できるか', () => {
		const expecttel = "12345678901"
		const result = normalizeTelNum("123a4567B8901cc")
		expect(expecttel).toEqual(result)
	})
    it('電話番号の記号を除去できるか', () => {
		const expecttel = "12345678901"
		const result = normalizeTelNum("123_4567&8901%%")
		expect(expecttel).toEqual(result)
	})
	it('電話番号12345678901は11桁か', () => {
		const expecttel = "12345678901"
		const expectValue = true
		const result = chkTelLen(expecttel)
		expect(expectValue).toEqual(result)
	})
	it('電話番号123456は11桁か', () => {
		const expecttel = "123456"
		const expectValue = false
		const result = chkTelLen(expecttel)
		expect(expectValue).toEqual(result)
	})
})

