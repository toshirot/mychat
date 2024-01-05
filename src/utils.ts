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
      return document.cookie=key+'='+encodeURIComponent(value)+';'
  }
  
  



