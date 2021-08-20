import axios from "axios";
import Papa from "papaparse";

export const getData = async () => {
  let data = [];
  await axios
    .get(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvXrVki3OtoXJ9Ci-Ylqny0khYyLa3yfVIxzopVV03g2v-2A-PjKP9Kgx0wSd4MhEWNTBPU0sDT9n0/pub?gid=0&single=true&output=csv"
    )
    .then((response) => {
      Papa.parse(response.data, {
        header: true,
        complete: function (results) {
          data = results.data;
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
};
