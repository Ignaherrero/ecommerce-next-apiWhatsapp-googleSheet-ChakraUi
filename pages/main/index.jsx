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
  Flex,
  Box,
  Img,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

export default function Home({ products }) {
  const [card, setCard] = useState([]);
  const [total, setTotal] = useState(0);
  const [whatsapp, setWhatsapp] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  useEffect(() => {
    getData();
  }, []);

  function handleClickAddCard(tipo, precio) {
    setCard([...card, [tipo, precio]]);
    setTotal(total + Number.parseFloat(precio, 10));
  }

  function handleSendWhatsApp() {
    const result = card.map((product) => product).join("-");
    setWhatsapp(result, total);
  }

  function handleDeleteOneproduct(item) {
    const result = card.filter((product) => product !== item);
    setCard(result);
    let totaltwo = 0;
    for (let total of result) {
      totaltwo += Number.parseFloat(total[1], 10);
    }
    setTotal(totaltwo);
  }

  return (
    <>
      <Box margin="auto" width="200px">
        <Box margin="auto">
          <Image
            borderRadius="full"
            boxSize="100px"
            objectFit="cover"
            src="https://res.cloudinary.com/dqu61o0vv/image/upload/v1628194313/images_wynqck.jpg"
            alt="Segun Adebayo"
            margin="auto"
          />
        </Box>
        <Text textAlign="center">Tienda</Text>
      </Box>
      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(240px, 300px))"
        gridGap="10px"
      >
        {Boolean(products) &&
          products.map((product) => {
            return (
              <GridItem key={product.id} background="blackAlpha.50">
                <Image
                  src={product.urlImage}
                  height="150px"
                  width="auto"
                  margin="auto"
                  display="block"
                  alt={product.tipo}
                ></Image>
                <Text color="red.900" align="right">
                  $ {product.precio}
                </Text>
                <Button
                  onClick={() =>
                    handleClickAddCard(product.tipo, product.precio)
                  }
                  variant="outline"
                  size="sm"
                  margin="auto"
                >
                  Agregar
                </Button>
              </GridItem>
            );
          })}
      </Grid>
      <Button
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
        variant="outline"
        size="sm"
        position="fixed"
        bottom={5}
        lefth="50%"
      >
        <Img src="https://icongr.am/clarity/shopping-cart.svg?size=30&color=000000"></Img>{" "}
        Productos
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
            <VStack spacing={6}>
              {Boolean(card.length) &&
                card.map((item, idx) => (
                  <Box width="100%">
                    <Flex justifyContent="space-between">
                      <Text display="inline-block">
                        $ {item[1]} {item[0]}{" "}
                      </Text>
                      <Button
                        onClick={() => {
                          handleDeleteOneproduct(item);
                        }}
                        backgroundColor="white"
                        size="xs"
                      >
                        <Image src="https://icongr.am/fontawesome/trash-o.svg?size=24&color=ff0000" />
                      </Button>
                    </Flex>
                    <Divider orientation="horizontal" />
                  </Box>
                ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Link href={`https://wa.me/541111111111?text=${whatsapp}${total}`}>
              <Button onClick={handleSendWhatsApp}>
                <Img src="https://icongr.am/fontawesome/whatsapp.svg?size=30&color=047c28"></Img>
                Completar pedido
              </Button>
            </Link>
            <Text>Total: $ {total}</Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
    .catch((error) => {});
  return data;
};

export async function getStaticProps() {
  const products = await getData();
  return {
    props: { products },
    revalidate: 120,
  };
}
