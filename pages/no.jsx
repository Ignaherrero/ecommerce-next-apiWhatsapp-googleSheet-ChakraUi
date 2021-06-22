import axios from "axios";
import React from "react";
import Home from ".";
const Index = ({ products }) => {
  return <>{<Home />}</>;
};

const data = async () => {
  await axios
    .get(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvXrVki3OtoXJ9Ci-Ylqny0khYyLa3yfVIxzopVV03g2v-2A-PjKP9Kgx0wSd4MhEWNTBPU0sDT9n0/pub?gid=0&single=true&output=csv"
    )
    .then((response) => {
      Papa.parse(response.data, {
        header: true,
        complete: function (results) {
          // setProducts(results.data);
          return results.data;
        },
      });
    })
    .catch((error) => {
      console.log("algo salio mal", error);
    });
};

export const getStaticProps = async () => {
  // let products = [{ id: "1a" }];
  let products = await data();
  // setTimeout(() => {
  if (!products) {
    return {
      notFound: true,
    };
  }

  return {
    props: { products },
    revalidate: 10,
  };
  // }, 2000);
};

export default Index;
