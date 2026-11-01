document.getElementById('professional-inquiry').addEventListener('submit', function (event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = String(data.get('topic')) + ' — ' + String(data.get('name')).trim();
  const body = String(data.get('message')).trim() + '\n\nFrom: ' + String(data.get('name')).trim() + '\nEmail: ' + String(data.get('email')).trim();
  window.location.href = 'mailto:jndeutsch@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});
