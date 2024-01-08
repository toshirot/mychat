import { describe, expect, it } from 'bun:test'
import CryptoJS from 'crypto-js';

const testMsg = 
`むかしむかしあるところにおじさんとおばさんが住んでいました
むかしむかしあるところにおじさんとおばさんが住んでいました
むかしむかしあるところにおじさんとおばさんが住んでいました`;

// 注意: あらかじめ環境変数に設定しておく
// $ export PASS_PHRASE="mypassphrase"
const PASS_PHRASE = process.env.PASS_PHRASE

describe('AESによる暗号化と復号化 by crypto-js', () => {
	it('crypto-js の AES で暗号化したものを復号化したら同じになる', () => {
		const encryptedMsg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(testMsg), PASS_PHRASE).toString();
		const decryptedMsg = CryptoJS.AES.decrypt(encryptedMsg, PASS_PHRASE).toString(CryptoJS.enc.Utf8);
		expect(decryptedMsg).toEqual(testMsg)
	})
})