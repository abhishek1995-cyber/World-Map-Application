export const getCountryDetails = (country) => {
    return (dispatch) => {
      fetch(
        `https://restcountries.com/v3.1/name/${country}`
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: "GET_COUNTRY_DETAILS",
            payload: data,
          });
        });
    };
  };