// e.g. see happy-dom https://bun.sh/guides/test/happy-dom
// bun add -d @happy-dom/global-registrator
// 
import { describe, expect, it, test } from 'bun:test'

const getLS = (key:any):any => JSON.parse(localStorage.getItem(key) || '[]')
const setLS = (key:any, val:any):any => {
  localStorage.setItem(key, JSON.stringify(val))
}

describe('ブラウザDOM/ LocalStorage', () => {
    test('LocalStorageにセットしてからデータを取り出す', () => {
        const Passphrase = "thisismyPass";
        // ローカルストレージにセットする
        setLS('pass', Passphrase)
        // 比較する
        expect(getLS('pass')).toStrictEqual(Passphrase)
    })

    test('input要素からLocalStorageにセットしてデータを取り出す', () => {
        const Passphrase = "thisismyPass";
        document.body.innerHTML = `
            <input type="password" id="pass" name="pass" value="${Passphrase}">
            <script>
                localStorage.setItem('pass',"thisismyPass");
            </script>
        `
        // input要素からローカルストレージにセットする
        setLS('pass', document.getElementById('pass')?.value)
        // 比較する
        expect(getLS('pass')).toStrictEqual(Passphrase)
    })
})
