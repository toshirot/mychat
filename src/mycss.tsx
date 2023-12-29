export const <mycss:any></mycss:any>  {return `
.msgbox{
    position:relative;
    width:500px;
    height:80px;
    margin-top:10px;
    padding:20px;
    text-align: left;
    color:#333333;
    font-size: 16px;
    border-radius:11px;
    -webkit-border-radius:11px;
    -moz-border-radius:11px;
    box-shadow: 5px 5px 15px #dbdcdc;
}
.msgbox-left{
    float: left;
    margin-left:50px;
    background:#E1FFCA;
}
.msgbox-left:after{
    border: solid transparent;
    content:'';
    height:0;
    width:0;
    pointer-events:none;
    position:absolute;
    border-color: rgba(225, 255, 202, 0);
    border-top-width:10px;
    border-bottom-width:10px;
    border-left-width:24px;
    border-right-width:24px;
    margin-top: -10px;
    border-right-color:#E1FFCA;
    right:100%;
    top:50%;
}
.msgbox-right{
    float: right;
    margin-right:50px;
    background:#fff8ca;
}
.msgbox-right:after{
    border: solid transparent;
    content:'';
    height:0;
    width:0;
    pointer-events:none;
    position:absolute;
    border-color: rgba(225, 255, 202, 0);
    border-top-width:10px;
    border-bottom-width:10px;
    border-left-width:24px;
    border-right-width:24px;
    margin-top: -10px;
    border-left-color:#fff8ca;
    left:100%;
    top:50%;
}
.namebox{
    font-size:12px;
    color:#333333;
    text-align:left;
}
`}