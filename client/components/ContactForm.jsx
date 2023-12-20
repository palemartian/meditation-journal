//** CONTACT FORM */

import React from 'react';

/**
 * Contact form component allows users to submit messages.
 *
 * @returns {JSX.Element} The rendered Blurb component.
 */
function ContactForm() {
  return (
    <div className='contactFormContainer'>
      <form action={process.env.REACT_APP_FORM_ENDPOINT} method='POST' className='form'>
        <label for='name'>Your Name:</label>
        <input type='text' name='name' id='name' placeholder='ex: Jane Doe' className='name' />
        <div className='visually-hidden'>
          <label htmlFor='hidden'>Leave this field empty:</label>
          <input type='text' id='hidden' name='_gotcha' />
        </div>
        <label for='email'>Your Email:</label>
        <input type='text' name='email' id='email' placeholder='janedoe@example.com' className='email' />
        <label for='message'>Message:</label>
        <textarea type='text' name='message' id='message' placeholder="What's on your mind?" rows='10' className='message' />
        <button type='submit' className='submitBtn'>
          Send
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
