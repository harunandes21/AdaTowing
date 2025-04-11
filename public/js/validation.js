const form = document.getElementById('contactForm');
const successMsg = document.getElementById('form-message-success');

// Restrict name to letters and spaces only
form.name.addEventListener('input', () => {
    form.name.value = form.name.value.replace(/[^a-zA-Z\s]/g, '');
});

// Restrict phone to digits and format as XXX-XXX-XXXX
form.pnumber.addEventListener('input', () => {
    let digits = form.pnumber.value.replace(/\D/g, '').substring(0, 10);
    let formatted = digits.replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) => {
        return `${p1}-${p2}-${p3}`;
    }).replace(/-$/, '');
    form.pnumber.value = formatted;
});

// Restrict email input to alphanumerics, dots, dashes, and @
form.email.addEventListener('input', () => {
    form.email.value = form.email.value.replace(/[^a-zA-Z0-9@._-]/g, '');
});

// Anti-bot: Honeypot field (hidden) must stay empty
const honeypot = document.getElementById('website');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const pnumber = form.pnumber.value.trim();
    const message = form.message.value.trim();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (honeypot && honeypot.value !== '') {
        alert("Bot submission blocked.");
        return;
    }

    if (!name || !email || !pnumber || !message) {
        alert("Please fill in all fields.");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!phoneRegex.test(pnumber)) {
        alert("Phone must be in XXX-XXX-XXXX format.");
        return;
    }

    if (message.length < 10) {
        alert("Message should be at least 10 characters.");
        return;
    }

    try {
        const response = await fetch('https://adatowing-production.up.railway.app/api/contact', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, pnumber, message })
        });

        const data = await response.json();

        if (data.success) {
            showToast()
            form.reset();
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (err) {
        console.error("❌ Client error:", err);
        showErrorToast();
    }
    function showToast() {
        const toast = document.getElementById('formToast');
        toast.style.display = 'flex';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 4000);
    }

    function showErrorToast() {
        const toast = document.getElementById('formToastError');
        toast.style.display = 'flex';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 5000);
    }


});
