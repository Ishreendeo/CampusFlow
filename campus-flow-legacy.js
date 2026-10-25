/* ============ DYNAMIC DATE SYSTEM ============ */
function updateDynamicDates() {
    const now = new Date();
    
    // Teacher date format: "Sunday, September 13, 2026"
    const optionsFull = { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' };
    const teacherDateBox = document.getElementById("teacherDateBox");
    if (teacherDateBox) {
        teacherDateBox.textContent = now.toLocaleDateString('en-US', optionsFull);
    }
    
    const teacherTodayDay = document.getElementById("teacherTodayDay");
    if (teacherTodayDay) {
        teacherTodayDay.textContent = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    }

    // Student date format: "Sun, 13 Sep 2026"
    const optionsShort = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const studentDateText = document.getElementById("studentDateText");
    if (studentDateText) {
        studentDateText.textContent = now.toLocaleDateString('en-GB', optionsShort);
    }

    // Month label for heatmap: "SEP 2026"
    const currentMonthLabel = document.getElementById("currentMonthLabel");
    if (currentMonthLabel) {
        const monthShort = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        currentMonthLabel.textContent = monthShort + " " + now.getFullYear();
    }
}

updateDynamicDates();


/* ============ ROUTING & VIEW CONTROLLER ============ */
const homeView = document.getElementById("homeView");
const loginView = document.getElementById("loginView");
const teacherView = document.getElementById("teacherView");
const studentView = document.getElementById("studentView");

function showView() {
    const hash = location.hash || "#home";

    homeView.hidden = true;
    loginView.hidden = true;
    teacherView.hidden = true;
    studentView.hidden = true;

    if (hash === "#login") {
        loginView.hidden = false;
    } else if (hash === "#teacher") {
        teacherView.hidden = false;
    } else if (hash === "#student") {
        studentView.hidden = false;
    } else {
        homeView.hidden = false;
    }

    window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showView);
showView();

function logout() {
    location.hash = "#login";
}


/* ============ 1. HOMEPAGE SCRIPTS ============ */
const siteNav = document.getElementById("siteNav");

function updateNavState() {
    if (window.scrollY > 40) {
        siteNav.classList.add("is-scrolled");
    } else {
        siteNav.classList.remove("is-scrolled");
    }
}
updateNavState();
window.addEventListener("scroll", updateNavState, { passive: true });

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle) {
    navToggle.addEventListener("click", function () {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// Stats counter
const statNumbers = document.querySelectorAll(".stat-num");

function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 900;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window && statNumbers.length) {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(function (el) {
        observer.observe(el);
    });
} else {
    statNumbers.forEach(function (el) {
        el.textContent = el.dataset.target;
    });
}


/* ============ 2. LOGIN SYSTEM ============ */
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");
const rememberMe = document.getElementById("rememberMe");
const forgotPassword = document.getElementById("forgotPassword");

const savedUsername = localStorage.getItem("campusFlowUsername");
if (savedUsername) {
    usernameInput.value = savedUsername;
    rememberMe.checked = true;
}

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const u = usernameInput.value.trim();
    const p = passwordInput.value.trim();

    message.textContent = "";
    submitBtn.classList.remove("success");
    submitBtn.disabled = false;
    submitBtn.textContent = "Log in";

    if (!u || !p) {
        message.textContent = "Please fill in all the fields.";
        message.style.color = "#e53935";
        return;
    }

    const studentUsernames = ["student", "sana", "sana.garg@campusflow.edu"];
    const teacherUsernames = ["teacher", "meera", "meera.kapoor@campusflow.edu", "admin"];

    const isStudent = studentUsernames.includes(u.toLowerCase()) && p === "1234";
    const isTeacher = teacherUsernames.includes(u.toLowerCase()) && p === "1234";

    if (!isStudent && !isTeacher) {
        message.textContent = "Invalid credentials! Use demo login details shown above.";
        message.style.color = "#e53935";
        return;
    }

    if (rememberMe.checked) {
        localStorage.setItem("campusFlowUsername", u);
    } else {
        localStorage.removeItem("campusFlowUsername");
    }

    submitBtn.classList.add("success");
    submitBtn.textContent = "Login successful ✓";

    if (isStudent) {
        message.textContent = "Welcome Sana Garg! Redirecting to Student Dashboard...";
        message.style.color = "#16834b";
        setTimeout(function() {
            location.hash = "#student";
            submitBtn.classList.remove("success");
            submitBtn.textContent = "Log in";
            message.textContent = "";
        }, 600);
    } else if (isTeacher) {
        message.textContent = "Welcome Dr. Meera Kapoor! Redirecting to Teacher Dashboard...";
        message.style.color = "#16834b";
        setTimeout(function() {
            location.hash = "#teacher";
            submitBtn.classList.remove("success");
            submitBtn.textContent = "Log in";
            message.textContent = "";
        }, 600);
    }
});

forgotPassword.addEventListener("click", function () {
    const email = prompt("Enter your registered email address:");
    if (email === null) return;
    if (!email.trim()) {
        message.textContent = "Please enter your email address.";
        message.style.color = "#e53935";
        return;
    }
    message.textContent = "Password reset instructions sent to " + email.trim() + ".";
    message.style.color = "#1769aa";
});


/* ============ 3. TEACHER PORTAL LOGIC ============ */
function showTeacherSection(sectionId, button) {
    const sections = document.querySelectorAll(".teacher-section");
    sections.forEach(function(s) { s.classList.remove("active"); });

    document.getElementById(sectionId).classList.add("active");

    const buttons = document.querySelectorAll(".teacher-navigation button");
    buttons.forEach(function(b) { b.classList.remove("active"); });

    button.classList.add("active");
}

function showTeacherSectionById(sectionId) {
    const sections = document.querySelectorAll(".teacher-section");
    sections.forEach(function(s) { s.classList.remove("active"); });

    document.getElementById(sectionId).classList.add("active");

    const buttons = document.querySelectorAll(".teacher-navigation button");
    buttons.forEach(function(button) {
        button.classList.remove("active");
        if (
            button.innerText.toLowerCase().includes(
                sectionId.replace("teacherInfo", "teacher information")
                         .replace("teacherTimetable", "time table")
                         .replace("markAttendance", "mark attendance")
                         .replace("teacherDashboard", "dashboard")
            )
        ) {
            button.classList.add("active");
        }
    });
}

// Mobile Timetable
const timetableData = [
    { day: "Monday", time: "09:00 – 10:00", subject: "OOP", meta: "CSE-A • Room 204" },
    { day: "Monday", time: "10:15 – 11:15", subject: "Data Structures", meta: "CSE-B • Lab 03" },
    { day: "Monday", time: "12:00 – 01:00", subject: "Web Development", meta: "CSE-A • Room 108" },
    { day: "Monday", time: "02:00 – 03:00", subject: "Java", meta: "CSE-A • Lab 02" },
    { day: "Tuesday", time: "10:15 – 11:15", subject: "OOP", meta: "CSE-A • Room 204" },
    { day: "Wednesday", time: "09:00 – 10:00", subject: "Java", meta: "CSE-B • Room 108" },
    { day: "Wednesday", time: "12:00 – 01:00", subject: "Web Development", meta: "CSE-C • Room 108" },
    { day: "Thursday", time: "10:15 – 11:15", subject: "Data Structures", meta: "CSE-C • Lab 02" },
    { day: "Thursday", time: "02:00 – 03:00", subject: "OOP Lab", meta: "CSE-B • Lab 03" },
    { day: "Friday", time: "09:00 – 10:00", subject: "OOP", meta: "CSE-A • Room 204" },
    { day: "Friday", time: "12:00 – 01:00", subject: "Java", meta: "CSE-B • Room 204" },
    { day: "Friday", time: "02:00 – 03:00", subject: "Web Dev", meta: "CSE-A • Room 108" }
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let activeDay = "Monday";

function renderDayTabs() {
    const tabs = document.getElementById("dayTabs");
    if (!tabs) return;
    tabs.innerHTML = "";

    weekDays.forEach(function(day) {
        const btn = document.createElement("button");
        btn.className = "day-tab-btn" + (day === activeDay ? " active" : "");
        btn.textContent = day.slice(0, 3);
        btn.onclick = function() {
            activeDay = day;
            renderDayTabs();
            renderDayLectures();
        };
        tabs.appendChild(btn);
    });
}

function renderDayLectures() {
    const container = document.getElementById("dayLectures");
    if (!container) return;
    container.innerHTML = "";

    const lectures = timetableData
        .filter(function(item) { return item.day === activeDay; })
        .sort(function(a, b) { return a.time.localeCompare(b.time); });

    if (lectures.length === 0) {
        const empty = document.createElement("div");
        empty.className = "day-empty";
        empty.textContent = "No classes scheduled for " + activeDay + ".";
        container.appendChild(empty);
        return;
    }

    lectures.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "day-lecture-card";
        card.innerHTML =
            '<div class="lecture-time">' + item.time + '</div>' +
            '<div class="lecture-body">' +
                '<strong>' + item.subject + '</strong>' +
                '<span>' + item.meta + '</span>' +
            '</div>';
        container.appendChild(card);
    });
}

renderDayTabs();
renderDayLectures();

// Attendance Rosters
const rosters = {
    "CSE-A": [
        "Aarav Sharma", "Diya Mehta", "Kabir Singh", "Ishita Rao",
        "Vivaan Gupta", "Ananya Joshi", "Reyansh Nair", "Saanvi Iyer",
        "Arjun Verma", "Myra Kulkarni", "Aditya Pillai", "Kiara Bhatt"
    ],
    "CSE-B": [
        "Sai Reddy", "Anika Desai", "Rohan Malhotra", "Navya Menon",
        "Krishna Agarwal", "Pari Chauhan", "Yash Kapoor", "Riya Bose",
        "Dhruv Saxena", "Aadhya Thakur", "Om Prakash", "Tara Sinha"
    ],
    "CSE-C": [
        "Vihaan Trivedi", "Zara Khan", "Aryan Chopra", "Sara Dutta",
        "Rudra Bhattacharya", "Meera Patil", "Shaurya Bansal", "Anvi Ghosh",
        "Karthik Subramaniam", "Ira Chowdhury", "Neel Kaul", "Advika Ranganathan"
    ]
};

const attendanceState = {};

function initials(name) {
    return name.split(" ").map(function(p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
}

function lectureKey() {
    const subject = document.getElementById("teacherSubjectSelect").value;
    const cls = document.getElementById("classSelect").value;
    const lecture = document.getElementById("lectureSelect").value;
    return subject + "|" + cls + "|" + lecture;
}

function handleSelectionChange() {
    const subject = document.getElementById("teacherSubjectSelect").value;
    const cls = document.getElementById("classSelect").value;
    const lecture = document.getElementById("lectureSelect").value;

    const placeholder = document.getElementById("attendancePlaceholder");
    const rosterBlock = document.getElementById("rosterBlock");
    const saveConfirmation = document.getElementById("saveConfirmation");

    saveConfirmation.classList.remove("show");

    if (!subject || !cls || !lecture) {
        placeholder.style.display = "block";
        rosterBlock.style.display = "none";
        return;
    }

    placeholder.style.display = "none";
    rosterBlock.style.display = "block";

    const key = lectureKey();
    const students = rosters[cls];

    if (!attendanceState[key]) {
        const initial = {};
        students.forEach(function(name) { initial[name] = true; });
        attendanceState[key] = initial;
    }

    document.getElementById("rosterTitle").textContent = cls + " roster";
    document.getElementById("lectureContext").textContent = subject + " • " + cls + " • " + lecture;

    renderRoster();
}

function renderRoster() {
    const cls = document.getElementById("classSelect").value;
    const key = lectureKey();
    const students = rosters[cls];
    const state = attendanceState[key];

    const list = document.getElementById("rosterList");
    list.innerHTML = "";

    students.forEach(function(name, index) {
        const roll = String(index + 1).padStart(2, "0");
        const isPresent = state[name];

        const row = document.createElement("div");
        row.className = "roster-row";
        row.innerHTML =
            '<div class="roster-avatar">' + initials(name) + '</div>' +
            '<div class="roster-roll">Roll ' + roll + '</div>' +
            '<div class="roster-name">' + name + '</div>' +
            '<div class="roster-toggle">' +
                '<button class="present-btn' + (isPresent ? ' on' : '') + '" onclick="setStatus(\'' + name.replace(/'/g, "\\'") + '\', true)">Present</button>' +
                '<button class="absent-btn' + (!isPresent ? ' on' : '') + '" onclick="setStatus(\'' + name.replace(/'/g, "\\'") + '\', false)">Absent</button>' +
            '</div>';

        list.appendChild(row);
    });

    updateSummary();
}

function setStatus(name, present) {
    const key = lectureKey();
    attendanceState[key][name] = present;
    renderRoster();
}

function markAll(present) {
    const cls = document.getElementById("classSelect").value;
    const key = lectureKey();
    rosters[cls].forEach(function(name) {
        attendanceState[key][name] = present;
    });
    renderRoster();
}

function updateSummary() {
    const key = lectureKey();
    const state = attendanceState[key];
    const values = Object.values(state);
    const presentCount = values.filter(function(v) { return v; }).length;
    const absentCount = values.length - presentCount;

    document.getElementById("totalCount").textContent = values.length;
    document.getElementById("presentCount").textContent = presentCount;
    document.getElementById("absentCount").textContent = absentCount;
}

function saveAttendance() {
    const subject = document.getElementById("teacherSubjectSelect").value;
    const cls = document.getElementById("classSelect").value;
    const lecture = document.getElementById("lectureSelect").value;
    const key = lectureKey();
    const state = attendanceState[key];
    const presentCount = Object.values(state).filter(function(v) { return v; }).length;
    const total = Object.values(state).length;

    const confirmation = document.getElementById("saveConfirmation");
    confirmation.textContent =
        "Saved — " + presentCount + " of " + total + " students marked present for " +
        subject + " (" + cls + "), " + lecture + ".";
    confirmation.classList.add("show");
}


/* ============ 4. STUDENT PORTAL LOGIC ============ */
const studentData = {
    oop: { total: 25, present: 22 },
    ds: { total: 25, present: 20 },
    web: { total: 25, present: 19 },
    java: { total: 25, present: 21 }
};

const subjectNames = {
    oop: "Object Oriented Programming",
    ds: "Data Structures",
    web: "Web Development",
    java: "Java Programming"
};

function showStudentSection(id, btn) {
    document.querySelectorAll('#studentView .student-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.student-nav button').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    closeSidebar();
}

function showStudentSectionById(id) {
    document.querySelectorAll('#studentView .student-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const map = { studentDashboard: 0, studentInfo: 1, studentTimetable: 2, myAttendance: 3, bunkPlanner: 4 };
    document.querySelectorAll('.student-nav button').forEach((t, i) => {
        if (i === map[id]) t.classList.add('active'); else t.classList.remove('active');
    });
    closeSidebar();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('backdrop').classList.toggle('show');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('backdrop').classList.remove('show');
}

function updateStudentAttendance() {
    const subj = document.getElementById('studentSubjectSelect').value;
    const d = studentData[subj];
    const absent = d.total - d.present;
    const pct = (d.present / d.total) * 100;

    document.getElementById('total').textContent = d.total;
    document.getElementById('present').textContent = d.present;
    document.getElementById('absent').textContent = absent;
    document.getElementById('percent').textContent = pct.toFixed(0) + '%';
    document.getElementById('progressBar').style.width = Math.min(pct, 100) + '%';

    const note = document.getElementById('targetNote');
    if (pct >= 75) {
        let miss = Math.floor((d.present / 0.75) - d.total);
        note.innerHTML = miss > 0 
            ? '<strong>You can miss ' + miss + ' more class' + (miss > 1 ? 'es' : '') + '.</strong> Your attendance will still remain at or above 75%.'
            : '<strong>Be careful.</strong> Your attendance is at the 75% limit.';
    } else {
        let need = Math.ceil((0.75 * d.total - d.present) / 0.25);
        note.innerHTML = '<strong>Attendance below 75%.</strong> You need to attend approximately ' + need + ' consecutive classes to reach the 75% requirement.';
    }
    renderHeatmap(subj);
}

const heatmapPatterns = {
    oop: [1, 17, 28],
    ds: [2, 11, 14, 24, 29],
    web: [0, 4, 9, 18, 21, 31],
    java: [3, 7, 16, 25]
};
const weekendCells = [5, 6, 12, 13, 19, 20, 26, 27, 33, 34];

function renderHeatmap(subj) {
    const map = document.getElementById('heatmap');
    if (!map) return;
    map.innerHTML = '';
    const missed = heatmapPatterns[subj];
    let present = 0, absent = 0, held = 0;

    for (let i = 0; i < 35; i++) {
        const x = document.createElement('div');
        x.className = 'day';
        if (weekendCells.includes(i)) {
            x.classList.add('empty');
        } else if (missed.includes(i)) {
            x.classList.add('missed');
            absent++;
            held++;
        } else {
            x.classList.add('present');
            present++;
            held++;
        }
        map.appendChild(x);
    }
    document.getElementById('heatPresent').textContent = present;
    document.getElementById('heatAbsent').textContent = absent;
    document.getElementById('heatRate').textContent = Math.round((present / held) * 100) + '%';
    document.getElementById('heatmapSubtitle').textContent = 'Attendance overview for ' + subjectNames[subj] + '.';
}

/* Bunk Planner Logic */
function maxSafeBunk(d) {
    return Math.max(0, Math.floor((d.present / 0.75) - d.total));
}

function projectedPct(d, n) {
    return (d.present / (d.total + n)) * 100;
}

function stepBunk(delta) {
    const input = document.getElementById('bunkCount');
    let v = parseInt(input.value || '0', 10) + delta;
    if (v < 0) v = 0; if (v > 30) v = 30;
    input.value = v;
    document.getElementById('bunkSlider').value = v;
    updateBunk();
}

function syncBunkFromInput() {
    const input = document.getElementById('bunkCount');
    let v = parseInt(input.value || '0', 10);
    if (isNaN(v) || v < 0) v = 0; if (v > 30) v = 30;
    input.value = v;
    document.getElementById('bunkSlider').value = v;
    updateBunk();
}

function syncBunkFromSlider() {
    const v = document.getElementById('bunkSlider').value;
    document.getElementById('bunkCount').value = v;
    updateBunk();
}

function updateBunk() {
    const subj = document.getElementById('bunkSubject').value;
    const n = parseInt(document.getElementById('bunkCount').value || '0', 10);
    const d = studentData[subj];
    const pct = projectedPct(d, n);
    const safeN = maxSafeBunk(d);
    const isSafe = pct >= 75;

    document.getElementById('bunkProjected').textContent = pct.toFixed(0) + '%';
    const meter = document.getElementById('bunkMeterFill');
    meter.style.width = Math.min(pct, 100) + '%';
    meter.style.background = isSafe ? '#16834b' : '#c0392b';

    const result = document.getElementById('bunkResult');
    const verdict = document.getElementById('bunkVerdict');
    const message = document.getElementById('bunkMessage');

    if (isSafe) {
        result.classList.remove('risk-state'); result.classList.add('safe-state');
        verdict.classList.remove('risk'); verdict.classList.add('safe');
        verdict.textContent = 'Safe to bunk';
        const remaining = safeN - n;
        message.textContent = remaining > 0
            ? 'Bunking ' + n + ' ' + (n === 1 ? 'class' : 'classes') + ' of ' + subjectNames[subj] + ' still keeps you at ' + pct.toFixed(0) + '%. You could skip ' + remaining + ' more before dropping under 75%.'
            : 'Bunking ' + n + ' ' + (n === 1 ? 'class' : 'classes') + ' brings you exactly to the 75% line. One more absence and you will fall below the requirement.';
    } else {
        result.classList.remove('safe-state'); result.classList.add('risk-state');
        verdict.classList.remove('safe'); verdict.classList.add('risk');
        verdict.textContent = 'Below 75% — not recommended';
        const over = n - safeN;
        message.textContent = 'Bunking ' + n + ' ' + (n === 1 ? 'class' : 'classes') + ' of ' + subjectNames[subj] + ' drops you to ' + pct.toFixed(0) + '%, ' + over + ' bunk' + (over > 1 ? 's' : '') + ' past your safe limit of ' + safeN + '. You would need extra consecutive present classes afterwards to climb back above 75%.';
    }

    const row = document.getElementById('chipRow');
    row.innerHTML = '';
    Object.keys(studentData).forEach(key => {
        const dd = studentData[key];
        const p = projectedPct(dd, n);
        const chip = document.createElement('div');
        chip.className = 'bunk-chip ' + (p >= 75 ? 'ok' : 'bad');
        chip.textContent = subjectNames[key].split(' ').map(w => w[0]).join('').slice(0, 4) + ' · ' + p.toFixed(0) + '%';
        row.appendChild(chip);
    });
}

// Initial calls
updateStudentAttendance();
updateBunk();
