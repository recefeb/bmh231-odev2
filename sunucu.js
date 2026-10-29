const http = require("http");

const sunucu = http.createServer(function (istek, yanit) {
  console.log(istek.method + " " + istek.url);
  yanit.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  yanit.end("Merhaba, sunucu çalışıyor");
});

sunucu.listen(3000, function () {
  console.log("Sunucu http://localhost:3000 adresinde çalışıyor");
});