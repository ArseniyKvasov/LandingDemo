(() => {
    const pushDataLayerEvent = (eventName, payload = {}) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...payload });
    };

    const reachYandexGoal = (goalName) => {
        if (typeof window.ym === "function") {
            window.ym(111423285, "reachGoal", goalName);
        }
    };

    const landingNav = document.getElementById("landingNav");
    const landingNavToggle = document.getElementById("landingNavToggle");

    const setLandingNavOpen = (isOpen) => {
        if (!landingNav || !landingNavToggle) return;
        landingNav.classList.toggle("is-open", isOpen);
        landingNavToggle.setAttribute("aria-expanded", String(isOpen));
        landingNavToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    };

    landingNavToggle?.addEventListener("click", () => {
        setLandingNavOpen(!landingNav?.classList.contains("is-open"));
    });

    landingNav?.querySelectorAll("a, button").forEach((link) => {
        link.addEventListener("click", () => setLandingNavOpen(false));
    });

    const heroSection = document.querySelector(".fc-landing-hero");
    const heroLiveCards = Array.from(document.querySelectorAll(".fc-hero-live-layer [data-depth]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopParallax = window.matchMedia("(min-width: 992px)").matches;

    if (heroSection && heroLiveCards.length && !reducedMotion && desktopParallax) {
        let pointerX = 0;
        let pointerY = 0;
        let rafId = null;

        const animateCards = () => {
            const rect = heroSection.getBoundingClientRect();
            const dx = (pointerX - rect.left) / Math.max(rect.width, 1) - 0.5;
            const dy = (pointerY - rect.top) / Math.max(rect.height, 1) - 0.5;

            heroLiveCards.forEach((card) => {
                const depth = Number(card.dataset.depth || 0.4);
                card.style.transform = `translate3d(${(-dx * depth * 42).toFixed(2)}px, ${(-dy * depth * 30).toFixed(2)}px, 0)`;
            });
            rafId = null;
        };

        heroSection.addEventListener("pointermove", (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;
            if (!rafId) rafId = requestAnimationFrame(animateCards);
        });

        heroSection.addEventListener("pointerleave", () => {
            heroLiveCards.forEach((card) => {
                card.style.transform = "translate3d(0, 0, 0)";
            });
        });
    }

    const previewOverlay = document.getElementById("lessonPreviewOverlay");
    const previewImage = document.getElementById("lessonPreviewImage");
    const previewClose = document.getElementById("lessonPreviewClose");

    const closeLessonPreview = () => {
        if (!previewOverlay) return;
        previewOverlay.classList.add("d-none");
        previewOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lesson-preview-open");
        if (previewImage) {
            previewImage.src = "";
            previewImage.alt = "";
        }
    };

    document.querySelectorAll(".js-lesson-preview-card").forEach((card) => {
        const openPreview = () => {
            if (!previewOverlay || !previewImage) return;
            previewImage.src = card.dataset.previewSrc || "";
            previewImage.alt = card.dataset.previewAlt || "Lesson preview";
            previewOverlay.classList.remove("d-none");
            previewOverlay.setAttribute("aria-hidden", "false");
            document.body.classList.add("lesson-preview-open");
        };

        card.addEventListener("click", openPreview);
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPreview();
            }
        });
    });

    previewClose?.addEventListener("click", closeLessonPreview);
    previewOverlay?.addEventListener("click", (event) => {
        if (event.target === previewOverlay) closeLessonPreview();
    });

    const inviteModal = document.getElementById("inviteModal");
    const inviteForm = document.getElementById("inviteForm");
    const inviteSubmit = document.querySelector(".fc-invite-submit");
    const inviteSuccess = document.getElementById("inviteSuccess");
    const inviteTitle = document.getElementById("inviteTitle");
    const inviteSuccessTitle = document.getElementById("inviteSuccessTitle");
    const inviteModalInstance = inviteModal && window.bootstrap
        ? window.bootstrap.Modal.getOrCreateInstance(inviteModal)
        : null;

    const updateInviteSubmitState = () => {
        if (!inviteForm || !inviteSubmit) return;
        inviteSubmit.disabled = !inviteForm.checkValidity();
    };

    const closeInviteModal = () => {
        if (!inviteModal) return;
        inviteForm?.reset();
        if (inviteForm) inviteForm.hidden = false;
        if (inviteSuccess) inviteSuccess.hidden = true;
        if (inviteTitle) inviteTitle.hidden = false;
        inviteModal.classList.remove("fc-invite-modal-success");
        inviteModal.setAttribute("aria-labelledby", "inviteTitle");
        inviteModal.setAttribute("aria-label", "Registration");
        updateInviteSubmitState();
    };

    const openInviteModal = () => {
        if (!inviteModalInstance) return;
        updateInviteSubmitState();
        inviteModalInstance.show();
    };

    document.querySelectorAll(".js-open-invite-modal").forEach((button) => {
        button.addEventListener("click", openInviteModal);
    });
    inviteModal?.addEventListener("shown.bs.modal", () => {
        window.setTimeout(() => inviteModal.querySelector("input")?.focus(), 0);
    });
    inviteModal?.addEventListener("hidden.bs.modal", closeInviteModal);
    inviteForm?.addEventListener("input", updateInviteSubmitState);
    inviteForm?.addEventListener("change", updateInviteSubmitState);
    inviteForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!inviteForm.checkValidity()) {
            inviteForm.reportValidity();
            updateInviteSubmitState();
            return;
        }
        pushDataLayerEvent("sign_up", {
            method: "email_password",
            registration_status: "invitation_requested",
        });
        reachYandexGoal("sign_up");
        inviteForm.hidden = true;
        if (inviteSuccess) inviteSuccess.hidden = false;
        if (inviteTitle) inviteTitle.hidden = true;
        inviteModal.classList.add("fc-invite-modal-success");
        inviteModal.removeAttribute("aria-labelledby");
        inviteModal.setAttribute("aria-label", "Invitation status");
        inviteSuccessTitle?.focus();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeLessonPreview();
        setLandingNavOpen(false);
    });
})();
