import axios from "axios";
import Papa from "papaparse";

export const apiRes = async () => {
  await axios
    .get(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvXrVki3OtoXJ9Ci-Ylqny0khYyLa3yfVIxzopVV03g2v-2A-PjKP9Kgx0wSd4MhEWNTBPU0sDT9n0/pub?gid=0&single=true&output=csv"
    )
    .then((response) => {
      resolve("hola");
      // Papa.parse(response.data, {
      //   header: true,
      //   complete: function (results) {
      //     return results.data;
      //   },
      // });
    })
    .catch((error) => {
      // return [results.data, error];
      reject(error);
    });
};
