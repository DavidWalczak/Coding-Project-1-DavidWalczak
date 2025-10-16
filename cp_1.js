document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('feedbackForm');
  const charCount = document.getElementById('charCount');
  const feedbackDisplay = document.getElementById('feedbackDisplay');

  // Tooltip Setup
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('id', 'tooltip');
  tooltip.style.position = 'absolute';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  // Show character count in real-time
  form.addEventListener('input', function (event) {
    if (event.target.id === 'comments') {
      charCount.textContent = `Characters: ${event.target.value.length}`;
    }
  });

  // Tooltip logic: show on hover
  form.addEventListener('mouseover', function (event) {
    if (event.target.matches('input, textarea')) {
      let message = '';
      switch (event.target.id) {
        case 'username':
          message = 'Enter your full name';
          break;
        case 'email':
          message = 'Enter a valid email address';
          break;
        case 'comments':
          message = 'Type your feedback here';
          break;
      }

      if (message) {
        tooltip.textContent = message;
        tooltip.style.display = 'block';
        event.target.setAttribute('aria-describedby', 'tooltip');
      }
    }
  });

  // Move tooltip with cursor
  form.addEventListener('mousemove', function (event) {
    if (tooltip.style.display === 'block') {
      tooltip.style.top = `${event.pageY + 10}px`;
      tooltip.style.left = `${event.pageX + 10}px`;
    }
  });

  // Hide tooltip on mouse out
  form.addEventListener('mouseout', function (event) {
    if (event.target.matches('input, textarea')) {
      tooltip.style.display = 'none';
      event.target.removeAttribute('aria-describedby');
    }
  });

  // Centralized error display function
  function showError(field, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = message;
    field.insertAdjacentElement('afterend', error);
  }

  // Form submission handling
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.error').forEach(e => e.remove());

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const comments = document.getElementById('comments');

    let isValid = true;
    const missingFields = [];

    // Validate fields
    [username, email, comments].forEach(field => {
      if (field.value.trim() === '') {
        isValid = false;
        const label = field.previousElementSibling.textContent.replace(':', '');
        missingFields.push(label);
        showError(field, `${label} is required.`);
      }
    });

    // Additional email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailPattern.test(email.value)) {
      isValid = false;
      showError(email, 'Please enter a valid email address.');
      if (!missingFields.includes('Email')) {
        missingFields.push('Email');
      }
    }

    if (!isValid) {
      alert(`Please complete the following field(s):\n- ${missingFields.join('\n- ')}`);
      return;
    }

    // If valid, show feedback and reset form
    
    alert(`Thank you, ${username.value}! Your feedback has been submitted.`);

    const entry = document.createElement('div');
    entry.innerHTML = `
      <strong>${username.value}</strong> (${email.value})<br>
      <p>${comments.value}</p><hr>
    `;
    feedbackDisplay.appendChild(entry);
    entry.scrollIntoView({ behavior: 'smooth' });

    form.reset();
    charCount.textContent = 'Characters: 0';
  });

  // Stop form click events from bubbling if needed
  form.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  // Background click handler 
  document.body.addEventListener('click', function () {
    console.log('Background clicked');
  });
});