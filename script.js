//selecting elements
//input elements
const dayInput = document.querySelector("#form__day-input");
const monthInput = document.querySelector("#form__month-input");
const yearInput = document.querySelector("#form__year-input");

//output elements
const outputTextElement = document.querySelectorAll(".output__type-text");
const dayOutput = document.querySelector(".output__days-text");
const monthOutput = document.querySelector(".output__months-text");
const yearOutput = document.querySelector(".output__years-text");

console.log(outputTextElement);
//other elements
const form = document.querySelector(".form");

//function
const calcDayPassed = function (dateOfBirth, dateOfToday) {
  return (dateOfToday - dateOfBirth) / (1000 * 60 * 60 * 24);
};

//validators
const validateRequired = function (value) {
  return value === "" ? "this field is required" : null;
};

const validateValidMonth = function (value) {
  return value < 1 || value > 12 ? "must be valid Month" : null;
};

const validateValidYear = function (value) {
  return value > new Date().getFullYear() ? "Must be in the past" : null;
};

function validateValidDay(monthOfBirth, yearOfBirth) {
  //if the year is leap year
  const checkLeapYear = function (yearOfBirth) {
    if (yearOfBirth % 4 === 0) {
      if (yearOfBirth % 100 === 0) {
        return yearOfBirth % 400 === 0;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const isLeapYear = checkLeapYear(yearOfBirth);

  const validateDay = function (dayOfBirth, maximumDay) {
    if (
      monthOfBirth === 3 ||
      monthOfBirth === 5 ||
      monthOfBirth === 9 ||
      monthOfBirth === 11
    ) {
      if (dayOfBirth < 1 || dayOfBirth > 30) {
        return "Must be valid Date";
      } else {
        return null;
      }
    } else if (monthOfBirth === 1) {
      if (dayOfBirth < 1 || dayOfBirth > maximumDay) {
        return "Must be valid Date";
      } else {
        return null;
      }
    } else {
      if (dayOfBirth < 1 || dayOfBirth > 31) {
        return "Must be valid Date";
      } else {
        return null;
      }
    }
  };

  return function (dayOfBirth) {
    if (isLeapYear) {
      return validateDay(dayOfBirth, 29);
    } else {
      return validateDay(dayOfBirth, 28);
    }
  };
}

const validateWholeDate = function (monthOfBirth, yearOfBirth) {
  return function (dayOfBirth) {
    const dateOfBirth = new Date(yearOfBirth, monthOfBirth, dayOfBirth);

    const dayPassed = calcDayPassed(dateOfBirth, new Date());

    if (dayPassed < 0) {
      return "Must be in the past";
    } else {
      return null;
    }
  };
};

//show and hide error messages
const showErrorMessage = function (field, error) {
  field.style.outlineColor = "var(--light-red)";
  field.setAttribute("aria-invalid", true);

  const labelElement = field.previousElementSibling;
  const showErrorMessageElement = field.nextElementSibling;

  labelElement.style.color = "var(--light-red)";
  showErrorMessageElement.textContent = error;
  showErrorMessageElement.classList.remove("hidden");
};

const hideErrorMessage = function (field) {
  const showErrorMessageElement = field.nextElementSibling;
  const labelElement = field.previousElementSibling;

  field.setAttribute("aria-invalid", false);
  showErrorMessageElement.classList.add("hidden");
  field.removeAttribute("style");
  labelElement.removeAttribute("style");
};

//Run a set of validators on value , return the first error message
const validateField = function (validators, value) {
  for (const validator of validators) {
    const error = validator(value);

    if (error) return error;
  }

  return null;
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formErrors = [];

  //day,month,year of birth
  const dayOfBirth = Number(dayInput.value);
  const monthOfBirth = Number(monthInput.value) - 1;
  const yearOfBirth = Number(yearInput.value);

  const fields = [
    {
      element: dayInput,
      validators: [
        validateRequired,
        validateValidDay(monthOfBirth, yearOfBirth),
        validateWholeDate(monthOfBirth, yearOfBirth),
      ],
    },
    {
      element: monthInput,
      validators: [validateRequired, validateValidMonth],
    },
    {
      element: yearInput,
      validators: [validateRequired, validateValidYear],
    },
  ];

  for (const field of fields) {
    const fieldError = validateField(field.validators, field.element.value);

    if (fieldError) {
      formErrors.push(fieldError);

      //showError
      showErrorMessage(field.element, fieldError);

      outputTextElement.forEach((el) => {
        el.style.animationName = "none";
      });

      //intialzing the output field to it's first state
      yearOutput.textContent =
        monthOutput.textContent =
        dayOutput.textContent =
          "--";
    } else {
      //hideError
      hideErrorMessage(field.element);
    }
  }

  // //validate if the birth date the user submits is in the future
  const dateOfBirth = new Date(yearOfBirth, monthOfBirth, dayOfBirth);
  console.log(dateOfBirth);
  const dayPassed = calcDayPassed(dateOfBirth, new Date());

  //when the form is valid
  if (formErrors.length === 0) {
    //the age of the person
    const year = Math.trunc(dayPassed / 365);
    const month = Math.trunc((dayPassed % 365) / 30);
    const day = Math.round((dayPassed % 365) % 30);

    outputTextElement.forEach((el) => {
      el.style.letterSpacing = "0";
      el.style.marginRight = "1rem";
      el.style.animationName = "appear";
    });

    //displaying the age of the person
    yearOutput.textContent = year;
    monthOutput.textContent = month;
    dayOutput.textContent = day;
  }
});
