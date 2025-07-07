const token = localStorage.getItem("jwtToken");
const currentUser = localStorage.getItem("currentUser");

if (!token || !currentUser) {
  window.location.href = "../pages/login.html";
}

document.getElementById("currentUserDisplay").innerText = currentUser;

function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("currentUser");
  window.location.href = "../pages/login.html";
}

async function submitPost() {
  const textarea = document.getElementById("postContent") || document.querySelector(".post-form textarea");
  const content = textarea.value.trim();
  const mediaInput = document.querySelector('.post-media');
  const files = mediaInput && mediaInput.files ? Array.from(mediaInput.files) : [];

  if (!content && files.length === 0) return alert("Post cannot be empty");

  try {
    const formData = new FormData();
    formData.append('content', content);
    files.forEach(file => formData.append('media', file));

    const res = await fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      const newPost = await res.json();
      textarea.value = "";
      if (mediaInput) mediaInput.value = "";
      prependPost(newPost);
    } else {
      const errorText = await res.text();
      alert("❌ Post failed: " + errorText);
    }
  } catch (err) {
    alert("❌ Cannot connect to server: " + err.message);
  }
}

function prependPost(post) {
  const postList = document.querySelector(".post-list");
  const postHtml = renderPostHtml(post);
  postList.insertAdjacentHTML('afterbegin', postHtml);
}

async function fetchFeed() {
  try {
    const res = await fetch("http://localhost:8080/api/posts/feed", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      document.querySelector(".post-list").innerHTML = "<div style='color:red'>Không tải được bài viết!</div>";
      return;
    }

    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    document.querySelector(".post-list").innerHTML = "<div style='color:red'>Lỗi kết nối server!</div>";
  }
}

function renderPosts(posts) {
  const postList = document.querySelector(".post-list");
  if (!posts.length) {
    postList.innerHTML = "<div style='color:gray'>Chưa có bài viết nào.</div>";
    return;
  }

  const filtered = posts.filter(p => p.username !== currentUser);
  postList.innerHTML = filtered.map(renderPostHtml).join("");
}

function renderPostHtml(post) {
  const mediaHtml = (post.media || []).map(url => {
    return url.match(/\.(mp4|webm|ogg)$/i)
      ? `<video controls style="max-width:100%;margin:8px 0;" src="${url}"></video>`
      : `<img style="max-width:100%;margin:8px 0;" src="${url}" />`;
  }).join('');

  const liked = !!post.liked;
  const heart = liked ? '❤️' : '♡';
  const btnClass = liked ? 'like-btn liked' : 'like-btn';

  return `
    <div class="post" data-id="${post.id || ''}">
      <div class="user-info">
        <img class="avatar" src="${post.avatar || `https://i.pravatar.cc/40?u=${post.username}`}" />
        <div class="username-time">
          <div class="username">${post.username}</div>
          <div class="time">${post.timeAgo || 'Vừa xong'}</div>
        </div>
      </div>
      <div class="content">${post.content || ''}</div>
      ${mediaHtml}
      <div class="actions">
        <button class="${btnClass}" onclick="likePost(this)" data-id="${post.id}" data-liked="${liked}">
          ${heart} <span class="like-count">${post.likes || 0}</span>
        </button>
        <button onclick="alert('Comment!')">💬 ${post.comments || 0}</button>
        <button onclick="alert('Shared!')">🔁</button>
      </div>
    </div>
  `;
}

window.likePost = async function (btn) {
  const postId = btn.getAttribute('data-id');
  const liked = btn.getAttribute('data-liked') === 'true';
  const span = btn.querySelector('.like-count');

  btn.disabled = true;

  try {
    const res = await fetch(`http://localhost:8080/api/posts/${postId}/${liked ? "unlike" : "like"}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      const newLikes = await res.json();
      btn.setAttribute("data-liked", !liked);
      btn.classList.toggle("liked", !liked);
      btn.innerHTML = `${!liked ? '❤️' : '♡'} <span class="like-count">${newLikes}</span>`;
    } else {
      alert("❌ Không thể xử lý like/unlike");
    }
  } catch (err) {
    alert("❌ Lỗi kết nối");
  }

  btn.disabled = false;
};

window.addEventListener("DOMContentLoaded", () => {
  fetchFeed();
  document.querySelector(".post-btn").onclick = submitPost;
  document.querySelector(".post-form textarea").id = "postContent";
});
