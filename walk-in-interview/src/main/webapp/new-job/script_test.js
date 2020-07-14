/**
 * This file is where we will write tests for the
 * funcions in new-job/script.js using mocha and selenium.
 * Running `npm test` in the command line will run all
 * the mocha tests in the walk-in-interview directory.
 * Also note that the Dev App Server should be running
 * using `mvn package appengine:run` before running the tests.
 * To get test report formatted nicely, cd into this folder and
 * run `mocha script_test.js --reporter mochawesome --reporter-options
 * autoOpen=true`.
 */

/**
 * Unable to import AppStrings into this file so copy/
 * pasted here instead.
 * TODO(issue/38): import AppStrings here
 */
const STRINGS = {
  'page-title': 'New Job Post',
  'cancel': 'Cancel',
  'submit': 'Create',
  'error-message': 'There is an error in the following field: ',
  'title': 'Job Title',
  'description': 'Job Description',
  'address': 'Job Address',
  'postal-code': 'Postal Code',
  'requirements-title': 'Requirements',
  'requirements-list': 'requirements-list',
  'pay-title': 'Job Pay',
  'pay-frequency': {
    'HOURLY': 'Hourly',
    'WEEKLY': 'Weekly',
    'MONTHLY': 'Monthly',
    'YEARLY': 'Yearly',
  },
  'pay-min': 'min (sgd)',
  'pay-max': 'max (sgd)',
  'duration-title': 'Job Duration',
  'duration': {
    'ONE_WEEK': '1 Week',
    'TWO_WEEKS': '2 Weeks',
    'ONE_MONTH': '1 Month',
    'SIX_MONTHS': '6 Months',
    'ONE_YEAR': '1 Year',
    'OTHER': 'Other',
  },
  'expiry-title': 'Job Expiry',
};
/**
 * TODO(issue/38): import getRequirementsList() here.
 */
const REQUIREMENTS_LIST = {
  'o-levels': 'O Levels',
  'drivers-license': 'Drivers License',
};
/**
 * Note that if https is used instead in the url below then
 * we get the following error: ERR_SSL_PROTOCOL_ERROR
 */
const JOBPAGE_URL = 'http://localhost:3000/new-job/index.html';
const HOMEPAGE_URL = 'http://localhost:3000/index.html';

const assert = require('chai').assert;
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

const By = webdriver.By;
const until = webdriver.until;
const options = new chrome.Options();
options.addArguments('headless');

const TIMEOUT = 10000;

let driver;

/** Note that this.timeout() will not work arrow functions. */
describe('New Job Tests', function() {
  this.timeout(TIMEOUT);

  beforeEach(() => {
    driver = new webdriver.Builder().setChromeOptions(options)
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();
    return driver.get(JOBPAGE_URL);
  });

  afterEach(() => {
    return driver.quit();
  });

  describe('Page Rendering Tests', () => {
    describe('Page Title', () => {
      const id = 'page-title';

      it('checks the title text', () => {
        return driver.findElement(By.id(id)).getText()
            .then((text) => {
              assert.equal(text, STRINGS[id]);
            });
      });
    });

    describe('Cancel Button', () => {
      const id = 'cancel';

      it('checks the value attribute', () => {
        return driver.findElement(By.id(id)).getAttribute('value')
            .then((value) => {
              assert.equal(value, STRINGS[id]);
            });
      });

      it('checks the type attribute', () => {
        return driver.findElement(By.id(id)).getAttribute('type')
            .then((value) => {
              assert.equal(value, 'reset');
            });
      });
    });

    describe('Submit Button', () => {
      const id = 'submit';

      it('checks the value attribute', () => {
        return driver.findElement(By.id(id)).getAttribute('value')
            .then((value) => {
              assert.equal(value, STRINGS[id]);
            });
      });

      it('checks the type attribute', () => {
        return driver.findElement(By.id(id)).getAttribute('type')
            .then((value) => {
              assert.equal(value, 'submit');
            });
      });
    });

    describe('Error Message', () => {
      const id = 'error-message';

      it('checks initially empty', () => {
        return driver.findElement(By.id(id)).getText()
            .then((text) => {
              assert.isEmpty(text);
            });
      });
    });

    describe('Job Title', () => {
      const id = 'title';

      it('checks the placeholder attribute', () => {
        return driver.findElement(By.id(id)).getAttribute('placeholder')
            .then((value) => {
              assert.equal(value, STRINGS[id]);
            });
      });

      it('checks the type attribute', () => {
        return driver.findElement(By.id(id)).getAttribute('type')
            .then((value) => {
              assert.equal(value, 'text');
            });
      });
    });

    describe('Job Description', () => {
      const id = 'description';

      it('checks the placeholder attribute', () => {
        return driver.findElement(By.id(id)).getAttribute('placeholder')
            .then((value) => {
              assert.equal(value, STRINGS[id]);
            });
      });
    });

    describe('Job Address', () => {
      const addressId = 'address';

      it('checks the placeholder attribute', () => {
        return driver.findElement(By.id(addressId))
            .getAttribute('placeholder')
            .then((value) => {
              assert.equal(value, STRINGS[addressId]);
            });
      });

      it('checks the type attribute', () => {
        return driver.findElement(By.id(addressId)).getAttribute('type')
            .then((value) => {
              assert.equal(value, 'text');
            });
      });

      describe('Postal Code', () => {
        const postalCodeId = 'postal-code';

        it('checks the placeholder attribute', () => {
          return driver.findElement(By.id(postalCodeId))
              .getAttribute('placeholder')
              .then((value) => {
                assert.equal(value, STRINGS[postalCodeId]);
              });
        });

        it('checks the type attribute', () => {
          return driver.findElement(By.id(postalCodeId)).getAttribute('type')
              .then((value) => {
                assert.equal(value, 'text');
              });
        });
      });
    });

    describe('Job Requirements', () => {
      const titleId = 'requirements-title';
      const listId = 'requirements-list';

      it('checks the title text', () => {
        return driver.findElement(By.id(titleId)).getText()
            .then((text) => {
              assert.equal(text, STRINGS[titleId]);
            });
      });

      it('checks correct requirement list rendered', () => {
        return driver.findElement(By.id(listId)).getText()
            .then((text) => {
              const list = REQUIREMENTS_LIST;
              for (const key in list) {
                if (list.hasOwnProperty(key)) {
                  if (!text.includes(list[key])) {
                    assert.fail(list[key] + ' requirement not included');
                  }
                }
              }
            });
      });
    });

    describe('Job Pay', () => {
      const titleId = 'pay-title';
      const frequencyId = 'pay-frequency';
      const minId = 'pay-min';
      const maxId = 'pay-max';

      it('checks the title text', () => {
        return driver.findElement(By.id(titleId)).getText()
            .then((text) => {
              assert.equal(text, STRINGS[titleId]);
            });
      });

      it('checks correct select options rendered', () => {
        return driver.findElement(By.id(frequencyId)).getText()
            .then((text) => {
              const options = STRINGS[frequencyId];
              for (const key in options) {
                if (options.hasOwnProperty(key)) {
                  if (!text.includes(options[key])) {
                    assert.fail(options[key] + ' option not included');
                  }
                }
              }
            });
      });

      it('min: checks the placeholder attribute', () => {
        return driver.findElement(By.id(minId)).getAttribute('placeholder')
            .then((value) => {
              assert.equal(value, STRINGS[minId]);
            });
      });

      it('min: checks the type attribute', () => {
        return driver.findElement(By.id(minId)).getAttribute('type')
            .then((value) => {
              assert.equal(value, 'number');
            });
      });

      it('max: checks the placeholder attribute', () => {
        return driver.findElement(By.id(maxId)).getAttribute('placeholder')
            .then((value) => {
              assert.equal(value, STRINGS[maxId]);
            });
      });

      it('max: checks the type attribute', () => {
        return driver.findElement(By.id(maxId)).getAttribute('type')
            .then((value) => {
              assert.equal(value, 'number');
            });
      });
    });

    describe('Job Duration', () => {
      const titleId = 'duration-title';
      const durationId = 'duration';

      it('checks the title text', () => {
        return driver.findElement(By.id(titleId)).getText()
            .then((text) => {
              assert.equal(text, STRINGS[titleId]);
            });
      });

      it('checks correct select options rendered', () => {
        return driver.findElement(By.id(durationId)).getText()
            .then((text) => {
              const options = STRINGS[durationId];
              for (const key in options) {
                if (options.hasOwnProperty(key)) {
                  if (!text.includes(options[key])) {
                    assert.fail(options[key] + ' option not included');
                  }
                }
              }
            });
      });
    });

    describe('Job Expiry', () => {
      const titleId = 'expiry-title';
      const expiryId = 'expiry';

      it('checks the title text', () => {
        return driver.findElement(By.id(titleId)).getText()
            .then((text) => {
              assert.equal(text, STRINGS[titleId]);
            });
      });

      it('checks the type attribute', () => {
        return driver.findElement(By.id(expiryId)).getAttribute('type')
            .then((value) => {
              assert.equal(value, 'date');
            });
      });

      it('checks the min attribute', () => {
        return driver.findElement(By.id(expiryId)).getAttribute('min')
            .then((value) => {
              const expected = new Date().toISOString().substr(0, 10);

              assert.equal(value, expected);
            });
      });

      it('checks the max attribute', () => {
        return driver.findElement(By.id(expiryId)).getAttribute('max')
            .then((value) => {
              const date = new Date();
              date.setFullYear(date.getFullYear() + 1);
              const expected = date.toISOString().substr(0, 10);

              assert.equal(value, expected);
            });
      });
    });
  });

  describe('Page Functionality Tests', () => {
    describe('Cancel Button', () => {
      const id = 'cancel';

      /**
       * Clicking the cancel button should return the user to the homepage
       * and not make any POST request.
       */
      it('should return to homepage', () => {
        return driver.findElement(By.id(id)).click()
            .then(() => driver.wait(until.urlIs(HOMEPAGE_URL)))
            .then(() => driver.getCurrentUrl())
            .then((currUrl) => assert.equal(currUrl, HOMEPAGE_URL));
      });
    });

    /**
     * If a field is not valid, then clicking submit will display an error
     * message with the invalid field, and no POST request will be made.
     */
    describe('Submit Button', () => {
      const submitId = 'submit';
      const errorId = 'error-message';
      const date = new Date();
      const today = (date.getMonth() + 1) + '-' + date.getDate() +
        '-' + date.getFullYear();

      beforeEach('add all valid inputs', () => {
        return driver.findElement(By.id('title')).sendKeys('Waiter')
            .then(() => driver.findElement(By.id('description'))
                .sendKeys('wait on tables'))
            .then(() => driver.findElement(By.id('address'))
                .sendKeys('290 Orchard Rd'))
            .then(() => driver.findElement(By.id('postal-code'))
                .sendKeys('238859'))
            .then(() => driver.findElement(By.id('pay-frequency'))
                .sendKeys('HOURLY'))
            .then(() => driver.findElement(By.id('pay-min'))
                .sendKeys('5'))
            .then(() => driver.findElement(By.id('pay-max'))
                .sendKeys('6'))
            .then(() => driver.findElement(By.id('duration'))
                .sendKeys('OTHER'))
            .then(() => driver.findElement(By.id('expiry'))
                .sendKeys(today));
      });

      it('no job title', () => {
        return driver.findElement(By.id('title')).clear()
            .then(() => driver.findElement(By.id(submitId)).click())
            .then(() => driver.findElement(By.id(errorId)).getText())
            .then((text) => assert.equal(text,
                STRINGS[errorId] + STRINGS['title']));
      });

      it('should not be false postive', () => {
        return driver.findElement(By.id('title')).clear()
            .then(() => driver.findElement(By.id(submitId)).click())
            .then(() => driver.findElement(By.id(errorId)).getText())
            .then((text) => assert.notEqual(text,
                STRINGS[errorId]));
      });

      it('incorrect job address format', () => {
        // TODO(issue/13&33): add tests for address once maps api implemented
      });

      it('incorrect postal code', () => {
        // TODO(issue/13&33): add tests for address once maps api implemented
      });

      it('min greater than max', () => {
        return driver.findElement(By.id('pay-min')).clear()
            .then(() => driver.findElement(By.id('pay-min'))
                .sendKeys('7'))
            .then(() => driver.findElement(By.id(submitId)).click())
            .then(() => driver.findElement(By.id(errorId)).getText())
            .then((text) => assert.equal(text, STRINGS[errorId] +
                  STRINGS['pay-title']));
      });

      it('job duration not chosen', () => {
        /**
           * Note that the .clear() function does not work on
           * non-input/textarea elements. Also .sendKeys() cannot
           * be used twice on the same element.
           */
        driver.get(JOBPAGE_URL);

        return driver.findElement(By.id('title')).sendKeys('Waiter')
            .then(() => driver.findElement(By.id('description'))
                .sendKeys('wait on tables'))
            .then(() => driver.findElement(By.id('address'))
                .sendKeys('290 Orchard Rd'))
            .then(() => driver.findElement(By.id('postal-code'))
                .sendKeys('238859'))
            .then(() => driver.findElement(By.id('pay-frequency'))
                .sendKeys('HOURLY'))
            .then(() => driver.findElement(By.id('pay-min'))
                .sendKeys('5'))
            .then(() => driver.findElement(By.id('pay-max'))
                .sendKeys('6'))
            .then(() => driver.findElement(By.id('expiry'))
                .sendKeys(today))
            .then(() => driver.findElement(By.id(submitId)).click())
            .then(() => driver.findElement(By.id(errorId)).getText())
            .then((text) => assert.equal(text, STRINGS[errorId] +
                  STRINGS['duration-title']));
      });

      it('expiry date not chosen', () => {
        return driver.findElement(By.id('expiry')).clear()
            .then(() => driver.findElement(By.id(submitId)).click())
            .then(() => driver.findElement(By.id(errorId)).getText())
            .then((text) => assert.equal(text, STRINGS[errorId] +
                  STRINGS['expiry-title']));
      });

      /**
       * If all the fields are valid, then a POST request should be made and the
       * user should be returned to the homepage.
       */
      it('should return to homepage', () => {
        return driver.findElement(By.id(submitId)).click()
            .then(() => driver.wait(until.urlIs(HOMEPAGE_URL)))
            .then(() => driver.getCurrentUrl())
            .then((currUrl) => assert.equal(currUrl, HOMEPAGE_URL));
      });

      // TODO(issue/40): check that POST request has been made
      // & also check that the response is what was expected
    });
  });
});
