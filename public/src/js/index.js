var defferedPrompt;
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(() =>
        console.log('[Service Worker][index.js] Registration Finished')
      )
      .catch(console.log);
  });
}
// install button
const parInstall = document.getElementById('install-p');
const buttonInstall = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  buttonInstall.addEventListener('click', () => {
    event.prompt();
    buttonInstall.setAttribute('disabled', true);
    buttonInstall.innerHTML = 'Installed';
    // after 2 seconds hide de Install
    setTimeout(() => {
      parInstall.classList.add('hide');
    }, 2000);
  });
});

window.addEventListener('appinstalled', (evt) => {
  // Log install to analytics
  console.log('INSTALL: Success');
});

const enableButtons = document.querySelectorAll('.enable');

const askForNotification = (e) => {
  Notification.requestPermission((result) => {
    if (result !== 'granted') {
      console.log('NO notification enabled');
    } else {
      e.target.innerHTML = 'Notification Granted';
      setTimeout(() => {
        e.target.style.display = 'none';
        new Notification('Subscribed');
      }, 2000);
    }
  });
};
if ('Notification' in window) {
  for (let i = 0; i < enableButtons.length; i++) {
    enableButtons[i].style.display = 'inline-block';
    enableButtons[i].addEventListener('click', (e) => askForNotification(e));
  }
}
