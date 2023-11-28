import React, { useState } from 'react';
import schema from './pasta.json';
import './PastaForm.css';

const PastaForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    portion: 'Medium',
    pasta_type: {
      sauce: 'Red', // Default sauce value
      topping_type: 'Veg', // Default topping value
      cheese: 'Cheddar', // Default cheese value
    },
  });

  const [showPortion, setShowPortion] = useState(false);
  const [showCheese, setShowCheese] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => {
      if (key.includes('.')) {
        const [groupKey, subKey] = key.split('.');
        return {
          ...prevData,
          [groupKey]: {
            ...prevData[groupKey],
            [subKey]: value,
          },
        };
      } else {
        return {
          ...prevData,
          [key]: value,
        };
      }
    });
  };

  const handleToggle = (setter) => {
    setter((prevValue) => !prevValue);
  };

  const handleCancel = () => {
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform form submission logic here, such as making an API call.
    console.log('Form submitted:', formData);
  };

  const renderInput = (field) => (
    <div key={field.jsonKey} className={field.jsonKey === 'name' ? 'pasta-name-container' : null}>
      <label>
        {field.label}:
        {field.validate.required && <span className="required">*</span>}
      </label>
      <input
        type="text"
        value={formData[field.jsonKey]}
        onChange={(e) => handleInputChange(field.jsonKey, e.target.value)}
        placeholder={field.placeholder}
      />
    </div>
  );

const renderSelect = (field) => (
  <div key={field.jsonKey} className={`${field.jsonKey}-container ${field.jsonKey === 'sauce' ? 'sauce-select' : ''} ${field.jsonKey === 'topping_type' ? 'topping-select' : ''}
  ${field.jsonKey === 'cheese' ? 'cheese-select' : ''}`}>
    <label>
      {field.label}:
      {field.validate.required && <span className="required">*</span>}
    </label>
    <select
      value={formData[field.jsonKey]}
      onChange={(e) => handleInputChange(field.jsonKey, e.target.value)}
      className={`${field.jsonKey}-select`}
    >
      {field.validate.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const renderForm = () => (
  <form onSubmit={handleSubmit}>
    {schema.map((field) => {
      if (field.uiType === 'Input') {
        return renderInput(field);
      } else if (field.uiType === 'Group') {
        if (field.jsonKey === 'pasta_type') {
          return (
            <div key="pastaType" className="pasta-type-container">
              <p className='pasta-txt'>Pasta Type  <span className="required">*</span></p>
              <hr className='hr2'></hr>
              {field.subParameters.map((subField) => {
                if (subField.jsonKey === 'sauce') {
                  return renderSelect(subField);
                } else if (subField.jsonKey === 'topping_type') {
                  return renderSelect(subField);
                } else if (subField.jsonKey === 'cheese' && showCheese) {
                  return renderSelect(subField);
                }
                return null;
              })}
              <button type="button" onClick={() => handleToggle(setShowCheese)} className="show-cheese-btn">
                {showCheese ? 'Hide advanced fields' : 'Show advanced fields'}
              </button>
            </div>
          );
        }
      }
      return null;
    })}
    {showPortion && renderSelect(schema.find((field) => field.jsonKey === 'portion'))}

    <div className="button-box">
      <button type="button" onClick={handleCancel} className="cancel-btn">
        Cancel
      </button>

      <button type="button" onClick={() => handleToggle(setShowPortion)} className="show-portion-btn">
        {showPortion ? 'Hide advanced fields' : 'Show advanced fields'}
      </button>

      <button type="submit" className="submit-btn">
        Submit
      </button>
    </div>
  </form>
);

  return (
    <div>
      <h1>Create Pasta</h1>
      <hr className="hr1"></hr>
      {renderForm()}
    </div>
  );
};

export default PastaForm;
