const token = localStorage.getItem("jwtToken");

if (!token) {
  alert("Bạn chưa đăng nhập!");
  window.location.href = "../pages/login.html";
}

async function fetchMyProfile() {
  try {
    const res = await fetch("http://localhost:8080/api/profile/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      document.getElementById("profile-info").innerHTML =
        `<span style='color:red'>Không tải được profile! (Lỗi ${res.status})</span>`;
      return;
    }

    const data = await res.json();
    renderProfile(data);
  } catch (err) {
    document.getElementById("profile-info").innerHTML =
      "<span style='color:red'>Lỗi kết nối server!</span>";
  }
}

function renderProfile(data) {
  document.getElementById("profile-info").innerHTML = `
    <img src="${data.avatar}" alt="Avatar" width="120" height="120" style="border-radius: 50%; margin-bottom: 16px;" />
    <h2>${data.fullname || "Chưa có tên đầy đủ"}</h2>
    <p>@${data.username}</p>
    <p><strong>Bio:</strong> ${data.bio || "Không có bio"}</p>
    <p><strong>Ngày sinh:</strong> ${data.dob || "Không rõ"}</p>
    <p><strong>Sở thích:</strong> ${data.hobbies || "Không có"}</p>
  `;
}

fetchMyProfile();
