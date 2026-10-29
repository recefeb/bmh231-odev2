const http = require("http");
const fs = require("fs");
const path = require("path");

const PUBLIC_KLASOR = path.join(__dirname, "public");

const etkinlikler = JSON.parse(
    fs.readFileSync(path.join(__dirname, "etkinlikler.json"), "utf-8")
);

const icerikTurleri = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};

function duzMetinGonder(yanit, durumKodu, metin) {
    yanit.writeHead(durumKodu, { "Content-Type": "text/plain; charset=utf-8" });
    yanit.end(metin);
}

function jsonGonder(yanit, durumKodu, veri) {
    yanit.writeHead(durumKodu, { "Content-Type": "application/json; charset=utf-8" });
    yanit.end(JSON.stringify(veri));
}

const sunucu = http.createServer(function (istek, yanit) {
    console.log(istek.method + " " + istek.url);

    const url = new URL(istek.url, "http://localhost:3000");
    let yol = url.pathname;

    if (yol === "/api/etkinlikler") {
        const tur = url.searchParams.get("tur");
        if (tur) {
            jsonGonder(yanit, 200, etkinlikler.filter(function (e) {
                return e.tur === tur;
            }));
        } else {
            jsonGonder(yanit, 200, etkinlikler);
        }
        return;
    }

    if (yol.startsWith("/api/etkinlikler/")) {
        const idMetni = yol.slice("/api/etkinlikler/".length);
        const id = Number(idMetni);
        const etkinlik = etkinlikler.find(function (e) {
            return e.id === id;
        });
        if (etkinlik) {
            jsonGonder(yanit, 200, etkinlik);
        } else {
            jsonGonder(yanit, 404, { hata: "Etkinlik bulunamadı" });
        }
        return;
    }

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