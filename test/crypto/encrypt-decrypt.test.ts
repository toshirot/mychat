import { describe, expect, it } from 'bun:test'
import CryptoJS from 'crypto-js';

const testMsg = 
`むかしむかしあるところにおじさんとおばさんが住んでいました
むかしむかしあるところにおじさんとおばさんが住んでいました
むかしむかしあるところにおじさんとおばさんが住んでいました`;
const Passphrase = "thisismysalt";

describe('AESによる暗号化と復号化', () => {
	it('AESで暗号化したものを復号化したら同じになる', () => {

		const encryptedMsg = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(testMsg), Passphrase).toString();
		const decryptedMsg = CryptoJS.AES.decrypt(encryptedMsg, Passphrase).toString(CryptoJS.enc.Utf8);
		expect(decryptedMsg).toEqual(testMsg)
	})

})