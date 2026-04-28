const { Client, Options } = require('discord.js-selfbot-v13');
const http = require('http');

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});

// Tokens desde variables de entorno (Render)
const tokens = [
    process.env.TOKENS_1,
    process.env.TOKENS_2,
    process.env.TOKENS_3
].filter(t => t && t.trim() !== '');

if (tokens.length === 0) {
    console.error("❌ No se encontraron tokens. Configura TOKENS_1, TOKENS_2, TOKENS_3");
    process.exit(1);
}

const CANALES = [
    "1362424572909060206",
    "1447058711943319746",
    "1362424410828574974"
];

const IDS_UNIFICADAS = [
    1490277865818689700, 1494684335352316065, 1442335922111910024,
    1346593401088249977, 1429887342373765146, 1493426752536711230,
    1493834586755694672, 1425209744603218020, 1492265983165862029,
    1427713721479987232, 984956970014486528, 1072352198836621385,
    1429177016703516764, 1438314463970328578, 1446586105553227807,
    957014429822750771, 1423439348430405722, 1455444386421674007,
    1394021604127936772, 1452533908699611236, 1459077041637953651,
    1468117706099396816, 1467397075204309034, 1466878653932634195,
    1458314974794616902, 1470913175401533543, 1464354934785839155,
    1394023020896714762, 1399500980889976902, 1462897561894649876,
    1386330375952793723, 1353778890514108456, 1480289152397213907,
    1457175804290007197, 1490277865818689700, 1492675664682287277,
    1487148931535212817, 1457521662303015040, 1496702893594640384,
    1271616299851583580
].map(id => `<@${id}>`).join(' ');

const TEXTO_PRINCIPAL = `COMENZAMOS ESTIRANDOTE LA NALGAVINA
TODO COMIENZA CUANDO PENETRAS EL CULO DE <@1487148931535212817>
ID: cejotorra jajajajaja kevina paredes grises`;

const TEXTOS_SPAM = [
    TEXTO_PRINCIPAL,
    "JSJSJS MEJICHANGAS RETIRADAS AL SPAM ETERNO 🤣🤣🤣 PEDORRASO DE MAMITAS CHIE ACÁ SE VAN A QUEDAR HASTA Q YO ME MUERA JSJSJSJS😂",
    "PVTITA RETIRADA VÁMONOS A SPOM DE AÑOS POR NO DECIR TODA LA VDIA😂🤣🤣🤣🤣 MEJICHANGA MONCLOVEÑANGA COAHUILA PUTA JSJSJSJS"
];

const MULTIMEDIA = [
    "https://files.catbox.moe/nlvkg4.mp4",
    "https://cdn.discordapp.com/attachments/1369181247896817685/1483287824055799870/descarga_6.mp4"
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function spamLoop(client, idx) {
    const nombre = `Bot${idx}`;
    let contador = 0;
    
    while (true) {
        for (const canalId of CANALES) {
            try {
                const canal = await client.channels.fetch(canalId);
                if (canal && canal.isText()) {
                    const texto = TEXTOS_SPAM[Math.floor(Math.random() * TEXTOS_SPAM.length)];
                    const media = MULTIMEDIA[Math.floor(Math.random() * MULTIMEDIA.length)];
                    const salt = `[\`${Math.random().toString(36).substring(7).toUpperCase()}\`]`;
                    
                    await canal.send(`${IDS_UNIFICADAS}\n${texto}\n${media}\n${salt}`);
                    console.log(`✅ [${nombre}] spam #${++contador} | ${canalId}`);
                    break;
                }
            } catch (e) {
                console.log(`❌ [${nombre}] error: ${e.message}`);
                await sleep(5000);
            }
        }
        // Espera entre 15-45 segundos (aleatorio, individual por bot)
        const espera = Math.random() * 30000 + 15000;
        await sleep(espera);
    }
}

function programarReconexion(client, token, idx) {
    const tiempo = Math.random() * 14400000 + 3600000; // 1-5 horas
    setTimeout(async () => {
        console.log(`🔄 [Bot${idx}] reconectando...`);
        await client.destroy();
        await sleep(5000);
        launchBot(token, idx);
    }, tiempo);
}

function launchBot(token, idx) {
    const agent = new http.Agent({ keepAlive: true });
    
    const client = new Client({
        checkUpdate: false,
        makeCache: Options.cacheWithLimits({ 
            MessageManager: 0, 
            PresenceManager: 0, 
            UserManager: 0, 
            GuildMemberManager: 0 
        }),
        patchVoice: false,
        ws: { 
            properties: { 
                $os: 'Windows', 
                $browser: 'Discord Client', 
                $device: 'desktop' 
            } 
        },
        http: { 
            agent, 
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
            } 
        }
    });
    
    client.on('ready', () => {
        console.log(`🚀 [Bot${idx}] conectado: ${client.user.username}`);
        spamLoop(client, idx);
    });
    
    client.login(token).catch(e => console.log(`❌ [Bot${idx}] login fail: ${e.message}`));
    programarReconexion(client, token, idx);
}

// Servidor HTTP para que Render no duerma el proceso
http.createServer((req, res) => res.end("OK")).listen(3000);

console.log(`🎯 Iniciando ${tokens.length} bots en ${CANALES.length} canales...`);

tokens.forEach((token, i) => {
    const retraso = Math.random() * 15000 + 5000;
    console.log(`⏰ Bot${i+1} inicia en ${Math.round(retraso/1000)}s`);
    setTimeout(() => launchBot(token, i+1), retraso);
});
