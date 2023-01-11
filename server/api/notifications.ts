import admin from 'firebase-admin'
import Parser from "rss-parser"
let parser = new Parser();
import { getMessaging } from 'firebase-admin/messaging';

admin.initializeApp({
    credential: admin.credential.cert(
        {
            type: "service_account",
            project_id: "quotidie-282b4",
            private_key_id: "8a092b87e7dec9e74d6c48a1bf8cc329b38e14a5",
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzOhVvbde7T7mc\n1LEKaoBjDhKdGAgAA6MK0PiKm6+nj49TvkoHIJCO4M8Ajor2oWjWtldgvHlbY5xZ\nBSZlvxt2uOU8fgfp4iSRYfTnPGBjbgFMxZxpVtZ39ce/B2uwbhl3xnRQRtuFCfH1\nmyPKiY4kSvpr2adC3E2SVvUecoEy4W2ElFHQepqVusuQB+qZK8KqK3n0NGBHWtzu\nDqD0HD3yRCcj7AXbuFYNKUypD17OV5wT8XYdaixCqCmNrRvMWTndmiJ1UyjZCoqy\no9YH2WNLBKsH9DBir494UiBz7OCtRc0ztHFkWTgdpgCQ0i8PB1LA8kzzWHCWL863\nUjwX+xY7AgMBAAECggEABpsT8izywBkipriiI9ekDsKUhgy+Mr3vkvT7zCQL19mv\nNy9yzAtzuIhpqMQYNBnj4tIKq2qW8Hrd5twNO7/M89XBwTaF9SVcIq2hGKq9hLyn\nuJwp9Sn5sqcw6wYLfo+4SZVbcSADdEZXEC3dJlhmkEjhLPtzMkArbcLduvcOcwET\nHGzxRkTTckeFIatU62v8PjbyutVgu0T4cdol8klGR8kVzFKvdreMBnwBg4E6C9/R\nGHpqGI9h4NuLwAwlGNMvhV8+ThA/mZ/J7Gg6cvC71k9T7edacTMsOjzQcyZBZV2k\n/RSIOWfhJuXmkOHxOaubtaV1L5nqVtxD3B1pHNbBbQKBgQDzcrULx6WqMin7WAUl\nixDVMPla8M5HzXFQFupLEHUCyFq6uIHzMoTabNj+Q2tTE7FEaBXsP+ZD692WrPhj\nXr6KBOvP/2X7eA/DrFbTfapQQxruunGbxqC+Uw9GNSx0+6lN3Y1hZx0um0qRcON6\ns18ntx3mOQD64ofPur6n2KrtPQKBgQC8d7cjWx3HamezovNklZ0OaaYtczLYqMm7\nmOuoCEy3GoFyNJH/b34fJ0dZ14vSzlLwCt6aqopF5VhrY7YHpyz1auiKYwDEQgtp\nXlse7NV9brLCKQWyYozj94aAlolAi9MKahM2Jj0XQeoXBgTX5zM6v/E/CAQO3qyH\nqdQmsDK41wKBgQCR4eLrtC9p1bWikBRFcxgbKMXD4Rk7nbiRLaooYSw9BqKX0YjN\nmzBRU3iUpQHjPqGzREwezgvGF8kpSW1u3o9/VYOZmIocLs4Di3pcMamlfxDcjY0W\ns+gPJOa6Q5LoZwYFSwY1n/y0uQnuLZ+jH2md+vVHyFD2Blkr+dPV8Ng8YQKBgG+k\nYwI4qW1FpOSOtKtyzTSKdPwbb5VUdxv/vCkvsXIN63xhk9LCku2VcPjRbGyV+B9l\n8POh7oL1FumWiXADIejHSbUgbIXVsbjbQhMRrG2/M3k8n7lKE7e/Gxf1FJz9tyhG\nKdc705iBXVACKsBSntBAf4IdF3pPgdhjS98XJRTFAoGBAO+uaCYlJu4uaYAcK/xB\nE/bZPdUirRK+emfNEsKxMRREX6UcSglsGe+v3D3cqLFUhdokzElenEpNUVUNysWk\nDBlcYNeeeLvx3BM5WGrqsj5PZOFVuO47z5yK2IvoiHDDmqNYkJZpD809BB4XB/ZE\noYubM8prHa4QX7hNhrBNcaWE\n-----END PRIVATE KEY-----\n",
            client_email: "firebase-adminsdk-xp9gx@quotidie-282b4.iam.gserviceaccount.com",
            client_id: "113882821915704470760",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xp9gx%40quotidie-282b4.iam.gserviceaccount.com"
        }
    ),
    databaseURL: "https://quotidie-282b4-default-rtdb.europe-west1.firebasedatabase.app"
});

export default defineEventHandler(async (event) => {
    let feed = await parser.parseURL("https://rss.aelf.org/evangile");
    let title: any = "";
    if (feed.items.length == 1 || feed.items.length == 2) {
        title = feed.items[0].title;
    } else {
        title = feed.items[3].title;
    }

    const notification = {
        title: "Évangile du jour",
        body: title,
        icon: "./quotidieIcon.png",
        click_action: "https://quotidie.fr",
        requireInteraction: true,
        link: "https://quotidie.fr"
    };

    var db = admin.database();
    var ref = db.ref("/users");
    ref.once("value", function (snapshot) {
        let users = snapshot.val()
        for (let index = 0; index < Object.values(users).length; index++) {
            const user: any = Object.values(users)[index];
            console.log("User", user)
            if (user.isSubscribed) sendFCMMessage(user.key, notification).catch(err => console.error(err))
        }
    });
    return { title }
})

async function sendFCMMessage(fcmToken: any, msg: any) {
    try {
        const res = await getMessaging().send({
            webpush: {
                notification: {
                    ...msg,
                    icon: './quotidieIcon.png',
                    requireInteraction: msg.requireInteraction ?? false,
                    actions: [{
                        title: 'Open',
                        action: 'open',
                    }],
                    data: {
                        link: msg.link,
                    },
                },
            },
            token: fcmToken,
        }).then(res => console.log(res));
    } catch (e) {
        console.error('sendFCMMessage error', e);
    }
}