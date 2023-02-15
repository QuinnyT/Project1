const getIcons = (url) => {
    return new URL(`/static/${url}`, import.meta.url).href;
  };
const getCategories = (url) => {
    return new URL(`/static/categoryicon/${url}`, import.meta.url).href;
  };
   
  export default {
    getIcons,
    getCategories
  }