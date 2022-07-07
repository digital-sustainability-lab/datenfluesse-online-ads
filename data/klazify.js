const axios = require("axios");
const fs = require("fs");
const company_data = require("./company_data_all.json");

urls = [
  "https://de.news-front.info/",
  "https://journalistenwatch.com/",
  "https://www.compact-online.de/",
  "https://www.unzensuriert.at/",
  "https://www.wochenblick.at/",
  "https://report24.news/",
  "https://www.info-direkt.eu/",
  "https://auf1.tv/",
  "https://uncutnews.ch/",
  "https://transition-news.org/",
  "https://zeitpunkt.ch/",
  "https://nuoflix.de/",
  "https://apolut.net/",
  "https://google.com",
  "https://youtube.com ",
  "https://facebook.com ",
  "https://google.ch ",
  "https://wikipedia.org ",
  "https://instagram.com",
  "https://reddit.com ",
  "https://20min.ch ",
  "https://blick.ch ",
  "https://srf.ch ",
  "https://linkedin.com ",
  "https://bing.com ",
  "https://admin.ch ",
  "https://live.com ",
  "https://yahoo.com ",
  "https://twitter.com ",
  "https://whatsapp.com ",
  "https://ricardo.ch",
  "https://galaxus.ch ",
  "https://duckduckgo.com ",
  "https://microsoft.com ",
  "https://digitec.ch",
  "https://aliexpress.com ",
  "https://watson.ch ",
  "https://deepl.com ",
  "https://microsoftonline.com ",
  "https://github.com ",
  "https://amazon.de",
  "https://bluewin.ch ",
  "https://post.ch ",
  "https://swisscom.ch ",
  "https://fandom.com ",
  "https://sbb.ch ",
  "https://amazon.com ",
  "https://netflix.com",
  "https://booking.com ",
  "https://zoom.us ",
  "https://paypal.com ",
  "https://9gag.com ",
  "https://tiktok.com ",
  "https://twitch.tv ",
  "https://stackoverflow.com",
  "https://t.co ",
  "https://fffice.com ",
  "https://rts.ch ",
  "https://tutti.ch",
];

api =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTc5OTEyNmZiZjZkOTE0NGUyMGNjNjFiYmM5ZWY1YWUzYWRmZWQzNjRhMDhiMDgzNjVhZWMzZjA0MDk3MzZhN2I5Y2Q2MWQxNjdhMjRiYzAiLCJpYXQiOjE2NTUzNzE3NjgsIm5iZiI6MTY1NTM3MTc2OCwiZXhwIjoxNjg2OTA3NzY4LCJzdWIiOiI2Mzk2Iiwic2NvcGVzIjpbXX0.HAMnC8fd8Ud2YyYP4L6ckCQM-qQB-Psucm5DWB4JDjYpR6rBq0fekkplrx1BR-01kUMv1uHxcAS8WV9skCmdNg";

fullList = {};
promises = [];

cleanedObject = {};

for (const key in company_data) {
  cleanedObject[key] = {};
  cleanedObject[key].categories = [];
  if (company_data[key].objects) {
    if (company_data[key].objects.company) {
      if (company_data[key].objects.company.name) {
        cleanedObject[key].name = company_data[key].objects.company.name;
      }
      if (company_data[key].objects.company.city) {
        cleanedObject[key].city = company_data[key].objects.company.city;
      }
      if (company_data[key].objects.company.stateCode) {
        cleanedObject[key].stateCode =
          company_data[key].objects.company.stateCode;
      }
      if (company_data[key].objects.company.countryCode) {
        cleanedObject[key].countryCode =
          company_data[key].objects.company.countryCode;
      }
      if (company_data[key].objects.company.employeesRange) {
        cleanedObject[key].employeesRange =
          company_data[key].objects.company.employeesRange;
      }
      if (company_data[key].objects.company.revenue) {
        cleanedObject[key].revenue = company_data[key].objects.company.revenue;
      }
      if (company_data[key].objects.company.raised) {
        cleanedObject[key].raised = company_data[key].objects.company.raised;
      }
      if (company_data[key].objects.company.tags) {
        cleanedObject[key].tags = company_data[key].objects.company.tags;
      }
    }
  }
  let allCategories = [];
  let categories = [];
  if (company_data[key].domain) {
    for (const cat of company_data[key].domain.categories) {
      categories = cat.name.split("/");
      categories = [...new Set(categories)];
      categories = categories.filter((el) => el);
      allCategories.push(...categories);
    }
  }
  allCategories = [...new Set(allCategories)];
  cleanedObject[key].categories.push(...allCategories);
}

fs.writeFileSync(
  "./clean_company_data_all.json",
  JSON.stringify(cleanedObject),
  {
    encoding: "utf8",
  }
);

// urls.forEach((url) => {
//   settings = {
//     async: true,
//     crossDomain: true,
//     url: "https://www.klazify.com/api/categorize",
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${api}`,
//       "cache-control": "no-cache",
//     },
//     processData: false,
//     data: `{"url":"${url}"}\n`,
//   };
//   promises.push(
//     axios(settings).then((response) => {
//       fullList[url] = response.data;
//     })
//   );
// });

// Promise.all(promises).then(() => {
//   console.log("promises", promises);
//   fs.writeFileSync("./company_data_all.json", JSON.stringify(fullList), {
//     encoding: "utf8",
//   });
// });
