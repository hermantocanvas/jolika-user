import { useState, useEffect } from 'react';
import axios from 'axios';
const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories1, setSubcategories1] = useState([]);
  const [subcategories2, setSubcategories2] = useState([]);

  const [category, setCategory] = useState(null);
  const [subcategory1, setSubcategory1] = useState(null);
  const [subcategory2, setSubcategory2] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setSubcategory1(null);
    setSubcategory2(null);
    if (category) {
      loadSubcategories1(category.categoryId);
    }
  }, [category]);

  useEffect(() => {
    setSubcategory2(null);
    if (subcategory1) {
      loadSubcategories2(subcategory1.categoryId);
    }
  }, [subcategory1]);

  const loadCategories = async () => {
    const URL = `${process.env.REACT_APP_APIURL}api/v1/categories`;
    try {
      const response = await axios.get(URL);
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadSubcategories1 = async (categoryId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/subcategories1/${categoryId}`
      );
      setSubcategories1(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadSubcategories2 = async (subcategory1Id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/subcategories2/${subcategory1Id}`
      );

      setSubcategories2(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return [];
};

export default useCategory;
