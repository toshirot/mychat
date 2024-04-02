const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// 新しいシークレットキーを生成する
const secret = speakeasy.generateSecret({ length: 20 });

console.log('シークレットキー:', secret.base32);

// QRコードを生成し、ユーザーに提供する
const qrCodeUrl = speakeasy.otpauthURL({
  secret: secret.base32,
  label: 'accountName',
  issuer: 'mychat.jp'
});

// QRコード URL を表示
console.log('QRコード URL:', qrCodeUrl);

// ワンタイムパスワード (OTP) を生成する
const otp = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});

console.log('ワンタイムパスワード (OTP):', otp);

// ユーザーからの入力を検証する
const isValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: otp, //ワンタイムパスワード 'ユーザーが入力したコード',
  window: 2 // 有効なコードとみなす時間の範囲 (秒)
});

console.log('検証結果:', isValid ? '有効なコードです' : '無効なコードです');

// 生成した otpauth URL
const otpauthUrl = qrCodeUrl;

// QR コードを生成し、ターミナルに表示
qrcode.toString(otpauthUrl, { type: 'terminal' }, (err, qrCode) => {
  if (err) {
    console.error('QR コードの生成中にエラーが発生しました:', err);
    return;
  }
  console.log(qrCode);
});