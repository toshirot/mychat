import { describe, expect, it } from 'bun:test'
import crypto from 'crypto';

const testMsg = 
`むかしむかしあるところにおじさんとおばさんが住んでいました
むかしむかしあるところにおじさんとおばさんが住んでいました
むかしむかしあるところにおじさんとおばさんが住んでいました`;

// 注意: あらかじめ環境変数に設定しておく
// $ export PASS_PHRASE="mypassphrase"
const PASS_PHRASE = process.env.PASS_PHRASE

describe('AESによる暗号化と復号化 by crypto', () => {
	it('crypto の AES で暗号化したものを復号化したら同じになる', () => {
		// 暗号化
		const crypted_text = encrypt(testMsg, PASS_PHRASE)
		// 復号化
		const decrypted_text = decrypt(crypted_text, PASS_PHRASE)
		expect(decrypted_text).toEqual(testMsg)
	})
})

function encrypt(text: string, password: string) {
  const cipher = crypto.createCipher('aes-256-cbc', password)
  const crypted = cipher.update(text, 'utf-8', 'hex')
  return crypted + cipher.final('hex')
}
function decrypt(text: string, password: string) {
  const decipher = crypto.createDecipher('aes-256-cbc', password)
  const decrypted = decipher.update(text, 'hex', 'utf-8')
  return decrypted + decipher.final('utf-8')
}