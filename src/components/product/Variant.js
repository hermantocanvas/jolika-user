import React from 'react';

function Variant({ variant, subVariant, varNumber, onChangeSubvariant }) {
  return (
    <div className="formGroup">
      <label htmlFor="size">{variant.name}</label>
      <select name={variant.name} id={variant.name} onChange={(e) => onChangeSubvariant(e, varNumber)} defaultValue={subVariant}>
        {variant.variantDetails.length > 0 &&
          variant.variantDetails.map((subvariant, index) => <option value={subvariant} key={index}>{subvariant}</option>)
        }
      </select>
    </div>
  );
}

export default Variant;