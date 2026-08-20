(function () {
  "use strict";
  var courseList = document.getElementById("courseList");
  var addBtn = document.getElementById("addCourseBtn");
  var calcBtn = document.getElementById("calcGpaBtn");
  var resultBox = document.getElementById("gpaResult");
  var gpaValue = document.getElementById("gpaValue");
  var gpaCredits = document.getElementById("gpaCredits");
  var gpaPoints = document.getElementById("gpaPoints");
  var emptyEl = document.getElementById("gpaEmpty");
  var courseCounter = 1;

  function createCourseRow() {
    courseCounter++;
    var row = document.createElement("div");
    row.className = "course-row";
    row.dataset.idx = courseCounter;
    row.innerHTML =
      '<div class="field"><label>Course Name</label><input type="text" class="course-name" value="Course ' + courseCounter + '" placeholder="e.g. Math 101"></div>' +
      '<div class="field"><label>Credits</label><input type="number" class="course-credits" value="3" min="0.5" step="0.5"></div>' +
      '<div class="field"><label>Grade</label>' +
      '<select class="course-grade">' +
      '<option value="4.0">A (4.0)</option><option value="3.7">A- (3.7)</option>' +
      '<option value="3.3">B+ (3.3)</option><option value="3.0">B (3.0)</option><option value="2.7">B- (2.7)</option>' +
      '<option value="2.3">C+ (2.3)</option><option value="2.0">C (2.0)</option><option value="1.7">C- (1.7)</option>' +
      '<option value="1.3">D+ (1.3)</option><option value="1.0">D (1.0)</option><option value="0.7">D- (0.7)</option>' +
      '<option value="0.0">F (0.0)</option></select></div>' +
      '<button class="btn-remove" title="Remove course">&times;</button>';
    row.querySelector(".btn-remove").addEventListener("click", function () { row.remove(); calcGPA(); });
    courseList.appendChild(row);
  }

  function calcGPA() {
    var rows = courseList.querySelectorAll(".course-row");
    var totalCredits = 0, totalPoints = 0;
    rows.forEach(function (row) {
      var credits = parseFloat(row.querySelector(".course-credits").value);
      var grade = parseFloat(row.querySelector(".course-grade").value);
      if (!isNaN(credits) && !isNaN(grade) && credits > 0) {
        totalCredits += credits;
        totalPoints += credits * grade;
      }
    });
    if (totalCredits === 0) { resultBox.hidden = true; emptyEl.hidden = false; return; }
    var gpa = totalPoints / totalCredits;
    gpaValue.textContent = gpa.toFixed(2);
    gpaCredits.textContent = totalCredits;
    gpaPoints.textContent = totalPoints.toFixed(1);
    resultBox.hidden = false;
    emptyEl.hidden = true;
  }

  addBtn.addEventListener("click", createCourseRow);
  calcBtn.addEventListener("click", calcGPA);

  courseList.addEventListener("input", function () { calcGPA(); });
  courseList.addEventListener("change", function () { calcGPA(); });

  var firstRow = courseList.querySelector(".course-row .btn-remove");
  if (firstRow) firstRow.addEventListener("click", function () { courseList.querySelector(".course-row").remove(); calcGPA(); });
})();
