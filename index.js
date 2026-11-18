import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDJLcHh0LF7Zz4cfq_gDjni42O7lrECWo",
  authDomain: "dorm-rate-c1.firebaseapp.com",
  projectId: "dorm-rate-c1",
  storageBucket: "dorm-rate-c1.firebasestorage.app",
  messagingSenderId: "771751433438",
  appId: "1:771751433438:web:d1ba244912270507791e4f",
  measurementId: "G-SJFZVNWVL2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const cfw = "https://ancient-snowflake-fe09.coltonscottt.workers.dev"

let selectedDorm = null;
const pages = document.querySelectorAll(".page");

function showPage(className) {
    pages.forEach(page => page.classList.remove("active"));
    document.querySelector("." + className).classList.add("active");
}

document.getElementById("start-button").addEventListener("click", () => {
    showPage("page-select-dorm");
});

document.querySelectorAll(".dorm-options button").forEach(button => {
    button.addEventListener("click", () => {
        selectedDorm = button.textContent;
        showPage("page-dorm-review");
    });
});

document.getElementById("submit-button").addEventListener("click", async () => {
    const text = document.getElementById("review-input").value.trim();
    if (!text) return;
 
    try {
        await addDoc(collection(db, "reviews"), {
            dorm: selectedDorm,
            text: text,
            createdAt: serverTimestamp()
        });
 
        fetch(cfw, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dorm: selectedDorm, text: text })
        }).catch(err => console.error("Discord notify failed:", err));
 
        showPage("page-thank-you");
    } catch (error) {
        console.error("Could not save review:", error);
        alert("Something went wrong saving your response. Please try again. " + error);
    }
});
