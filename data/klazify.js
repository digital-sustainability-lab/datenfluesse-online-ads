const axios = require("axios");
const fs = require("fs");

api =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTc5OTEyNmZiZjZkOTE0NGUyMGNjNjFiYmM5ZWY1YWUzYWRmZWQzNjRhMDhiMDgzNjVhZWMzZjA0MDk3MzZhN2I5Y2Q2MWQxNjdhMjRiYzAiLCJpYXQiOjE2NTUzNzE3NjgsIm5iZiI6MTY1NTM3MTc2OCwiZXhwIjoxNjg2OTA3NzY4LCJzdWIiOiI2Mzk2Iiwic2NvcGVzIjpbXX0.HAMnC8fd8Ud2YyYP4L6ckCQM-qQB-Psucm5DWB4JDjYpR6rBq0fekkplrx1BR-01kUMv1uHxcAS8WV9skCmdNg";

urls = [
  "https://www.Google.com",
  "https://www.Youtube.com",
  "https://www.Facebook.com",
  "https://www.Google.ch",
  "https://www.Wikipedia.org",
  "https://www.Instagram.com",
  "https://www.Reddit.com",
  "https://www.20min.ch",
  "https://www.Blick.ch",
  "https://www.Srf.ch",
  "https://www.Linkedin.com",
  "https://www.Bing.com",
  "https://www.Admin.ch",
  "https://www.Live.com",
  "https://www.Yahoo.com",
  "https://www.Twitter.com",
  "https://www.Whatsapp.com",
  "https://www.Ricardo.ch",
  "https://www.Galaxus.ch",
  "https://www.Duckduckgo.com",
  "https://www.Microsoft.com",
  "https://www.Digitec.ch",
  "https://www.Aliexpress.com",
  "https://www.Watson.ch",
  "https://www.Deepl.com",
  "https://www.Microsoftonline.com",
  "https://www.Github.com",
  "https://www.Amazon.de",
  "https://www.Bluewin.ch",
  "https://www.Post.ch",
  "https://www.Swisscom.ch",
  "https://www.Fandom.com",
  "https://www.Sbb.ch",
  "https://www.Amazon.com",
  "https://www.Netflix.com",
  "https://www.Booking.com",
  "https://www.Zoom.us",
  "https://www.Paypal.com",
  "https://www.9gag.com",
  "https://www.Tiktok.com",
  "https://www.Twitch.tv",
  "https://www.Stackoverflow.com",
  "https://www.T.co",
  "https://www.Office.com",
  "https://www.Rts.ch",
  "https://www.Tutti.ch",
];

fullList = {};
promises = [];

urls.forEach((url) => {
  settings = {
    async: true,
    crossDomain: true,
    url: "https://www.klazify.com/api/categorize",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${api}`,
      "cache-control": "no-cache",
    },
    processData: false,
    data: `{"url":"${url}"}\n`,
  };
  promises.push(
    axios(settings).then((response) => {
      fullList[url] = response.data;
    })
  );
});

Promise.all(promises).then(() => {
  console.log("promises", promises);
  fs.writeFileSync("./company_data.json", JSON.stringify(fullList), {
    encoding: "utf8",
  });
});
