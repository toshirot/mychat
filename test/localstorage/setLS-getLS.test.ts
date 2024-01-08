// e.g. see happy-dom https://bun.sh/guides/test/happy-dom
// bun add -d @happy-dom/global-registrator
// 
import { describe, expect, it, test } from 'bun:test'
import crypto from 'crypto';
 
const getLS = (key:any):any => JSON.parse(localStorage.getItem(key) || '[]')
const setLS = (key:any, val:any):any => {
  localStorage.setItem(key, JSON.stringify(val))
}

describe('ブラウザDOM/ LocalStorage', () => {
    test('LocalStorageにセットしてからデータを取り出す', () => {
        // 実際には thisismyPass を平文むき出しにしない
        const Passphrase = "thisismyPass";
        // ローカルストレージにセットする
        setLS('pass', Passphrase)
        // 比較する
        expect(getLS('pass')).toStrictEqual(Passphrase)
    })

    test('input要素からLocalStorageにセットしてデータを取り出す', () => {
        // 実際には thisismyPass を平文むき出しにしない
        const Passphrase = "thisismyPass";
        document.body.innerHTML = `
            <input type="password" id="pass" name="pass" value="${Passphrase}">
            <script>
                localStorage.setItem('pass', encrypt(pass.value));
            </script>
        `
        // input要素からローカルストレージにセットする
        setLS('pass', document.getElementById('pass')?.value)
        // 比較する
        expect(getLS('pass')).toStrictEqual(Passphrase)
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
