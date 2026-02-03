// Load data from Firebase
async function loadContent() {
    try {
        // Load header info
        const headerDoc = await db.collection("content").doc("header").get();
        if (headerDoc.exists) {
            const header = headerDoc.data();
            document.getElementById("header-name").textContent =
                header.name || "Alok Das";
            document.getElementById("header-subtitle").textContent =
                header.subtitle || "Chemistry × Flutter — building useful things";
        }

        // Load footer info
        const footerDoc = await db.collection("content").doc("footer").get();
        if (footerDoc.exists) {
            const footer = footerDoc.data();
            document.getElementById("footer-made").innerHTML =
                footer.madeWith ||
                'Made with <span class="footer-heart">♥</span> using Chemistry & Code';
            document.getElementById("footer-copyright").textContent =
                footer.copyright || "© 2025 Alok Das";
        }

        // Load portfolio link
        const linksDoc = await db.collection("content").doc("links").get();
        if (linksDoc.exists) {
            const links = linksDoc.data();
            if (links.portfolio) {
                const portfolioTile = document.querySelector(".grid a.tile");
                portfolioTile.href = links.portfolio;
            }
        }
    } catch (error) {
        console.error("Error loading content:", error);
    }
}

// Load items for modals from subcollection
async function loadModalItems(type, listId) {
    try {
        // Access subcollection: content/category/{type}
        const snapshot = await db
            .collection("content")
            .doc("category")
            .collection(type)
            .orderBy("order")
            .get();
        const list = document.getElementById(listId);

        if (snapshot.empty) {
            list.innerHTML = '<div class="loading">No items found</div>';
            return;
        }

        list.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement("div");
            item.className = "item";

            if (data.locked === true) {
                // Item is LOCKED
                item.classList.add("locked");

                // 1. Show only the 🔒 emoji
                // 2. Don't load description or link from Firebase
                item.innerHTML = `
                <div class="lock-badge">🔒</div>
                <div class="item-title">${data.title}</div>
                <div class="item-desc">Content locked</div>
              `;
            } else {
                // Item is UNLOCKED (original logic)
                item.innerHTML = `
                <div class="item-title">${data.title}</div>
                ${data.description
                        ? `<div class="item-desc">${data.description}</div>`
                        : ""
                    }
                ${data.link
                        ? `<a href="${data.link
                        }" class="item-link" target="_blank">${data.linkText || "View →"
                        }</a>`
                        : ""
                    }
              `;
            }

            list.appendChild(item);
        });
    } catch (error) {
        console.error(`Error loading ${type}:`, error);
        document.getElementById(listId).innerHTML =
            '<div class="loading">Error loading items</div>';
    }
}

function openModal(type) {
    document.getElementById(type + "-modal").classList.add("active");
    document.body.style.overflow = "hidden";

    // Load data when modal opens
    const listMap = {
        projects: "projects-list",
        apps: "apps-list",
        social: "social-list",
        contact: "contact-list",
    };

    loadModalItems(type, listMap[type]);
}

function closeModal(type) {
    document.getElementById(type + "-modal").classList.remove("active");
    document.body.style.overflow = "auto";
}

// Close modal when clicking outside
document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.classList.remove("active");
        });
        document.body.style.overflow = "auto";
    }
});

// Load initial content
loadContent();