// Kiểm tra token/username ngay khi load trang
(function () {
  const token = localStorage.getItem('jwtToken');
  const user = localStorage.getItem('currentUser');
  if (!token || !user) {
    alert('Bạn chưa đăng nhập hoặc token đã hết hạn. Vui lòng đăng nhập lại!');
    window.location.href = '../pages/login.html';
  }
})();

// Preview avatar
document.getElementById('avatar').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      document.getElementById('avatarImg').src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('profileForm').onsubmit = async function (e) {
  e.preventDefault();
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    alert('Bạn chưa đăng nhập hoặc token đã hết hạn. Vui lòng đăng nhập lại!');
    window.location.href = '../pages/login.html';
    return;
  }

  // Kiểm tra avatar
  const avatarInput = document.getElementById('avatar');
  if (!avatarInput.files || !avatarInput.files[0]) {
    alert('Vui lòng chọn ảnh đại diện!');
    avatarInput.focus();
    return;
  }

  // Kiểm tra các trường bắt buộc
  const fullname = document.getElementById('fullname').value.trim();
  const dob = document.getElementById('dob').value;
  const bio = document.getElementById('bio').value.trim();
  if (!fullname || !dob || !bio) {
    alert('Vui lòng nhập đầy đủ các trường bắt buộc!');
    return;
  }

  const formData = new FormData();
  formData.append('avatar', avatarInput.files[0]);
  formData.append('fullname', fullname);
  formData.append('dob', dob);
  formData.append('bio', bio);
  formData.append('hobbies', document.getElementById('hobbies').value.trim());
  formData.append('nickname', document.getElementById('nickname').value.trim());

  try {
    const res = await fetch('http://localhost:8080/api/profile/update', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.status === 401) {
      alert('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('currentUser');
      window.location.href = '../pages/login.html';
      return;
    }

    if (res.ok) {
      try {
        const data = await res.json();
        if (data.token) localStorage.setItem('jwtToken', data.token);
        if (data.username || (data.user && data.user.username)) {
          localStorage.setItem('currentUser', data.username || data.user.username);
        }
      } catch (err) {
        console.error('Lỗi parse JSON:', err);
      }
      alert('Cập nhật thành công!');
      window.location.href = '../pages/index.html';
    } else {
      const err = await res.text();
      alert('Lỗi cập nhật: ' + err);
      console.error('Lỗi cập nhật:', err);
    }
  } catch (err) {
    alert('Lỗi kết nối server: ' + err.message);
    console.error('Lỗi fetch:', err);
  }
};
