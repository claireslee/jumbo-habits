(function () {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      window.location.href = "/login.html";
    }
  })();
  