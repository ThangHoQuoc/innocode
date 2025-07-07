async function signup() {
  const username = document.getElementById("signup_username").value.trim();
  const password = document.getElementById("signup_password").value.trim();
  if (!username || !password) return alert("Please enter all required information.");

  try {
    const response = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      let data = {};
      try {
        data = await response.json();
      } catch {}

      if (data.token) localStorage.setItem("jwtToken", data.token);
      if (data.username || (data.user && data.user.username)) {
        localStorage.setItem("currentUser", data.username || data.user.username);
      } else {
        localStorage.setItem("currentUser", username);
      }
      if (data.avatar) localStorage.setItem("currentUserAvatar", data.avatar);

      alert("✅ Đăng ký thành công! Vui lòng cập nhật thông tin cá nhân.");
      window.location.href = "update_profile.html";
    } else {
      const errorText = await response.text();
      alert("❌ Sign up failed: " + errorText);
    }
  } catch (err) {
    alert("❌ Cannot connect to server: " + err.message);
  }
}
