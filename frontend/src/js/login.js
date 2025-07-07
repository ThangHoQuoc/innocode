async function login() {
  const usernameInput = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!usernameInput || !password) {
    alert("Vui lòng nhập đủ thông tin đăng nhập.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: usernameInput, password })
    });

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("jwtToken", data.token);

      let username = "";
      if (data.user && typeof data.user === "object") {
        username = data.user.username;
      } else if (typeof data.user === "string") {
        username = data.user;
      } else if (data.username) {
        username = data.username;
      }

      localStorage.setItem("currentUser", username);

      alert("✅ Đăng nhập thành công!");
      window.location.href = "index.html";
    } else {
      const errorText = await response.text();
      alert("❌ Đăng nhập thất bại: " + errorText);
    }
  } catch (err) {
    alert("❌ Không thể kết nối tới server: " + err.message);
  }
}
