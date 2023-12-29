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





