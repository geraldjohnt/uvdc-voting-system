// Call the dataTables jQuery plugin
$(document).ready(function() {
  const table = $('#usersTable').DataTable({
    autoWidth: false, // IMPORTANT: Let columnDefs control widths
    // columnDefs: [
    //   {
    //     targets: 0,
    //     width: '6%',
    //     className: 'no-wrap'
    //   },
    //   {
    //     targets: 3,
    //     width: '1%',
    //     className: 'no-wrap'
    //   },
    //   {
    //     targets: 4,
    //     width: '1%',
    //     className: 'no-wrap'
    //   },
    // ],
    order: [[1, 'asc']],
    drawCallback: function() {
      $('#usersTable tbody tr').each(function() {
        var cell = $(this).find('td:eq(4)'); // Change index to the correct column
        var value = cell.text().trim();
        
        if (value === 'Yes') {
          cell.css('color', 'green');
        } else if (value === 'No') {
          cell.css('color', 'red');
        }
      });
    }
  });

  db.ref('users').once('value').then((snapshot) => {
    const users = snapshot.val();

    for (let id in users) {
      const user = users[id];
      table.row.add([
        id,
        user.name,
        user.course,
        user.admin ? "Yes" : "No",
        user.voted ? "Yes" : "No",
      ]).draw(false);
    }
  });

  addUser = function() {
    const idNumber = $('#idNumber');
    const idNumberError = $('#idNumberError');
    const firstName = $('#firstName');
    const firstNameError = $('#firstNameError');
    const lastName = $('#lastName');
    const lastNameError = $('#lastNameError');
    const course = $('#course');
    const courseError = $('#courseError');
    idNumber.removeClass('is-invalid');
    idNumberError.addClass('d-none');
    firstName.removeClass('is-invalid');
    firstNameError.addClass('d-none');
    lastName.removeClass('is-invalid');
    lastNameError.addClass('d-none');
    course.removeClass('is-invalid');
    courseError.addClass('d-none');

    if (idNumber.val() == '' || firstName.val() == '' || lastName.val() == '' || course.val() == '') {
      if (idNumber.val() == '') {
        idNumber.addClass('is-invalid');
        idNumberError.html('ID Number is required!');
        idNumberError.removeClass('d-none');
      }
      
      if (firstName.val() == '') {
        firstName.addClass('is-invalid');
        firstNameError.html('First Name is required!');
        firstNameError.removeClass('d-none');
      }
      if (lastName.val() == '') {
        lastName.addClass('is-invalid');
        lastNameError.html('Last Name is required!');
        lastNameError.removeClass('d-none');
      }
      if (course.val() == '') {
        course.addClass('is-invalid');
        courseError.html('Course is required!');
        courseError.removeClass('d-none');
      }

      return;
    }

    db.ref('users/'+idNumber.val()).get().then(snapshot => {
      if (!snapshot.exists()) {
        const userToBeAdded = snapshot.val();
        const newUser = {
          "name": `${lastName.val()}, ${firstName.val()}`,
          "course": course,
          "admin": false,
          "voted": false
        };
        db.ref('users/'+idNumber.val()).set(newUser).then(() => {
          table.row.add([
            idNumber.val(),
            `${lastName.val()}, ${firstName.val()}`,
            course,
            "No",
            "No"
          ]).draw(false);
          $('#addUserModal').modal('hide');
          alert(`User ${lastName.val()}, ${firstName.val()} has been added!`);
          idNumber.val('');
          firstName.val('');
          lastName.val('');
          course.val('');
        })
        .catch((error) => {
          console.log("Error: ", error);
        })
      } else {
        idNumber.addClass('is-invalid');
        idNumberError.html('ID Number already exist!');
        idNumberError.removeClass('d-none');
        return;
      }
    });
  }
});
