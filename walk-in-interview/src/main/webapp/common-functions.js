/**
 * This file wraps some commonly used job related function as a reusable module.
 */

// TODO(issue/21): get the language from the browser
const CurrentLocale = 'en';

/**
 * Import statements are static so its parameters cannot be dynamic.
 * TODO(issue/22): figure out how to use dynamic imports
 */
import {AppStrings} from './strings.en.js';

const STRINGS = AppStrings['common'];
const JOB_ID_PARAM = 'jobId';
const DEFAULT_PAGE_SIZE = 20;

/**
 * Gets the requirements list from the servlet
 * (which gets it from the database).
 * @return {Object} the requirements list in a key-value mapping format.
 */
function getRequirementsList() {
  // TODO(issue/17): GET request to servlet to get from database
  // returning some hardcoded values for now
  return {
    'O_LEVEL': 'O Level',
    'LANGUAGE_ENGLISH': 'English',
    'DRIVING_LICENSE_C': 'Category C Driving License',
  };
}

/**
 * Sets the error message according to the param.
 * @param {String} errorMessageElementId the element id
 *    for html error message div.
 * @param {String} msg the message that the error div should display.
 * @param {boolean} includesDefaultMsg whether the includes default message.
 *    Default to be true.
 */
function setErrorMessage(errorMessageElementId, msg, includesDefaultMsg=true) {
  document.getElementById(errorMessageElementId).innerText =
    (includesDefaultMsg ? STRINGS['error-message'] + msg : msg);
}

/**
 * Add the keys and values from the options map to the select element.
 * @param {Element} select The select element.
 * @param {Map} options The map of options to be added.
 */
function renderSelectOptions(select, options) {
  select.options.length = 0;
  select.options[0] = new Option('Select', '');
  select.options[0].setAttribute('disabled', true);

  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      select.options[select.options.length] =
        new Option(options[key], key);
    }
  }
}

/**
 * Gets the value of a specified cookie.
 *
 * @param {String} cname Cookie name.
 * @return {String} The value in the cookie.
 */
function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export {JOB_ID_PARAM, DEFAULT_PAGE_SIZE,
  getRequirementsList, setErrorMessage,
  renderSelectOptions, getCookie};
