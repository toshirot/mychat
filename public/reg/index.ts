<!DOCTYPE html>
<html lang='ja'>
        
<head>
    <meta charset="utf-8">
    <meta name=”viewport” content=”width=device-width,initial-scale=1″>
    <title>${CHAT_NAME} updating</title>
    <script>

<link rel="stylesheet" href="/public/css/base.css">
<link rel="stylesheet" href="/public/css/input-box.css">
<link rel="stylesheet" href="/public/css/msg-box.css">
<form id="contact">
    <div class="input_box">
    <div class="head">
        <h2>相手の電話とパスフレーズ</h2>
    </div>
    電話<br />
    <input type="text" id="input_tel" uid="${uid.value}" placeholder="telを入れてください" /><br />
    パスフレーズ<br />
    <input type="text" id="input_pass" uid="${uid.value}" placeholder="パスフレーズを入れてください" /><br />
    <div class="message">送信</div>
    <button id="btn_send" type="submit">
    送信
    </button>
    </div>
</form>

</body>
</html>