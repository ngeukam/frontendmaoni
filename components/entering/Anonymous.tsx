import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

interface Props {
  isAnonymous?: boolean;
  value?: string;
  onAnonymousChange?: (isAnonymous: boolean) => void;
  onInputChange?: (field: "name" | "contact", value: string) => void;
  onValidate?: (isValid: boolean) => void; // Validation callback to parent
}

const InputField: React.FC<{
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required: boolean;
  errorMessage?: string;
}> = ({ id, placeholder, value, onChange, required, errorMessage }) => (
  <div className="relative mb-8">
    <label
      htmlFor={id}
      className="absolute -top-[30%] ltr:left-3 rtl:right-3 bg-palette-card p-[0.3rem] whitespace-nowrap dark:bg-gray-800 dark:text-white"
    >
      {required && <span className="text-rose-700 mx-1 mt-1">*</span>}
      {placeholder}
    </label>
    <input
      type="text"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full py-4 px-6 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
      required={required}
      aria-required={required}
    />
    {errorMessage && <p className="text-rose-700 text-sm mt-2">{errorMessage}</p>}
  </div>
);

const Anonymous: React.FC<Props> = ({
  isAnonymous = false,
  onAnonymousChange,
  onInputChange,
  onValidate,
}) => {
  const [anonymous, setAnonymous] = useState(isAnonymous);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSwitchChange = () => {
    const newAnonymousState = !anonymous;
    setAnonymous(newAnonymousState);
    if (onAnonymousChange) {
      onAnonymousChange(newAnonymousState);
    }
    setName("");
    setContact("");
    // Notify parent about validation state (anonymous is valid by default)
    if (onValidate) {
      onValidate(newAnonymousState || true);
    }
  };

  const handleInputChange = (field: "name" | "contact", value: string) => {
    if (field === "name") {
      setName(value);
      if (!validateName(value)) {
        setNameError(t.invalidName??'Invalid Name');
      } else {
        setNameError(null);
      }
    }
    if (field === "contact") {
      setContact(value);
      if (!validateContact(value)) {
        setContactError(t.invalidContact ?? 'Invalid Contact');
      } else {
        setContactError(null);
      }
    }
    if (onInputChange) onInputChange(field, value);
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
  };

  const validateContact = (contact: string): boolean => {
    const phoneRegex = /^[0-9]{9,15}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return phoneRegex.test(contact) || emailRegex.test(contact);
  };

  useEffect(() => {
    if (!anonymous) {
      const isValid = !nameError && !contactError && name.trim() !== "" && contact.trim() !== "";
      if (onValidate) {
        onValidate(isValid);
      }
    }
  }, [nameError, contactError, name, contact, anonymous, onValidate]);

  return (
    <>
      <div className="anonymous-switch flex items-center space-x-3 mb-8">
        <label htmlFor="anonymous" className="text-sm text-gray-600 dark:text-white">
          {anonymous ? t.stayAnonymous : t.stayAnonymous2}
        </label>
        <input
          type="checkbox"
          id="anonymous"
          checked={anonymous}
          onChange={handleSwitchChange}
          className="h-6 w-6 border-2 mb-4 border-gray-300 rounded-lg cursor-pointer bg-gray-300 checked:bg-blue-500 checked:border-blue-500 relative transition duration-300 dark:bg-gray-600 dark:border-gray-500 dark:checked:bg-blue-700 dark:checked:border-blue-700"
        />
      </div>

      {!anonymous && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <InputField
            id="name"
            placeholder={t.yourName || "Your Name"}
            value={name}
            onChange={(value) => handleInputChange("name", value)}
            required={true}
            errorMessage={nameError ?? ""}
          />
          <InputField
            id="contact"
            placeholder={t.yourContact || "Your Contact"}
            value={contact}
            onChange={(value) => handleInputChange("contact", value)}
            required={true}
            errorMessage={contactError ?? ""}
          />
        </div>
      )}
    </>
  );
};

export default Anonymous;
