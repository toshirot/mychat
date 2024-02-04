//===========================================
// タイムゾーンを変更する e.g. UTC -> JST 
//  @param {Object} date - Date インスタンス
//  @param {Number} adjustHour - 調整する時間数 e.g. -9 | +9
//  @returns {string} - 時間の文字列 e.g. '2023-12-22 09:59'
export function adjustHours(date: Date, adjustHour: number): string {
  if(date instanceof Date === false)date=new Date(date)
  date.setHours(date.getHours() + adjustHour)
  return date.toLocaleString(
      ["ja-JP"], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
}

//===========================================
// 各種登録用の関数
//  @returns {String} - HTML文字列
export function regBox_1(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=regBox_2('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>${CHAT_NAME}/ 設定1</h2>
            </div>
            <div class="my_tel_title">
            ご自身の携帯電話番号を<br />入力・登録してください
            </div>
            <input type="text" id="input_my_tel" class="input_tel" placeholder="" />
            <br />
            <button id="btn_my_tel_send" type="button" 
              onclick=" event.preventDefault();
              input_my_tel.value = input_my_tel.value||getCookie('mytel')||'';
              setCookie('mytel', input_my_tel.value);
              console.log(input_my_tel.value)
              const response = fetch('http://'+location.host+'/api/sms-code/', {
                method: 'POST',
                body: JSON.stringify({ tel: input_my_tel.value }),
                headers: { 'Content-Type': 'application/json' },
              })
              .then((response) =>  {
                  window.contact.innerHTML=regBox_2('${CHAT_NAME}', '${VERSION}', '${uid}');
              });" 
               />
            登録
            </button>
        </div>
    </form>`
}
//===========================================
// 各種登録用の関数
//  @returns {String} - HTML文字列
export function regBox_2(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>${CHAT_NAME}/ 設定2</h2>
            </div>
            <div class="my_secu_title">
            届いたセキュリティコードを<br />入力してください
            </div>
            <input type="tel" id="input_my_secu" class="input_tel" maxlength="4"  max="4" placeholder="セキュリティコード" onload="this.focus()"
                    onkeyup="if(this.value.length===4){ }"
            />
            <br />
            <div class="info">
            <br />
            ※セキュリティコードが届かないときは、
            <button onclick="window.contact.innerHTML=regBox_1('${CHAT_NAME}', '${VERSION}', '${uid}')" >戻る</button>
            で携帯番号を確認して再送してみてください
            </div>
        </div>
    </form>`
}
//===========================================
// パスフレーズ登録用の関数
//  @returns {String} - HTML文字列
export function regBox_3(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>${CHAT_NAME}</h2>
            </div>
            <div class="my_tel_title">
            貴方の電話番号
            </div>
            <input type="text" id="input_my_tel" class="input_tel" placeholder="" />
            <button id="btn_my_tel_send"  class="input_tel" type="submit">
            送信
            </button>
            <div class="to_tel_title">
            接続したい相手の電話番号
            </div>
            <button id="btn_to_tel_send" class="input_tel"  type="submit">
            送信
            </button>
            <input type="text" id="input_to_tel" class="input_tel" placeholder="" /><br />
            <div class="pass_title">
            パスフレーズ<span style="font-size:1.2rem;vertical-align: middle;"> (半角英数字8文字以上) </span>
            </div>
            <input type="password" id="input_pass" /><br />
            <div class="pass"></div>
            <button id="btn_send" type="submit">
            登録
            </button>
        </div>
    </form>`
}
//===========================================
// メッセージ入力用の関数
//  @returns {String} - HTML文字列
export function inputBox(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="input_box">
        <div class="head">
            <img id="config" src="/public/img/config-icon.png" 
            alt="config" width="40" height="40" 
            onclick="window.contact.innerHTML=regBox_1('${CHAT_NAME}', '${VERSION}')" />
            <h2>${CHAT_NAME} v${VERSION} </h2>
        </div>
        <div class="name_title">
        名前
        </div>
        <input type="text" id="input_name" uid="${uid}" placeholder="名前を入れてください" /><br />
        <div class="msg_title">
        メッセージ
        </div>
        <textarea id="input_msg" placeholder="メッセージを入力してください"></textarea><br />
        <div class="message">送信</div>
        <button id="btn_send" type="submit">
        送信
        </button>
        </div>
    </form>
    
    <ul safe id=msgs></ul>
    `
}

//===========================================
// cookieを読み出す関数
//  @param {String} key - キー文字列
//  @returns {String} - cookieの値文字列
export function getCookie(key: string) {
    let regex = new RegExp('(?:^|;)\\s*' + key + '=([^;]+)');
    return decodeURIComponent(document.cookie.match(regex)?.[1] || '');
}
//===========================================
// cookieをセットする関数
//  @param {String} key - キー文字列
//  @param {String} value - value
//  @returns {String} - セットした cookie の key value 文字列
//  有効期限やドメインなどをどうするかはあとで検討
export function setCookie(key: string, value: string):string{
    return document.cookie=key+'='+encodeURIComponent(value)+''
}


//===========================================
// 画像dataの有無
// 
export function hasDataImg(wkmsg: string): boolean{
    let urlRegEx = /^(.*)(data:image\/[a-z]+;base64.*)/i
    let reg=wkmsg.match(urlRegEx)
    //alert('test',reg)
    if (reg){
        return true
    } else {
        return false
    }
}
//===========================================
// 画像dataを img 要素
// 
export function dataImgWrap2Img(wkmsg: string): string {
    // 画像data抽出用正規表現 
    //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAABWCAYAAACHKqnqAAADLElEQVR4Ae3cQU7bQBgF4Jw23CCnLHcgKa7oBhaRotBFXBlpIjCTEbOJn6UPKXI8Y4nX759HYNPN6GtVAqfTaTwcfo/7/cFrQYPNqk6NsB8C7
    let urlRegEx = /^(.*)(data:image\/[a-z]+;base64,.*)/i
    let tolink = "<img src='$2' style=max-width:50%;>"
    let reg=wkmsg.match(urlRegEx)
    // マッチしたすべてのurl文字列を img要素でラップする
    if (reg){
        wkmsg = wkmsg.replace(urlRegEx, tolink)
        console.log('this is img data.')
    }
    return wkmsg
}
//===========================================
// 画像urlを img 要素に変換する
// 
export function urlWrap2Img(wkmsg: string): string {
    // 画像文字列抽出用正規表現 gで複数にマッチする
    let urlRegEx = /^(.*)(https.*\.(jpg|jpeg|gif|png|bmp))(.*)$/i,
    tolink = "$1<a target='_blank' href='$2'><img src='$2' style=max-width:480px;></a>$4<div style=font-size:0.7rem>$2</div>"
    
    // match
    let reg=wkmsg.match(urlRegEx)

    // マッチしたすべてのurl文字列を img要素でラップする
    if (reg){
        wkmsg = wkmsg.replace(urlRegEx, tolink)
    }
    //console.log('2222 urlWrap2Img:',urlRegEx, wkmsg)
    return wkmsg;
}
//===========================================
// urlをlink Element に変換する
// 
export function urlWrap2Link(wkmsg: string): string {
    let lists=[]
    let mobile=('touchstart' in window);
    let target='_blank';
    if(mobile){
        target='_self';
    }
    let imgRegEx=/\.(jpg|jpeg|gif|png|bmp)$/i
    // url文字列抽出用正規表現 gで複数にマッチする
    let urlRegEx = /(s?https?:\/{2,}[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g,
        tolink = "<a href='$1'>$1</a>"
    
    if(wkmsg.match(imgRegEx)){
        console.log('this is img.')
        return wkmsg;
    }
    // match
    lists=wkmsg.match(urlRegEx)

    // マッチしたすべてのurl文字列を a要素でラップする
    if (wkmsg.match(urlRegEx)){
        wkmsg = wkmsg.replace(urlRegEx, tolink)
    }

    return wkmsg;
}

