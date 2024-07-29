const router = require("express").Router()
const cheerio = require("cheerio")
const moment = require("moment")
const request = require("request-promise")


router.get("/demo",async (req,res)=>{
// Crawl data with pagination
    try {
        console.log("fdafdasfdafda")
        const page = parseInt(req.query.page) || 1; 
        const size = parseInt(req.query.size) || 4; 
        const html = await request('https://123job.vn/tuyen-dung');
        const $ = cheerio.load(html);
        const jobList = [];
        $(".job__list-item").each((index, element) => {
          const job = $(element).find(".job__list-item-content .job__list-item-title").text().trim();
          const company = $(element).find(".job__list-item-content .job__list-item-company").text().trim();
          const address = $(element).find(".job__list-item-content .job__list-item-info .address").text().trim();
          const salary = $(element).find('.job__list-item-info').find('.salary').text().trim();
          jobList.push({
            job: job,
            company: company,
            address: address,
            salary: salary
          });
        });
            const totalItems = jobList.length;
            const totalPages = Math.ceil(totalItems / size);
            const startIndex = (page - 1) * size;
            const endIndex = Math.min(startIndex + size, totalItems);
            const paginatedJobs = jobList.slice(startIndex, endIndex);
            const formattedDate = moment().format("DD-MM-YYYY hh:mm:ss")
            res.status(200).json({
              timeStamp: formattedDate,
              page: page,
              size: size,
              totalItems: totalItems,
              totalPages: totalPages,
              jobs: paginatedJobs
            });
          } catch (error) {
            res.status(500).json("server invalid");
          }
})




router.get("/trungga",async (req,res)=>{
        try {
            const page = parseInt(req.query.page) || 1; 
            const size = parseInt(req.query.size) || 4; 
            const html = await request('https://chogia.vn/gia-trung-ga-hom-nay-bang-gia-trung-moi-nhat-46525');
            const $ = cheerio.load(html);
            const chickenList = [];
            // gt(0) bỏ vị trí 0
            // eq(0) lấy trị trí 0 của thẻ
            $(" table tbody tr:gt(0) ").each((index, element) => {
                const address = $(element).find("td").eq(0).text().trim()
                const whiteEggPrice  = $(element).find("td").eq(1).text().trim()
                const redEggPrice  = $(element).find("td").eq(2).text().trim()
              chickenList.push({
                address: address,
                whiteEggPrice: whiteEggPrice,
                redEggPrice: redEggPrice,
              });
            });
                const totalItems = chickenList.length;
                const totalPages = Math.ceil(totalItems / size);
                const startIndex = (page - 1) * size;
                const endIndex = Math.min(startIndex + size, totalItems);
                const paginatedJobs = chickenList.slice(startIndex, endIndex);
                const formattedDate = moment().format("DD-MM-YYYY hh:mm:ss")
                res.status(200).json({
                  timeStamp: formattedDate,
                  page: page,
                  size: size,
                  totalItems: totalItems,
                  totalPages: totalPages,
                  jobs: paginatedJobs
                });
              } catch (error) {
                res.status(500).json("server invalid");
              }
    })



router.get("/saurieng",async (req,res)=>{
        try {
            const page = parseInt(req.query.page) || 1; 
            const size = parseInt(req.query.size) || 4; 
            const html = await request('https://chogia.vn/bang-gia-sau-rieng-hom-nay-47777/');
            const $ = cheerio.load(html);
            const chickenList = [];
            // gt(0) bỏ vị trí 0
            // eq(0) lấy trị trí 0 của thẻ
            $(" table tbody tr:gt(1) ").each((index, element) => {
                const type = $(element).find("td").eq(0).text().trim()
                console.log(type)
                const city = $(element).find("td").eq(0).text().trim()
                const whiteEggPrice  = $(element).find("td").eq(1).text().trim()
                const redEggPrice  = $(element).find("td").eq(2).text().trim()
              chickenList.push({
                city: city,
                whiteEggPrice: whiteEggPrice,
                redEggPrice: redEggPrice,
              });
            });
                const totalItems = chickenList.length;
                const totalPages = Math.ceil(totalItems / size);
                const startIndex = (page - 1) * size;
                const endIndex = Math.min(startIndex + size, totalItems);
                const paginatedJobs = chickenList.slice(startIndex, endIndex);
                const formattedDate = moment().format("DD-MM-YYYY hh:mm:ss")
                res.status(200).json({
                  timeStamp: formattedDate,
                  page: page,
                  size: size,
                  totalItems: totalItems,
                  totalPages: totalPages,
                  jobs: paginatedJobs
                });
              } catch (error) {
                res.status(500).json("server invalid");
              }
    })    

module.exports = router;

