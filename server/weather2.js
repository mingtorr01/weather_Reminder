const express = require("express");
const app = express();
const port = 3003;
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
// nodemailer 모듈 요청
const nodemailer = require("nodemailer");
const request = require("request");
//salt 암호화 모듈
const crypto = require("crypto");
var parseString = require("xml2js").parseString; //xml을 json 으로 변환
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
var date2 = moment().format("YYYYMMDD");
var http = require("http").createServer(app);
var xml2js = require('xml2js');
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2ajrrhtlvj",
  database: "mydb",
});

connection.connect();
//bodyparser및 cors 사용
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.json());

var time = 24;
werther_service()
//var interval = setInterval(test, 1000);
var mailSender = {
  // 메일발송 함수
  sendGmail: function (param) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      prot: 587,
      host: "smtp.gmail.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: "cwnunight@gmail.com",
        pass: "a2586974",
      },
    });
    // 메일 옵션
    var mailOptions = {
      from: "gjdnjsdud10@gmail.com",
      to: param.toEmail, // 수신할 이메일
      subject: param.subject, // 메일 제목
      text: param.text, // 메일 내용
    };
    // 메일 발송
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};

async function weather_api(nx, ny, email) {
  var url = "http://www.kma.go.kr/wid/queryDFS.jsp?gridx=55&gridy=123";
  console.log("n3");
  request(
    {
      url: url,
      method: "GET",
    },
    function (error, response, body) {
     xml2js.parseString(body, function(err, obj){
      let now = obj.wid.body[0].data[0];
      var body = JSON.parse(now.sky)
      var arr = [];
      arr.push(obj.wid.body[0].data[0].pop[0]);
      arr.push(obj.wid.body[0].data[0].pty[0]);
      arr.push(obj.wid.body[0].data[0].reh[0]);
      arr.push(obj.wid.body[0].data[0].sky[0]);
      arr.push(obj.wid.body[0].data[0].tmn[0]);
      arr.push(obj.wid.body[0].data[0].tmx[0]);
      arr.push(obj.wid.body[0].data[0].wfKor[0]);
      console.log(arr);
      sendmailer(arr,email);
     })
     if (error) {
        
      }

    }
  );
}

function sendmailer(data, email) {
  const sky = data[3];
  const rain = data[1];
  var value = "";
  var title = "";
  var date3 = moment().format("YYYY 년 MM 월 DD 일"); 
  console.log(data);
  if (sky === '1') {
   let emailParam = {
    toEmail: email,
    subject: "[날씨알리미]오늘의 날씨는 맑음입니다!",
    text: `<body style="margin: 0; padding: 0">
      <div style="font-family:Apple SD Gothic Neo, sans-serif ; width: auto; height: autopx; border-top: 4px solid #6f9df1;padding-left: 30px;">
      <h1 style=" margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400"><b style="font-size: 20px;">우산알리미</b>
        <b style="color: #3f4144">오늘의 날씨</b>  <b style="color: #6f9df1;">맑음.</b>
        </h1>
        <img src="https://raw.githubusercontent.com/jybin96/weathersite/master/server/sun.png" style="height: 200px; width: 200px; padding-left: 30px; padding-top: 30px; padding-bottom: 30px;"/>
        <p style="color: #3f4144; font-weight: bold; font-size: 20px;">${date3} 날씨정보</p>
        <p style="font-size: 16px;line-height: 26px;padding: 0 5px;">
          <b style="color: #6f9df1">강수확률</b> :&nbsp; ${data[0]} %
          <b style="color: #6f9df1">하늘상태</b> :&nbsp; ${data[6]}
          <b style="color: #6f9df1">습도</b> :&nbsp; ${data[2]}
          <b style="color: #6f9df1">오전최저기온</b> :&nbsp; ${data[4]}
          <b style="color: #6f9df1">오후최고기온</b> :&nbsp; ${data[5]}</p>
        <a style="color: #fff; text-decoration: none; text-align: center" href="{$auth_url}" target="_blank"><p style="display: inline-block;width: 210px;height: 45px;margin: 30px 5px 40px;background: #2d73f5;line-height: 45px;vertical-align: middle;font-size: 16px;" class="move_wagle">우산알리미 홈페이지 이동</p>
        </a>
      </div>
    </body>`
  }
  mailSender.sendGmail(emailParam);
 } else {
    if (rain === '0') {
      //맑지않고 비가 안올때
      let emailParam = {
       toEmail: email,
       subject: "[날씨알리미]오늘의 날씨는 흐림입니다!",
       text :`<body style="margin: 0; padding: 0">
      <div style="font-family:Apple SD Gothic Neo, sans-serif ; width: auto; height: autopx; border-top: 4px solid #6f9df1;padding-left: 30px;">
      <h1 style=" margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400"><b style="font-size: 20px;">우산알리미</b>
        <b style="color: #3f4144">오늘의 날씨</b>  <b style="color: #6f9df1;">흐림.</b>
        </h1>
        <img src="https://raw.githubusercontent.com/jybin96/weathersite/master/server/cloud.png" style="height: 200px; width: 200px; padding-left: 30px; padding-top: 30px; padding-bottom: 30px;"/>
        <p style="color: #3f4144; font-weight: bold; font-size: 20px;">${date3} 날씨정보</p>
        <p style="font-size: 16px;line-height: 26px;padding: 0 5px;">
          <b style="color: #6f9df1">강수확률</b> :&nbsp; ${data[0].value} %
          <b style="color: #6f9df1">하늘상태</b> :&nbsp; 맑음
          <b style="color: #6f9df1">오전최저기온</b> :&nbsp; ${data[4].value}
          <b style="color: #6f9df1">오후최고기온</b> :&nbsp; ${data[5].value}</p>
        <a style="color: #fff; text-decoration: none; text-align: center" href="{$auth_url}" target="_blank"><p style="display: inline-block;width: 210px;height: 45px;margin: 30px 5px 40px;background: #2d73f5;line-height: 45px;vertical-align: middle;font-size: 16px;" class="move_wagle">우산알리미 홈페이지 이동</p>
        </a>
      </div>
    </body>`
    }
    mailSender.sendGmail(emailParam);
   } else {
    let emailParam = {
     toEmail: email,
     subject: "[날씨알리미]오늘은 비가 옵니다. 우산챙기세요!!!!!",
     text : `<body style="margin: 0; padding: 0">
      <div style="font-family:Apple SD Gothic Neo, sans-serif ; width: auto; height: autopx; border-top: 4px solid #6f9df1;padding-left: 30px;">
      <h1 style=" margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400"><b style="font-size: 20px;">우산알리미</b>
        <b style="color: #3f4144">오늘의 날씨</b>  <b style="color: #6f9df1;">흐림.</b>
        </h1>
        <img src="https://raw.githubusercontent.com/jybin96/weathersite/master/server/rain.png" style="height: 200px; width: 200px; padding-left: 30px; padding-top: 30px; padding-bottom: 30px;"/>
        <p style="color: #3f4144; font-weight: bold; font-size: 20px;">${date3} 날씨정보</p>
        <p style="font-size: 16px;line-height: 26px;padding: 0 5px;">
          <b style="color: #6f9df1">강수확률</b> :&nbsp; ${data[0].value} %
          <b style="color: #6f9df1">하늘상태</b> :&nbsp; 비
          <b style="color: #6f9df1">오전최저기온</b> :&nbsp; ${data[4].value}
          <b style="color: #6f9df1">오후최고기온</b> :&nbsp; ${data[5].value}</p>
        <a style="color: #fff; text-decoration: none; text-align: center" href="{$auth_url}" target="_blank"><p style="display: inline-block;width: 210px;height: 45px;margin: 30px 5px 40px;background: #2d73f5;line-height: 45px;vertical-align: middle;font-size: 16px;" class="move_wagle">우산알리미 홈페이지 이동</p>
        </a>
      </div>dfdd
    </body>`
    }
    mailSender.sendGmail(emailParam);
   }
  }
}

function werther_service() {
  connection.query("SELECT * FROM user_info E JOIN location_table D ON E.user_key = D.user_key and user_sendtime= (?) and user_state = 1;", [time], function (err, rows, fields) {
    console.log(rows);
    if (rows[0] !== undefined) {
      rows.map((row, index, array) => {
        weather_api(row.nx, row.ny, row.user_email);
      });
    } else {
    }
  });
}

// 아이디 중복체크
function test() {
  var date = moment().format("mm:ss");

  if (date === time.toString().concat(":00") || date === "0".concat(time.toString().concat(":00"))) {
    clearInterval(interval);
    werther_service();
    time++;
    if (time === 24) {
      time = 00;
      date2 = moment().format("YYYYMMDD");
    }
    console.log(time);
    interval = setInterval(test, 1000);
    interval;
  } else {
    console.log(date);
    console.log(time);
  }
}
http.listen(port, () => {
 // interval;
  console.log(`Example app listening at http://localhost:${port}`);
});