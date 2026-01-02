let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;
let selectedCourses = [];

// Handle custom select options
document.querySelectorAll(".custom-select .option").forEach(option => {
  option.addEventListener("click", function() {
    this.classList.toggle("selected");
    selectedCourses = Array.from(document.querySelectorAll(".custom-select .option.selected"))
      .map(o => o.textContent);
  });
});

// Display students in table
function displayStudents(filter = "") {
  let table = document.getElementById("result");
  table.innerHTML = "";

  students
    .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((s, i) => {
      let row = table.insertRow();
      row.insertCell(0).innerText = s.name;
      row.insertCell(1).innerText = s.email;
      row.insertCell(2).innerText = s.courses.join(", ");

      let actions = row.insertCell(3);
      actions.innerHTML = `
        <button class="edit" onclick="editStudent(${i})">Edit</button>
        <button class="delete" onclick="deleteStudent(${i})">Delete</button>
      `;
    });
}

// Form submit
document.getElementById("courseForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;

  if (!name || !email || selectedCourses.length === 0) {
    alert("Please fill all fields and select at least one course");
    return;
  }

  let student = { name, email, courses: selectedCourses };

  if (editIndex === null) {
    students.push(student);
  } else {
    students[editIndex] = student;
    editIndex = null;
  }

  localStorage.setItem("students", JSON.stringify(students));
  displayStudents();
  this.reset();
  selectedCourses = [];
  document.querySelectorAll(".custom-select .option").forEach(o => o.classList.remove("selected"));
});

// Delete
function deleteStudent(i) {
  students.splice(i, 1);
  localStorage.setItem("students", JSON.stringify(students));
  displayStudents();
}

// Edit
function editStudent(i) {
  let s = students[i];
  document.getElementById("name").value = s.name;
  document.getElementById("email").value = s.email;

  document.querySelectorAll(".custom-select .option").forEach(o => {
    o.classList.remove("selected");
    if (s.courses.includes(o.textContent)) o.classList.add("selected");
  });
  selectedCourses = [...s.courses];
  editIndex = i;
}

// Search
document.getElementById("search").addEventListener("input", function() {
  displayStudents(this.value);
});

// Initial display
displayStudents();