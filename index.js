const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const lib = require('./lib');
const db = require('./database');
const fs = require('fs');
var formidable = require('formidable');

router.post('/update/audio', function (req, res) {
    const { headers, method, url } = req;

    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        try {

            body = Buffer.concat(body).toString();
            console.log("Demo: ");
            var data = JSON.parse(body);
            console.log("Demo: ", body);
            // res.send(body);
            db.updateDownLoad(data.message, function (err, info) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                lib.downloadAudio(info.direction, info.fileName, info.url);
                res.send('Done');
            });
        } catch {
            res.send('error');
        }
    });
});

router.post('/update/youtube', function (req, res) {
  const { headers, method, url } = req;
  let body = [];
  req.on('error', (err) => {
      console.error(err);
  }).on('data', (chunk) => {
      body.push(chunk);
  }).on('end', () => {
      body = Buffer.concat(body).toString();
      var data = JSON.parse(body);
      db.updateDownLoad(data, function (err, info) {
          if (err) {
              console.log(err);
              res.send(err);
          }
          lib.downloadAudio(info.direction, info.fileName, info.url);
          res.send('Done');
      });
  });
});

router.get('/', function (req, res) {
  // res.sendFile(path.join(__dirname + '/index.html'));
  console.log(res.url);
  res.send("Home Nothing")
  //__dirname : It will resolve to your project folder.
});

router.get('/upload', function (req, res) {
  try{
    res.sendFile(path.join(__dirname + '/upfile.html'));
  }catch
  {
      res.send("ERROR");
  }
});

router.post('/upload/:path', function (req, res) {
  //Khởi tạo form
  var form = new formidable.IncomingForm();
  //Thiết lập thư mục chứa file trên server
  form.uploadDir = "Data/Fix";
  //xử lý upload
  form.parse(req, function (err, fields, file) {
      //path tmp trên server
      var path = file.files.path;
      //thiết lập path mới cho file
      var newpath = form.uploadDir + file.files.name;
      fs.rename(path, newpath, function (err) {
          if (err) throw err;
          res.end('Upload Thanh cong!');
      });
  });
});

router.get('/chuong/:id', function (req, res) {
  try{
      const range = req.headers.range;
      console.log(range);
      const filePath = path.join(__dirname, '/Data/Fix/Chuong' + req.params.id);
      const stat = fs.statSync(filePath);
      const total = stat.size;
      res.writeHead(200, {
          'Content-Range': 'bytes ' + 0 + '-' + (total -1) + '/' + total,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'audio/mpeg',
          'Content-Length': stat.size
      });
  
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);

  }catch{
      res.send("ERROR");
  }
  // res.setHeader("Content-Type:","audio/mpeg")
  // res.sendFile(path.join(__dirname + '/Data/Chuong' + req.params.id));
  // res.send(req.params.id);
  //__dirname : It will resolve to your project folder.
});

router.get('/download/chuong/:id', function (req, res) {
  try{
      const range = req.headers.range;
      console.log(range);
      const filePath = path.join(__dirname, '/Data/TheGioiHoanMy/Chuong' + req.params.id);
      const stat = fs.statSync(filePath);
      const total = stat.size;
      res.writeHead(200, {
          'Content-Range': 'bytes ' + 0 + '-' + (total -1) + '/' + total,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'audio/mpeg',
          'Content-Length': stat.size
      });
  
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);

  }catch{
      res.send("ERROR");
  }
  // res.setHeader("Content-Type:","audio/mpeg")
  // res.sendFile(path.join(__dirname + '/Data/Chuong' + req.params.id));
  // res.send(req.params.id);
  //__dirname : It will resolve to your project folder.
});

router.get('/data/:storename/:bookId', function (req, res) {
  console.log('aasdsadasds');
  res.send(req.params);
  //__dirname : It will resolve to your project folder.
});

router.get('/index', function (req, res) {
  try{
      res.sendFile(path.join(__dirname + '/index.html'));
  }catch
  {
      res.send("ERROR");
  }
  //__dirname : It will resolve to your project folder.
});

router.get('/about', function (req, res) {
  try{

      res.sendFile(path.join(__dirname + '/about.html'));
  }catch
  {
      res.send("ERROR");
  }
});

router.get('/sitemap', function (req, res) {
  try{

      res.sendFile(path.join(__dirname + '/sitemap.html'));
  }catch
  {
      res.send("ERROR");
  }
});

//add the router
app.use('/', router);
app.listen(process.env.port || 8888);

console.log('Running at Port http://localhost:8888/');
