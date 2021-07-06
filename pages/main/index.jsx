import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Grid } from "@chakra-ui/layout";
import { GridItem } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { Button } from "@chakra-ui/button";
import { Link } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

export default function Home({ products }) {
  // const [products, setProducts] = useState([]);
  const [card, setCard] = useState([]);
  const [total, setTotal] = useState(0);
  const [whatsapp, setWhatsapp] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  useEffect(() => {
    getData();
  }, []);

  function handleClickAddCard(tipo, precio) {
    setCard([...card, tipo]);
    setTotal(Number(total + precio).toFixed(2));
  }

  function handleSendWhatsApp() {
    const result = card.map((product) => product).join("-");
    setWhatsapp(result, total);
  }

  return (
    <>
      <h1>Products</h1>
      <Grid gridTemplateColumns="repeat(auto-fit, minmax(240px, 300px))">
        {Boolean(products) &&
          products.map((product) => {
            return (
              <GridItem key={product.id}>
                <Image
                  src={product.urlImage}
                  height="150px"
                  width="auto"
                  margin="auto"
                  display="block"
                  alt="foto"
                ></Image>
                <Text align="center">{product.tipo}</Text>
                <Text color="red.900" align="right">
                  $ {product.precio}
                </Text>
                <Button
                  onClick={() =>
                    handleClickAddCard(product.tipo, product.precio)
                  }
                >
                  Agregar
                </Button>
              </GridItem>
            );
          })}
      </Grid>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        ver carrito
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Productos</DrawerHeader>

          <DrawerBody>
            {Boolean(card.length) &&
              card.map((item, idx) => (
                <Text>
                  {idx} {item}
                </Text>
              ))}
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Text>Total: {total}</Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Link href={`https://wa.me/541111111111?text=${whatsapp}${total}`}>
        <Button onClick={handleSendWhatsApp}>Completar pedido</Button>
      </Link>
    </>
  );
}

const getData = async () => {
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
      console.log("algo salio mal", error);
    });
  return data;
};

export async function getStaticProps() {
  const products = await getData();
  return {
    props: { products },
    revalidate: 120,
  };
}
