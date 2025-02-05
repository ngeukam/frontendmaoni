import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

// Props interface
interface Props {
  id: string;
  type: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  classes?: string;
  value?: string;
  ref?: React.Ref<IImperativeHandler>;
  readonly?: boolean;
  autocomplete?: string;
  title?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateTitle?: boolean;  // Optional prop to validate the title
  validateCode?: boolean;   // Optional prop to validate the code
  validatePhone?: boolean;  // Optional prop to validate phone number
  validateEmail?: boolean;  // Optional prop to validate email
  validatePassword?: boolean;  // Optional prop to validate password
  validateWebsite?: boolean;  // Optional prop to validate website (URL)
  validationType?: "title" | "code" | "email" | "phone" | "password" | "website";
  onValidate?: (isValid: boolean) => void;
}

// Interface for imperative handler
export interface  IImperativeHandler {
  focus: () => void;
  clear: () => void; // Method to clear the field
  value?: string;
  getValue: () => string;
  setValue: (newValue: string) => void; // Added setValue method
}

const Input = React.forwardRef<IImperativeHandler, Props>((props, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(props.value || "");
  const [error, setError] = useState<string | null>(null);  // State for error message
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    // Perform validation
    if (props.onChange) {
      props.onChange(e); // Pass the event to the parent if needed
    }
  };
  useEffect(() => {
    // Validation chaque fois que la valeur change
    const validationError = validateInput(value);
    setError(validationError); // Mettre à jour l'état de l'erreur

  }, [value]);

  const inputFocused = () => {
    inputRef.current?.focus();
    inputRef.current?.setAttribute("style", "border:2px solid red");
  };

  const clearField = () => {
    setValue(""); // Clear the field value
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns the date in YYYY-MM-DD format
  };

  function validateInput(value: string) {
    let isValid = true;
    let errorMessage = ""; // Initialize an empty error message

    if (props.validationType === "title") {
      if (value && props.required && !value.trim() && props.validateTitle) {
        isValid = false;
        errorMessage = t.title_is_required || "";
      }
      if (value && props.maxLength && value.length > props.maxLength && props.validateTitle) {
        isValid = false;
        errorMessage = `${t.title_cannot_exceed} ${props.maxLength} ${t.characters}.`;
      }
    }

    if (props.validationType === "code") {
      const codeRegex = /^[A-Za-z0-9]+$/; // Alphanumeric
      if (value && props.required && !value.trim()) {
        isValid = false;
        errorMessage = t.code_is_required || "Code is required";
      }
      if (value && !codeRegex.test(value)) {
        isValid = false;
        errorMessage = t.code_must_be_alphanumeric || "Code must be alphanumeric";
      }
    }

    if (props.validationType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && props.required && !value.trim() && props.validateEmail) {
        isValid = false;
        errorMessage = t.email_is_required || "email is required";
      }
      if (value && !emailRegex.test(value) && props.validateEmail) {
        isValid = false;
        errorMessage = t.invalid_email_address || "Invalid email address";
      }
    }

    if (props.validationType === "phone") {
      const phoneRegex = /^[0-9]+$/; // Numeric only
      if (value && props.required && !value.trim() && props.validatePhone) {
        isValid = false;
        errorMessage = t.phone_number_is_required || "Phone number is required";
      }
      if (value && !phoneRegex.test(value) && props.validatePhone) {
        isValid = false;
        errorMessage = t.phone_number_must_contain_only_digits || "Phone number must contain only digits.";
      }
      if (value && (value.length < 9 || value.length > 15) && props.validatePhone) {
        isValid = false;
        errorMessage = t.phone_number_must_be_between_9_and_15_digits || "Phone number must be between 9 and 15 digits.";
      }
    }

    if (props.validationType === "password") {
      if (value && props.required && !value.trim() && props.validatePassword) {
        isValid = false;
        errorMessage = t.password_is_required || "Password is required";
      }
      if (value && props.minLength && value.length < props.minLength && props.validatePassword) {
        isValid = false;
        errorMessage =`${t.password_must_be_at_least} ${props.minLength} ${t.characters}.` || `Password must be at least ${props.minLength} characters long.`;
      }
      const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/;
      if (value && !complexityRegex.test(value) && props.validatePassword) {
        isValid = false;
        errorMessage = t.password_must_include||"Password must include uppercase, lowercase, numbers, and special characters.";
      }
    }

    if (props.validationType === "website") {
      const websiteRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/; // Simple URL regex
      if (value && props.required && !value.trim() && props.validateWebsite) {
        isValid = false;
        errorMessage = t.website_URL_is_required ||"Website URL is required.";
      }
      if (value && !websiteRegex.test(value) && props.validateWebsite) {
        isValid = false;
        errorMessage = t.invalid_website_URL || "Invalid website URL. It should start with http:// or https://.";
      }
    }

    if (!isValid && props.onValidate) {
      props.onValidate(false); // Notify parent if invalid
    } else if (isValid && props.onValidate) {
      props.onValidate(true); // Notify parent if valid
    }

    return errorMessage; // Return the error message or null if valid
  }

  // Expose imperative methods via ref
  useImperativeHandle(ref, () => ({
    focus: inputFocused,
    clear: clearField, // Expose the clear method
    value: value,
    getValue: () => value,
    setValue: (newValue: string) => {
      setValue(newValue); // Update the internal value state
    },
  }));

  return (
    <div className="relative mb-8">
      <label
        className="absolute z-[10] -top-[30%] ltr:left-3 rtl:right-3 bg-palette-card p-[0.3rem] whitespace-nowrap dark:bg-gray-800 dark:text-white"
        htmlFor={props.id}
      >
        {props.required && <span className="text-rose-700 mx-1 mt-1">*</span>}
        {t[`${props.id}`]}
      </label>
      <div className="relative z-[5]">
        <input
          ref={inputRef}
          id={props.id}
          minLength={props.minLength}
          maxLength={props.maxLength}
          type={showPassword ? "text" : props.type}
          placeholder={t[`${props.placeholder}`]}
          value={value}
          readOnly={props.readonly || false}
          onChange={inputChangeHandler}  // Use the updated inputChangeHandler
          autoComplete={props.autocomplete || "off"}
          className={`w-full py-4 px-6 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500`}
          title={props.title || ""}
          required={props.required || false}
          // Disable future dates by setting max to today's date
          max={props.type === "date" ? getTodayDate() : undefined}
        />
        {props.type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
          >
            {showPassword ? (
              <EyeOffIcon className="w-6 h-6 text-gray-500" />
            ) : (
              <EyeIcon className="w-6 h-6 text-gray-500" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-rose-700 mt-2 text-sm">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
