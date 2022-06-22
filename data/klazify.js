const axios = require("axios");
const fs = require("fs");
const company_data = require("./company_data.json");

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
  for (const cat of company_data[key].domain.categories) {
    categories = cat.name.split("/");
    categories = [...new Set(categories)];
    categories = categories.filter((el) => el);
    allCategories.push(...categories);
  }
  allCategories = [...new Set(allCategories)];
  cleanedObject[key].categories.push(...allCategories);
}

fs.writeFileSync("./clean_company_data.json", JSON.stringify(cleanedObject), {
  encoding: "utf8",
});

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
//   fs.writeFileSync("./company_data.json", JSON.stringify(fullList), {
//     encoding: "utf8",
//   });
// });
