console.log("JS LOADED");

const bookingForm = document.getElementById("bookingForm");
const dateInput = document.getElementById("date");
const slotButtons = document.querySelectorAll(".slot-btn");
const slotError = document.getElementById("slotError");

let selectedSlot = null;

// Initialize: Set min date to today
const today = new Date().toISOString().split('T')[0];
if (dateInput) dateInput.min = today;

/* ---------------- SLOT SELECTION ---------------- */
if (slotButtons.length > 0) {
  slotButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.disabled || btn.classList.contains("booked")) return;

      // Deselect all
      slotButtons.forEach(b => {
        b.classList.remove("btn-success");
        b.classList.add("btn-outline-success");
      });

      // Select clicked
      btn.classList.remove("btn-outline-success");
      btn.classList.add("btn-success");

      selectedSlot = btn.innerText;
      slotError.style.display = "none";
    });
  });
}

/* ---------------- DATE CHANGE: FETCH SLOTS ---------------- */
if (dateInput) {
  dateInput.addEventListener("change", async () => {
    // Reset selection
    selectedSlot = null;
    slotButtons.forEach(b => {
      b.classList.remove("btn-success", "booked");
      b.classList.add("btn-outline-success");
      b.disabled = false;
    });

    const dateVal = dateInput.value;
    if (!dateVal) return;

    try {
      const response = await fetch(`/booked-slots?date=${dateVal}`);
      const bookedSlots = await response.json();

      slotButtons.forEach(btn => {
        if (bookedSlots.includes(btn.innerText)) {
          btn.classList.remove("btn-outline-success");
          btn.classList.add("btn-secondary", "booked"); // Visual style for booked
          btn.disabled = true;
        }
      });
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  });
}

/* ---------------- FORM SUBMISSION ---------------- */
if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Validate Slot
    if (!selectedSlot) {
      slotError.style.display = "block";
      return;
    }

    // 2. Gather Data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phonenumber").value;
    const gender = document.getElementById("gender").value;
    const date = dateInput.value;

    // 3. Send Payload
    try {
      const response = await fetch("/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, gender, date, slot: selectedSlot
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("Booking Successful! Redirecting to available slots...");
        // Reset form
        bookingForm.reset();
        selectedSlot = null;
        slotButtons.forEach(b => {
          b.classList.remove("btn-success");
          b.classList.add("btn-outline-success");
        });

        // Redirect as requested
        window.location.href = "/view-slots";
      } else {
        alert("Error: " + data.message);
        // If collision, refresh slots
        dateInput.dispatchEvent(new Event('change'));
      }

    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred while booking.");
    }
  });
}
