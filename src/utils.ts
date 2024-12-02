
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
      return `
              <div class="head">
                  <img id="config" src="/public/img/config-icon.png" 
                  alt="config" width="40" height="40" 
                  onclick="window.input_box.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                  <h1 style="float:none;color:#696565;font-size:2.2rem;">
                  ${CHAT_NAME} 秘密のフレーズ
                  </h1>
              </div>
              <div class="my_pass_title">
              相手と共有する<br />秘密のフレーズを入力してください
              <div style="font-size:12px;color:#000">※現在「test」を共通フレーズにしています</div>
              </div>
              <input type="text" id="input_my_pass" class="input_pass" placeholder=""
                oninput="event.preventDefault();setLocalStorage('mypass', this.value);"
              />
              <br />
              <button id="btn_my_pass_save" type="button" 
                onclick=" event.preventDefault();
                input_my_pass.value = input_my_pass.value||getLocalStorage('mypass')||'';
                setLocalStorage('mypass', input_my_pass.value);
                location.href=location.href
                //window.input_box.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}');
                //setTimeout(window.checkName(),500);
                " 
                 />
              デバイスだけに登録
              </button>
              <div style="font-size:1.2rem;">※サーバーには送りません</div>
      `
  }
  //===========================================
  // メッセージ入力用の関数
  //  @returns {String} - HTML文字列
  export function inputBox(CHAT_NAME: string, VERSION: string, uid: string): string{
      return `
          <div class="head">
              <img id="config" src="/public/img/config-icon.png" 
              alt="config" width="40" height="40" 
              onclick="window.input_box.innerHTML=regBox_1('${CHAT_NAME}', '${VERSION}', '${uid}')" />
              <h1>
              <a id=input_box_title_link href=http://`+location.host+`>${CHAT_NAME}
              <span id=mychat_version>v${VERSION}</span>
              </a>
              </h1>
          </div>
          <div class="name_title">
          名前
          </div>
          <input type="text" id="input_name" uid="${uid}" placeholder="名前を入れてください" /><br />
          <div class="msg_title">
          メッセージ
          </div>
          <div id="input_msg" class="textarea" contenteditable placeholder="メッセージを入力してください"></div>
          <div id="drop_area">
            <label for="file-input">
              <img src="/public/img/img-icon.svg?" alt="画像選択アイコン" class="img-icon">
            </label>
              
                <!-- imageファイル選択ボタン -->
                <input type="file" id="file-input" accept="image/*">
  
                <!--  videoファイル選択ボタン これはだめかもしれない
                  <label for="file-input-video">
                      <img src="/public/img/video-icon.svg?" alt="画像選択アイコン" class="video-icon">
                  </label>
                  <input type="file" id="file-input-video" accept="video/*">
                -->
          </div>
          <div class="message">送信</div>
          <button id="btn_send" type="submit">
          送信
          </button>
      `
  
  }
  
  //===========================================
  // LocalStorageから値を取得する関数
  // @param {String} key - キー文字列
  // @returns {String|null} - LocalStorageの値文字列。見つからない場合はnullを返す。
  export function getLocalStorage(key) {
      key=location.host+location.pathname+'_'+key
      return localStorage.getItem(key);
  }
  
  //===========================================
  // LocalStorageに値を設定する関数
  // @param {String} key - キー文字列
  // @param {String} value - value
  export function setLocalStorage(key, value) {
      key=location.host+location.pathname+'_'+key
      localStorage.setItem(key, value);
  }
  
  //===========================================
  // cookieを読み出す関数
  //  @param {String} key - キー文字列
  //  @returns {String} - cookieの値文字列
  export function getCookie(key: string) {
      key=location.host+location.pathname+'_'+key
      let regex = new RegExp('(?:^|;)\\s*' + key + '=([^;]+)');
      return decodeURIComponent(document.cookie.match(regex)?.[1] || '');
  }

  //===========================================
  // cookieをセットする関数
  //  @param {String} key - キー文字列
  //  @param {String} value - value
  //  @afterNdays {Number} - 有効期限日数
  //  @returns {String} - セットした cookie の key value 文字列
  //  有効期限やドメインなどをどうするかはあとで検討
  export function setCookie(key: string, value: string, afterNdays: number):string{
      let today=new Date().getTime()
      let nDaysLaterInMillis = ''
      let count =''
      key=location.host+location.pathname+'_'+key
      if(afterNdays){
        // n 日後のミリ秒を計算
        nDaysLaterInMillis = ';expires='+new Date(today + afterNdays * 24 * 60 * 60 * 1000).toUTCString();; // 1日 = 24時間, 1時間 = 60分, 1分 = 60秒, 1秒 = 1000ミリ秒
      } else {
        nDaysLaterInMillis=''
      }
      return document.cookie=key+'='+encodeURIComponent(value)+''+nDaysLaterInMillis
  }
  
  //===========================================
  // video要素の有無
  // 
  export function hasVideo(wkmsg: string): boolean{
      let htmlRegEx =  /<video.*?<\/video>/gis
      let reg=wkmsg.match(htmlRegEx)
      //alert('test',reg)
      if (reg){
          return true
      } else {
          return false
      }
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
  // 画像をドラッグアンドドロップした際に、その画像の data:image URI を取得する
  // 
  
  export function getDataImageByDrop(document, msgboxId, dropElmentId): boolean{
      const textArea = document.getElementById(msgboxId);
      let dropArea = document.getElementById(dropElmentId);
  
      // -----------------------------------------------------
      // イベント処理
  
          // ドラッグオーバー時の処理
          dropArea.addEventListener('dragover', function(e) {
              e.preventDefault();
              dropArea.style.border = '4px dashed #d09696';
          });
        
          // ドラッグアウト時の処理 
          // dropAreaがtextAreaの場合はtextAreaのborderを戻す
          dropArea.addEventListener('dragleave', function() {
            dropArea.style.border = '2px dashed #ccc';
            if(textArea===dropArea){
              textArea.style.border = '';
            }
          });
        
          // ドロップ時の処理
          // dropAreaがtextAreaの場合はtextAreaのborderを戻す
          dropArea.addEventListener('drop', function(e) {
            e.preventDefault();
            dropArea.style.border = '2px dashed #ccc';
            if(textArea===dropArea){
              textArea.style.border = '';
            }
        
            // ドロップされたファイルを取得
            let file = e.dataTransfer.files[0];
        
            // FileReaderを使用して画像のdata URIを取得
            let reader = new FileReader();
            reader.onload = function(event) {
              console.log('reader.onload ')
              let dataUri = event.target.result;
              console.log('getDataImageByDrop', dataUri)
              if(dataUri.indexOf('<a')!==-1)return dataUri;
              if(dataUri.indexOf('<img')!==-1)return dataUri;
  
              // 画像をリサイズしてinputMsgへ表示する
              resizeImageToInputMsg(event)
  
            };
        
            // ファイルを読み込む
            reader.readAsDataURL(file);
          });
  
  }
  
  //===========================================
  // 画像をリサイズしてinputMsgへ表示する
  // 

  export function resizeImageToInputMsg(e: Event): void{
      const inputMsg = document.getElementById('input_msg');
      const img = new Image();
      img.src = e.target.result;
      img.onload = function() {
          let width = img.width;
          let height = img.height;
  
          //cssを一旦解除
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
  
          [width, height ]= resizeImage(width, height) 
  
          // Canvas要素を作成
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
  
          // Canvasに画像を描画
          ctx.drawImage(img, 0, 0, width, height);
  
          // Canvasの画像をDataURLに変換
          const dataURL = canvas.toDataURL('image/jpeg'); // もしくは 'image/png'  
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          //const dataURL = canvas.toDataURL('image/webp', 0.8);//data:image/pngになってしまう

        // 新しい画像要素を作成してDataURLを設定
          const newImgElement = document.createElement('img');
          newImgElement.src = dataURL;
          
          // 画像サイズ情報を表示する要素を作成
          const sizeInfo = document.createElement('div');
          sizeInfo.style.fontSize = '11px';
          sizeInfo.textContent = `(w:${width} h:${height})`;

          // 画像とサイズ情報を追加する
          const container = document.createElement('div');
          container.appendChild(sizeInfo);
          container.appendChild(newImgElement);

          // <br>を追加して次の画像の間に改行を挿入
          inputMsg.appendChild(container);
          inputMsg.appendChild(document.createElement('br'));

              // 画像サイズを最大 400 にリサイズする関数
            function resizeImage(width, height) {
                // 画像のサイズを変更する条件をチェック
                if (width > 400 || height > 400) {
                    let aspectRatio = width / height;

                    if (aspectRatio > 1) { // 幅が高さより大きい場合
                        width = 400;
                        height = 400 / aspectRatio;
                    } else { // 高さが幅より大きい、または同じ場合
                        height = 400;
                        width = 400 * aspectRatio;
                    }
                }

                return [width, height ];
            }
      }
  }
  
  //===========================================
  // 画像dataを img 要素
  // 
  export function dataImgWrap2Img(wkmsg: string): string {
      console.log('dataImgWrap2Img', wkmsg)
      if(wkmsg.indexOf('<a')!==-1)return wkmsg;
      if(wkmsg.indexOf('<img')!==-1)return wkmsg;
      if(wkmsg.indexOf('<video')!==-1)return wkmsg;
      // 画像data抽出用正規表現 
      //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAABWCAYAAACHKqnqAAADLElEQVR4Ae3cQU7bQBgF4Jw23CCnLHcgKa7oBhaRotBFXBlpIjCTEbOJn6UPKXI8Y4nX759HYNPN6GtVAqfTaTwcfo/7/cFrQYPNqk6NsB8C7
      let urlRegEx = /^(.*)(data:image\/[a-z]+;base64,.*)/i
      let tolink = "<img src='$2'>"
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
  //  (※urlWrap2Linkと併用する場合は、urlWrap2Linkを先に実行する)
  // 
  export function urlWrap2Img(wkmsg: string): string {
      console.log('urlWrap2Img', wkmsg)
      if(wkmsg.indexOf('<a')!==-1)return wkmsg;
      if(wkmsg.indexOf('<img')!==-1)return wkmsg;
      if(wkmsg.indexOf('<video')!==-1)return wkmsg;
      // 画像文字列抽出用正規表現 gで複数にマッチする
      let urlRegEx = /^(.*)(https.*\.(jpg|jpeg|gif|png|bmp|webp|ai|eps))(.*)$/i,
      //tolink = "$1<a target='_blank' href='$2'><img src='$2' style=max-width:20%;></a>$4<div style=font-size:0.7rem>$2</div>" 
      tolink = "<img src='$2'>"
      
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
      console.log('urlWrap2Link', wkmsg)
      if(wkmsg.indexOf('<a')!==-1)return wkmsg;
      if(wkmsg.indexOf('<img')!==-1)return wkmsg;
      if(wkmsg.indexOf('<video')!==-1)return wkmsg;
      let lists=[]
      let mobile=('touchstart' in window);
      let target='_blank';
      if(mobile){
          target='_self';
      }
      let imgRegEx=/\.(jpg|jpeg|gif|png|bmp|webp|ai|eps)$/i
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
  
  