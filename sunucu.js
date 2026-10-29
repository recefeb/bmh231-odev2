const http = require("http");
const fs = require("fs");
const path = require("path");

const PUBLIC_KLASOR = path.join(__dirname, "public");

const icerikTurleri = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

function duzMetinGonder(yanit, durumKodu, metin) {
  yanit.writeHead(durumKodu, { "Content-Type": "text/plain; charset=utf-8" });
  yanit.end(metin);
}

const sunucu = http.createServer(function (istek, yanit) {
  console.log(istek.method + " " + istek.url);

  const url = new URL(istek.url, "http://localhost:3000");
  let yol = url.pathname;

  if (yol === "/") {
    yol = "/index.html";
  }

  const dosyaYolu = path.join(PUBLIC_KLASOR, yol);

  if (!dosyaYolu.startsWith(PUBLIC_KLASOR + path.sep)) {
    duzMetinGonder(yanit, 404, "Bulunamadı");
    return;
  }

  fs.readFile(dosyaYolu, function (hata, icerik) {
    if (hata) {
      duzMetinGonder(yanit, 404, "Bulunamadı");
      return;
    }

    const uzanti = path.extname(dosyaYolu);
    const tur = icerikTurleri[uzanti] || "application/octet-stream";
    yanit.writeHead(200, { "Content-Type": tur });
    yanit.end(icerik);
  });
});

sunucu.listen(3000, function () {
  console.log("Sunucu http://localhost:3000 adresinde çalışıyor");
});