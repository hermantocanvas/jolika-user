import React from "react";

const SubcategoryBlock = ({ value, onChange, subcategories, name }) => {
  if (!subcategories || !subcategories.length) return null;
  return (
    <select
      style={{ textTransform: "capitalize" }}
      name={name}
      required
      value={value}
      onChange={onChange}
    >
      <option value="">Pilih Sub Kategori...</option>
      {subcategories.map((subcategory) => (
        <option value={subcategory.categoryId} key={subcategory.categoryId}>
          {subcategory.category_ind}
        </option>
      ))}
    </select>
  );
};

export default SubcategoryBlock;
