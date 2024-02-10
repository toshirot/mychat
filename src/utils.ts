
//===========================================
// telを保存して同じtel番号の連続送信を防ぐ
//  @param {String} tel - tel番号
// ・30秒以内に同じtel番号があればfalseを返す/インターバル30秒置かないと発信できない
// ・5分以内に同じtel番号が5件あればfalseを返す/5分間に5回以上発信できない
import { Database } from 'bun:sqlite';
/**
isSendingAllowed(tel, (result) => {
    if (result) {
        console.log('Sending is allowed');
    }
}); 
*/
// データベース初期化とテーブル作成
function initializeDatabase(): Database {
    const SMS_DB_FILE_NAME = './db/SMS.sqlite';
    const SMS_TABLE_NAME = 'sms_table_name';
    const db = new Database(SMS_DB_FILE_NAME, { create: true });
    db.exec('PRAGMA journal_mode = WAL;');

    db.exec(`CREATE TABLE IF NOT EXISTS ${SMS_TABLE_NAME} (
        id INTEGER PRIMARY KEY, 
        tel VARCHAR(11), 
        created_at TIMESTAMP
    )`);

    return db;
}



function getRecentCount(db: Database): Promise<number> {
    return new Promise((resolve, reject) => {
        db.exec(`
            SELECT COUNT(*) AS recent_count
            FROM sms_table_name
            ORDER BY created_at DESC
            LIMIT 5
        `, (err, row) => {
            if (err) {
                console.error(err.message);
                reject(0);
            } else {
                resolve(row ? row.recent_count : 0);
            }
        });
    });
}
// 直近の同じ電話番号の送信履歴を取得
/*
function getRecentCount(db: Database, tel: string): Promise<number> {
    return new Promise((resolve, reject) => {
        db.exec(`
            SELECT COUNT(*) AS recent_count
            FROM sms_table_name
            WHERE tel = ?
            ORDER BY created_at DESC
            LIMIT 5
        `, [tel], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(0);
            } else {
                resolve(row ? row.recent_count : 0);
            }
        });
    });
}*/

// 最後の送信履歴からの経過時間を取得
function getTimeDiff(db: Database, tel: string): Promise<number> {
    return new Promise((resolve, reject) => {
        db.exec(`
            SELECT strftime('%s', 'now') - strftime('%s', MAX(created_at)) AS time_diff
            FROM sms_table_name
            WHERE tel = ?
        `, [tel], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(0);
            } else {
                resolve(row ? row.time_diff : 0);
            }
        });
    });
}

// データベースをクローズ
function closeDatabase(db: Database): void {
    db.close();
}

export async function isSendingAllowed(tel: string): Promise<boolean> {
    try {
        console.log('tel', tel);
        tel = tel.replace(/[^0-9a-zA-Z]/g, '');

        const db = initializeDatabase();
        
        const recentCount = await getRecentCount(db, tel);
        console.log( recentCount)
        
        if (recentCount === 5) {
            const timeDiff = await getTimeDiff(db, tel);
            console.log(recentCount, timeDiff);

            if (timeDiff < 300) { // 5 minutes = 300 seconds
                closeDatabase(db);
                return false;
            }
        }

        closeDatabase(db);
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// 電話番号をセットする関数
function setPhoneNumber(tel: string): Promise<void> {
    return new Promise((resolve) => {
        // ここで電話番号のセットやバリデーションを行う
        // 例: tel = tel.replace(/[^0-9a-zA-Z]/g, '');

        // 電話番号をセットした後、resolve() でPromiseを完了させる
        resolve();
    });
}

// 関数を呼び出す
setPhoneNumber("123-456-7890");

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
                <h2>自身の携帯番号</h2>
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
                <h2>認証</h2>
            </div>
            <div class="my_secu_title">
            届いたセキュリティコードを<br />入力してください
            </div>
            <input type="tel" id="input_my_secu" class="input_tel" 
                maxlength="4"  
                max="4" placeholder="セキュリティコード" autofocus />
            <button id="btn_my_tel_send" type="button" 
            onclick=" 
                event.preventDefault();
                const response = fetch('http://'+location.host+'/api/sec/', {
                    method: 'POST',
                    body: JSON.stringify({ sec: input_my_secu.value }),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then((response) =>  {
                    window.contact.innerHTML=regBox_3('${CHAT_NAME}', '${VERSION}', '${uid}');
                });" 
             />
          登録
          </button>
            <br />
            <div class="info">
            <br />
            ※もしセキュリティコードが届かないときは、
            <button
                style="background: #dcced6; border: 1px solid #dcced6; padding: 5px; margin: 5px;"
                onclick="window.contact.innerHTML=regBox_1('${CHAT_NAME}', '${VERSION}', '${uid}')" >戻る</button>
            で携帯番号を確認して再送してみてください
            </div>
        </div>
    </form>`
}
//===========================================
// 相手の携帯番号登録用の関数
//  @returns {String} - HTML文字列
export function regBox_3(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>相手の携帯番号</h2>
            </div>
            <div class="to_tel_title">
            接続したい相手の携帯番号
            <input type="text" id="input_to_tel" class="input_tel" placeholder="" autofocus /><br />
            </div>
            <button id="btn_to_tel_send" type="submit" type="button" 
            onclick=" 
                event.preventDefault();
                const response = fetch('http://'+location.host+'/api/sec/', {
                    method: 'POST',
                    body: JSON.stringify({ sec: input_my_secu.value }),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then((response) =>  {
                    window.contact.innerHTML=regBox_4('${CHAT_NAME}', '${VERSION}', '${uid}');
                });" 
             />
          登録
          </button>

        </div>
    </form>`
}
//===========================================
// パスフレーズ登録用の関数
//  @returns {String} - HTML文字列
export function regBox_4(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>パスフレーズ</h2>
            </div>
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

