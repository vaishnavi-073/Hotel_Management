
let allRooms = [];       
let currentGuests = [];  
let allBookings = [];    
let roomBeingBooked = null; 



async function loadRooms() {
  try {
    const response = await fetch("hotel-data.json");
    const data = await response.json();
    allRooms = data;
    displayRooms(allRooms);
    updateDashboard();
  } catch (error) {
    console.log("Error loading hotel data:", error);
    document.getElementById("roomGrid").innerHTML =
      "<p>Unable to load room data. Please refresh the page.</p>";
  }
}



function displayRooms(roomsToShow) {
  const roomGrid = document.getElementById("roomGrid");
  roomGrid.innerHTML = "";

  if (roomsToShow.length === 0) {
    roomGrid.innerHTML = "<p>No rooms match your search.</p>";
    return;
  }

  roomsToShow.forEach((room) => {
    const card = document.createElement("div");
    card.className = "room-card";


    let actionButton = "";
    if (room.status === "Available") {
      actionButton = `<button class="btn-book" onclick="openBookingModal(${room.roomNumber})">Book Room</button>`;
    } else if (room.status === "Reserved") {
      actionButton = `<button class="btn-checkin" onclick="checkInGuest(${room.roomNumber})">Check In</button>`;
    } else if (room.status === "Occupied") {
      actionButton = `<button class="btn-checkout" onclick="checkOutGuest(${room.roomNumber})">Check Out</button>`;
    }

    card.innerHTML = `
      <img src="${room.image}" alt="${room.type}" onerror="this.src='https://via.placeholder.com/300x150?text=Room'" />
      <div class="room-card-body">
        <h3>Room ${room.roomNumber} - ${room.type}</h3>
        <p>Price: ₹${room.price} / night</p>
        <p>Capacity: ${room.capacity} guests</p>
        <span class="status-badge status-${room.status}">${room.status}</span>
        ${actionButton}
      </div>
    `;

    roomGrid.appendChild(card);
  });
}



function searchRooms() {
  const searchText = document.getElementById("searchInput").value.toLowerCase().trim();
  const selectedFilter = document.getElementById("filterSelect").value;

  let filteredRooms = allRooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toString().includes(searchText) ||
      room.type.toLowerCase().includes(searchText);
    const matchesFilter = selectedFilter === "All" || room.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  displayRooms(filteredRooms);
}



function filterRooms() {
  searchRooms();
}



function openBookingModal(roomNumber) {
  roomBeingBooked = roomNumber;
  document.getElementById("modalRoomNumber").textContent = roomNumber;
  document.getElementById("guestNameInput").value = "";
  document.getElementById("bookingModal").classList.add("active");
}

function closeBookingModal() {
  roomBeingBooked = null;
  document.getElementById("bookingModal").classList.remove("active");
}

function bookRoom() {
  const guestName = document.getElementById("guestNameInput").value.trim();

  if (guestName === "") {
    alert("Please enter the guest name.");
    return;
  }

  const room = allRooms.find((r) => r.roomNumber === roomBeingBooked);
  if (!room) return;

  room.status = "Reserved";
  room.guestName = guestName;

  allBookings.push({
    guestName: guestName,
    roomNumber: room.roomNumber,
    roomType: room.type,
    status: "Reserved"
  });

  closeBookingModal();
  searchRooms();
  updateDashboard();
  updateBookingsTable();
  showNotice(`Room ${room.roomNumber} booked for ${guestName}.`);
}



function checkInGuest(roomNumber) {
  const room = allRooms.find((r) => r.roomNumber === roomNumber);
  if (!room) return;

  room.status = "Occupied";

  currentGuests.push({
    guestName: room.guestName || "Guest",
    roomNumber: room.roomNumber,
    checkInDate: new Date().toLocaleDateString(),
    status: "Checked In"
  });

  // Update the matching booking record too
  const booking = allBookings.find((b) => b.roomNumber === roomNumber && b.status === "Reserved");
  if (booking) booking.status = "Checked In";

  searchRooms();
  updateDashboard();
  updateGuestsTable();
  updateBookingsTable();
  showNotice(`Guest checked in to Room ${roomNumber}.`);
}



function checkOutGuest(roomNumber) {
  const room = allRooms.find((r) => r.roomNumber === roomNumber);
  if (!room) return;

  room.status = "Available";
  delete room.guestName;

  currentGuests = currentGuests.filter((g) => g.roomNumber !== roomNumber);

  searchRooms();
  updateDashboard();
  updateGuestsTable();
  showNotice(`Room ${roomNumber} checked out and is now available.`);
}


function updateDashboard() {
  const total = allRooms.length;
  const available = allRooms.filter((r) => r.status === "Available").length;
  const occupied = allRooms.filter((r) => r.status === "Occupied").length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statAvailable").textContent = available;
  document.getElementById("statOccupied").textContent = occupied;
  document.getElementById("statBookings").textContent = allBookings.length;
}



function updateBookingsTable() {
  const tableBody = document.getElementById("bookingsTableBody");

  if (allBookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="empty-row">No bookings yet. Book a room from the Rooms tab.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  allBookings.forEach((booking) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${booking.guestName}</td>
      <td>${booking.roomNumber}</td>
      <td>${booking.roomType}</td>
      <td>${booking.status}</td>
    `;
    tableBody.appendChild(row);
  });
}



function updateGuestsTable() {
  const tableBody = document.getElementById("guestsTableBody");

  if (currentGuests.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="empty-row">No guests checked in yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";
  currentGuests.forEach((guest) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${guest.guestName}</td>
      <td>${guest.roomNumber}</td>
      <td>${guest.checkInDate}</td>
      <td>${guest.status}</td>
    `;
    tableBody.appendChild(row);
  });
}



function showNotice(message) {
  const noticeBox = document.getElementById("noticeBox");
  noticeBox.textContent = message;
  setTimeout(() => {
    noticeBox.textContent = "";
  }, 3000);
}



function setupNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSection = button.getAttribute("data-section");

      // Update active button
      navButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Show the matching section, hide the rest
      document.querySelectorAll(".page-section").forEach((section) => {
        section.classList.toggle("active", section.id === targetSection);
      });
    });
  });
}



document.getElementById("searchInput").addEventListener("input", searchRooms);
document.getElementById("filterSelect").addEventListener("change", filterRooms);
document.getElementById("modalCancelBtn").addEventListener("click", closeBookingModal);
document.getElementById("modalConfirmBtn").addEventListener("click", bookRoom);



setupNavigation();
loadRooms();
