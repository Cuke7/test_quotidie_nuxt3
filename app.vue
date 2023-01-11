<template>
    <div class="h-screen flex items-center flex-col px-4 pb-4 sm:px-0">
        <div class="text-6xl text-red-800 font-bold font-mono mt-14 sm:mt-16">Quotidie</div>
        <div class="absolute top-8 right-8 sm:hidden">
            <label for="toogleA" class="flex items-center cursor-pointer">
                <!-- toggle -->
                <div class="relative">
                    <!-- input -->
                    <input id="toogleA" type="checkbox" class="sr-only" v-model="notif" />
                    <!-- line -->
                    <div class="w-10 h-4 bg-gray-300 rounded-full shadow-inner"></div>
                    <!-- dot -->
                    <div class="dot absolute w-8 h-8 rounded-full -left-3 -top-2 transition">
                        <BellIcon v-if="notif" class="text-red-800"></BellIcon>
                        <BellSlashIcon v-else class="text-red-800"></BellSlashIcon>
                    </div>
                </div>
            </label>
        </div>
        <div class="my-4 font-mono italic sm:mb-12">
            {{ dateDisplay }}
        </div>
        <div class="font-sans font-bold px-8 text-lg w-full sm:w-1/2 mb-8">{{ evangile.title }}</div>
        <div class="w-full sm:w-1/2 px-8 pb-8" v-html="evangile.evangile" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { BellIcon, BellSlashIcon } from "@heroicons/vue/24/solid";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as refdb, set } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";

const notif = ref(false);

const key = "BAxrYfTRHfXYumaEmMWoPAE1mZ0r0UpWTHEdeHqOtovLj7J14UPxxCBQMeygqv5QgrcQiA_QVqWtXLSvfhHgWO0";

const firebaseConfig = {
    apiKey: "AIzaSyDIKeZJez9AVZs_hIXMH_BcyBGGv8YeQGg",
    authDomain: "quotidie-282b4.firebaseapp.com",
    projectId: "quotidie-282b4",
    storageBucket: "quotidie-282b4.appspot.com",
    messagingSenderId: "885662934483",
    appId: "1:885662934483:web:138cb04c10cde188c13b26",
    databaseURL: "https://quotidie-282b4-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messaging = getMessaging(app);

const auth = getAuth();
auth.languageCode = "fr";

const evangile = ref({ title: "", evangile: "" });
const date = new Date();
const dateDisplay = ref(date.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "2-digit" }));

onMounted(async () => {
    const { data } = await axios.get("/api/evangile");
    evangile.value = data;
});

const provider = new GoogleAuthProvider();
const user = ref<any>(null);
watch(
    notif,
    async (isChecked) => {
        if (isChecked) {
            if (!user.value) {
                const result: any = await signInWithPopup(auth, provider).catch((err) => console.error(err));
                user.value = result.user;
                console.log("Registering for notifications!");
                const token = await getToken(messaging, { vapidKey: key });
                await set(refdb(db, "users/" + user.value.uid), {
                    name: user.value.displayName,
                    isSubscribed: true,
                    key: token,
                });
            }
        } else {
            await set(refdb(db, "users/" + user.value.uid), {
                name: user.value.displayName,
                isSubscribed: false,
                key: "",
            });
            console.log("Logging out...");
            signOut(auth);
        }
    },
    {
        flush: "post",
    }
);

onAuthStateChanged(auth, (user2) => {
    if (user2) {
        user.value = user2;
        notif.value = true;
        console.log("Signed in!", user.value);
    } else {
        // writeUserData(false, user.value.uid);
        user.value = null;
        notif.value = false;
        console.log("Signed out!");
    }
});
</script>

<style>
body {
    background-image: url("./assets/background.jpg");
    background-repeat: repeat;
}

/* width */
::-webkit-scrollbar {
    width: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #991b1b;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}

input:checked ~ .dot {
    transform: translateX(100%);
    /* background-color: #991b1b; */
}
</style>
