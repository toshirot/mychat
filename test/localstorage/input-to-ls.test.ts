// bun add -d @happy-dom/global-registrator
//import { Elysia } from 'elysia';
import { describe, expect, it, test } from 'bun:test'

const Passphrase = "thisismyPass";

const getLS = () :string=> JSON.parse(localStorage.getItem(Passphrase) || '[]')
const setLS = (str:string) => {
  localStorage.setItem(Passphrase, JSON.stringify(str))
}

describe('LocalStorage', () => {
    it('LocalStorageにセットしてからデータを取り出す', () => {
	  // ローカルストレージにセットする
	  setLS(Passphrase)
      expect(getLS()).toStrictEqual(Passphrase)
    })


})
// ポート
/*
const PORT = 9017;
const URL = `http://74.226.208.203:${PORT}/`;


const app = new Elysia()
   // .use(html())
    .get('/', () =>  {
        return `
        <input type="password" id="pass" name="pass" value="${Passphrase}">
        <script>
		localStorage.setItem('pass', pass.value);
		localStorage.getItem('pass');
		</script>
        `

    })
    .listen(PORT)

describe('AESによる暗号化と復号化', () => {
	it('AESで暗号化したものを復号化したら同じになる', async () => {
		const response = await fetch(URL);
		const html = await response.text(); 

		console.log(html)
		//expect(decryptedMsg).toEqual(testMsg)
	})

})



describe('ブラウザ DOM テスト', () => {
    it("ボタンテキストをDOMでセットする", () => {
        document.body.innerHTML = `
        <input type="password" id="pass" name="pass" value="${Passphrase}">
        <script>
            localStorage.setItem('pass',"thisismyPass");
        </script>
        `;
        const pass = localStorage.getItem('pass');
        expect(pass).toEqual("thisismyPass");
    })
})
*/
