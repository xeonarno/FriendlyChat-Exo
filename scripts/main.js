/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes FriendlyChat.
class FriendlyChat
{
  constructor()
  {
    this.checkSetup();

    // Shortcuts to DOM Elements.
    this.messageList        = document.querySelector('#messages');
    this.messageForm        = document.querySelector('#message-form');
    this.messageInput       = document.querySelector('#message');
    this.submitButton       = document.querySelector('#submit');
    this.submitImageButton  = document.querySelector('#submitImage');
    this.imageForm          = document.querySelector('#image-form');
    this.mediaCapture       = document.querySelector('#mediaCapture');
    this.userPic            = document.querySelector('#user-pic');
    this.userName           = document.querySelector('#user-name');
    this.signInButton       = document.querySelector('#sign-in');
    this.signOutButton      = document.querySelector('#sign-out');
    this.signInSnackbar     = document.querySelector('#must-signin-snackbar');

    // Saves message on form submit.
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);

    // Events for image upload.
    this.submitImageButton.addEventListener('click', (e)=>{
      e.preventDefault();
      this.mediaCapture.click();
    });
    this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

    this.initFirebase();
  }

  // Sets up shortcuts to Firebase features and initiate firebase auth.
  initFirebase()
  {
    // TODO(DEVELOPER): Initialize Firebase.
  };

// Loads chat messages history and listens for upcoming ones.
  loadMessages()
  {
    // TODO(DEVELOPER): Load an d listens for new messages.
  };

  // Saves a new message on the Firebase DB.
  saveMessage(e)
  {
    e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (this.messageInput.value && this.checkSignedInWithMessage()) {

      // TODO(DEVELOPER): push new message to Firebase.

    }
  };

  // Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
  setImageUrl(imageUri, imgElement) {
    imgElement.src = imageUri;

    // TODO(DEVELOPER): If image is on Cloud Storage, fetch image URL and set img element's src.
  };

  // Saves a new message containing an image URI in Firebase.
  // This first saves the image in Firebase storage.
  saveImageMessage(event) {
    event.preventDefault();
    var file = event.target.files[0];

    // Clear the selection in the file picker input.
    this.imageForm.reset();

    // Check if the file is an image.
    if (!file.type.match('image.*')) {
      var data = {
        message: 'You can only share images',
        timeout: 2000
      };
      this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
      return;
    }
    // Check if the user is signed-in
    if (this.checkSignedInWithMessage()) {

      // TODO(DEVELOPER): Upload image to Firebase storage and add message.

    }
  };

  // Signs-in Friendly Chat.
  signIn() {
    // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
  };

  // Signs-out of Friendly Chat.
  signOut() {
    // TODO(DEVELOPER): Sign out of Firebase.
  };

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  onAuthStateChanged(user) {
    if (user) { // User is signed in!
      // Get profile pic and user's name from the Firebase user object.
      var profilePicUrl = null;   // TODO(DEVELOPER): Get profile pic.
      var userName = null;        // TODO(DEVELOPER): Get user's name.

      // Set the user's profile pic and name.
      this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
      this.userName.textContent = userName;

      // Show user's profile and sign-out button.
      this.userName.removeAttribute('hidden');
      this.userPic.removeAttribute('hidden');
      this.signOutButton.removeAttribute('hidden');

      // Hide sign-in button.
      this.signInButton.setAttribute('hidden', 'true');

      // We load currently existing chant messages.
      this.loadMessages();

      // We save the Firebase Messaging Device token and enable notifications.
      this.saveMessagingDeviceToken();
    } else { // User is signed out!
      // Hide user's profile and sign-out button.
      this.userName.setAttribute('hidden', 'true');
      this.userPic.setAttribute('hidden', 'true');
      this.signOutButton.setAttribute('hidden', 'true');

      // Show sign-in button.
      this.signInButton.removeAttribute('hidden');
    }
  };

  // Returns true if user is signed-in. Otherwise false and displays a message.
  checkSignedInWithMessage() {
    /* TODO(DEVELOPER): Check if user is signed-in Firebase. */

    // Display a message to the user using a Toast.
    var data = {
      message: 'You must sign-in first',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
  };

  // Saves the messaging device token to the datastore.
  saveMessagingDeviceToken() {
    // TODO(DEVELOPER): Save the device token in the realtime datastore
  };

  // Requests permissions to show notifications.
  requestNotificationsPermissions() {
    // TODO(DEVELOPER): Request permissions to send notifications.
  };

  // Resets the given MaterialTextField.
  static resetMaterialTextfield(element)
  {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  };

  // Displays a Message in the UI.
  displayMessage(key, name, text, picUrl, imageUri)
  {
    var div = document.getElementById(key);
    // If an element for that message does not exists yet we create it.
    if (!div)
    {
      var container = document.createElement('div');
      container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
      div = container.firstChild;
      div.setAttribute('id', key);
      this.messageList.appendChild(div);
    }

    if (picUrl) {
      div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
    }
    div.querySelector('.name').textContent = name;
    var messageElement = div.querySelector('.message');
    if (text) { // If the message is text.
      messageElement.textContent = text;
      // Replace all line breaks by <br>.
      messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    } else if (imageUri) { // If the message is an image.
      var image = document.createElement('img');
      image.addEventListener('load', function() {
        this.messageList.scrollTop = this.messageList.scrollHeight;
      }.bind(this));
      this.setImageUrl(imageUri, image);
      messageElement.innerHTML = '';
      messageElement.appendChild(image);
    }
    // Show the card fading-in.
    setTimeout(function() {
      div.classList.add('visible')
    }, 1);
    this.messageList.scrollTop = this.messageList.scrollHeight;
    this.messageInput.focus();
  };

  // Enables or disables the submit button depending on the values of the input
  // fields.
  toggleButton() {
    if (this.messageInput.value) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'true');
    }
  };

  // Checks that the Firebase SDK has been correctly setup and configured.
  checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
          'Make sure you go through the codelab setup instructions and make ' +
          'sure you are running the codelab using `firebase serve`');
    }
  };
}

// Template for messages.
FriendlyChat.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// A loading image URL.
FriendlyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';


window.onload = function() {
  window.friendlyChat = new FriendlyChat();
};
