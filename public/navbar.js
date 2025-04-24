// function loadNavbar() {
//     const user = JSON.parse(localStorage.getItem("user"));
  
//     const nav = document.createElement("nav");
//     nav.innerHTML = `
//       <div class="logo">
//         <a href="/index.html">🐘 Jumbo Habits</a>
//      </div>
//     <ul>
//       <li class="dropdown">
//         <a href="journal.html">Logging</a>
//         <ul class="dropdown-content">
//           <li><a href="habit_tracker.html">Habits</a></li>
//           <li><a href="journal.html">Journal</a></li>
//         </ul>
//       </li>

//       <li class="dropdown">
//         <a href="/habit_tracker.html">View Past</a>
//         <ul class="dropdown-content">
//           <li><a href="habit-filter.html">Habits</a></li>
//           <li><a href="journal-filter.html">Journal</a></li>
//         </ul>
//       </li>

//       <li><a href="todo.html">To-Do</a></li>
//       <li><a href="streak.html">Streaks</a></li>
//       <li><a href="subscription.html">Upgrade</a></li>
//       <li><a href="resources.html">Resources</a></li>
//       <li><a href="#" id="auth-button">${user ? 'Logout' : 'Login'}</a></li>
//     </ul>
//     `;
  
//     document.body.prepend(nav);
  
//     const authBtn = document.getElementById("auth-button");
//     if (user) {
//       authBtn.addEventListener("click", () => {
//         localStorage.removeItem("user");
//         window.location.href = "/login.html";
//       });
//     } else {
//       authBtn.setAttribute("href", "/login.html");
//     }
//   }
  
//   window.addEventListener("DOMContentLoaded", loadNavbar);
  
function loadNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const planStatus = user ? localStorage.getItem(`plan_${user.userId}`) : "free";

  const nav = document.createElement("nav");
  nav.innerHTML = `
    <div class="logo">
      <a href="/index.html">🐘 Jumbo Habits</a>
    </div>
    <ul>
      <li class="dropdown">
        <a href="journal.html">Logging</a>
        <ul class="dropdown-content">
          <li><a href="habit_tracker.html">Habits</a></li>
          <li><a href="journal.html">Journal</a></li>
        </ul>
      </li>

      <li class="dropdown">
        <a href="/habit_tracker.html">View Past</a>
        <ul class="dropdown-content">
          <li><a href="habit-filter.html">Habits</a></li>
          <li><a href="journal-filter.html">Journal</a></li>
        </ul>
      </li>

      <li><a href="todo.html">To-Do</a></li>

      ${planStatus === 'premium' ? `<li><a href="streaks.html">Streaks</a></li>` : ''}

      <li><a href="subscription.html">Upgrade</a></li>
      <li><a href="resources.html">Resources</a></li>
      <li><a href="#" id="auth-button">${user ? 'Logout' : 'Login'}</a></li>
    </ul>
  `;

  document.body.prepend(nav);

  const authBtn = document.getElementById("auth-button");
  if (user) {
    authBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "/login.html";
    });
  } else {
    authBtn.setAttribute("href", "/login.html");
  }
}

window.addEventListener("DOMContentLoaded", loadNavbar);
