import { describe, expect, it } from 'bun:test'

describe('ブラウザDOM/ テスト by happy-dom', () => {
    it("ボタンテキストをDOMでセットする", () => {
        document.body.innerHTML = `<button>My button</button>`;
        const button = document.querySelector("button");
        expect(button?.innerText).toEqual("My button");
    })
})