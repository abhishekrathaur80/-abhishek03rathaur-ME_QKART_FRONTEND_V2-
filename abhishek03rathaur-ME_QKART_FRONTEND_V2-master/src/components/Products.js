import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,Typography,Stack
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [productData, setProductData] = useState([]);

  const [isLoading, setIsLoding] = useState(true);
  const [searchText, setSearcText] = useState('')
  const [timer, setTimer] = useState();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [filteredCartItems, setFilteredCartItems] = useState([])
  const [allProducts, setAllProducts] = useState([])
  let token = localStorage.getItem('token');


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {

      let data = await axios.get(`${config.endpoint}/products`);
      let resp = data.data;
      setProductData(resp);
      setAllProducts(resp);
      setIsLoding(false);

      return resp;

      
    } catch (error) {
      if (error.response && error.response.status === 500) {

        enqueueSnackbar(error.response.data.message, { variant: "warning", autoHideDuration: 5000 })
        
      } else {
        enqueueSnackbar(error.message, { variant: "warning", autoHideDuration: 5000 })
      }
       
      return [];
      
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      setProductData([]);

      const data = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      const resp = data.data;

      setProductData(resp);

    } catch (error) {
      if (error.response && error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, { variant: "warning", autoHideDuration: 5000 });
        
      }
      
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    clearTimeout(timer);

    const _timer = setTimeout(() => {
      setSearcText(event.target.value);
    }, debounceTimeout);

    setTimer(_timer);
  };


  const fetchCart = async () => {
    if (!token)
      return;
    
    try {
      
      let resp = await axios.get(`${config.endpoint}/cart`, {
        headers: {
           "Authorization": `Bearer ${token}`
        }
      })
    
      let data = resp.data;
      setCartData(data);
      return data;

    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message ,{variant:"error"})
      } else {
        enqueueSnackbar("Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.", {
          variant:"error"
        })
      }
      return null;
    }
  }

  const isItemInCart = (items,productId) => {
  
    for (let i = 0; i < items.length; i++){
      if (items[i].productId === productId) {
         enqueueSnackbar("Item already in cart. Use the cart sidebar to update or remove item.", {
                    variant: "warning",
                    autoHideDuration: 5000
         })
        return false;
      }
    }
    return true;
  }
  
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options={preventDuplicate:false}
  ) => {

    if (options.preventDefault) {
      if (!isItemInCart(items, productId))
        return;
    }

    if (isLoggedIn) {
      try {
        
        let data = await axios.post(`${config.endpoint}/cart`, {
          productId, qty
        }, {
          headers: {
               Authorization: `Bearer ${token}`
            }
          }
        )
        const resp = data.data;
        setCartData(resp);
        return resp;
      } catch (error) {
        if (error.response.status === 404) {
                    enqueueSnackbar(error.response.message, {
                        variant: "warning",
                        autoHideDuration: 3000
                    })
                } else {
                    enqueueSnackbar(error.response.message, {
                        variant: "warning",
                        autoHideDuration: 3000
                    })
                }
                return null
        
      }
    } else {
      enqueueSnackbar("You must be logged in to add products to cart. Please log in !!", {
                variant: "warning",
                autoHideDuration: 3000
            })
            return;
    }
    
  }

  useEffect(() => {
    performSearch(searchText);
  }, [searchText]);


  useEffect(() => {
    const runApi = async () => {
      let arr = [];
      arr = await performAPICall();
      if (localStorage.getItem('token')) {
        let tempToken = localStorage.getItem('token');
        setIsLoggedIn(true);
        let filter = [];
        filter = await fetchCart(tempToken);
        setFilteredCartItems(generateCartItemsFrom(filter, arr))
      }
    }
    runApi()
  }, [])


  useEffect(() => {
    const run = async () => {
      setFilteredCartItems(generateCartItemsFrom(cartData,allProducts))
    }
    run()
  },[cartData])


  if (!isLoggedIn) {
        return (
            <div>
                <Header>
                    {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

                    <TextField
                        className="search-desktop"
                        size="small"
                        onChange={(e) => debounceSearch(e, 500)}

                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Search color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Search for items/categories"
                        name="search"
                    />
                </Header>

                {/* Search view for mobiles */}
                <TextField
                    className="search-mobile"
                    size="small"
                    fullWidth
                    onChange={(e) => debounceSearch(e, 500)}

                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search color="primary" />
                            </InputAdornment>
                        ),
                    }}
                    placeholder="Search for items/categories"
                    name="search"
                />
                {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}

                <Grid container>
                    <Grid item className="product-grid">
                        <Box className="hero">
                            <p className="hero-heading">
                                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                                to your door step
                            </p>
                        </Box>
                        {
                            isLoading
                                ? <Grid container justifyContent="center">
                                    <Stack
                                        direction="column"
                                        justifyContent="center"
                                        alignItems="center"
                                        spacing={2}
                                        my={10}
                                    >
                                        <CircularProgress />
                                        <Typography variant="h6" component="div">
                                            Loading
                                        </Typography>
                                    </Stack>
                                </Grid>
                                : productData.length === 0
                                    ?
                                    <Grid container justifyContent="center">
                                        <Stack
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                            spacing={2}
                                            my={15}
                                        >
                                            <SentimentDissatisfied />
                                            <Typography variant="h5">No Products Found</Typography>
                                        </Stack>
                                    </Grid>
                                    :
                                    <Grid container spacing={2} justifyContent="space-evenly" my={2}>
                                        {productData.map(product => {
                                            return (
                                                <Grid item key={product._id} xs={6} id={product._id} className="product-grid" md={3}>
                                                    <ProductCard product={product} handleAddToCart={async () => {
                                                        await addToCart(
                                                            token,
                                                            cartData,
                                                            productData,
                                                            product._id,
                                                            1,
                                                            { preventDefault: true }
                                                        )
                                                    }} />
                                                </Grid>)
                                        }
                                        )}
                                    </Grid>
                        }
                    </Grid>
                </Grid>

                <Footer />
            </div>
        );
    }



    return (
        <div>
            <Header>
                {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

                <TextField
                    className="search-desktop"
                    size="small"
                    onChange={(e) => debounceSearch(e, 500)}

                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search color="primary" />
                            </InputAdornment>
                        ),
                    }}
                    placeholder="Search for items/categories"
                    name="search"
                />
            </Header>

            {/* Search view for mobiles */}
            <TextField
                className="search-mobile"
                size="small"
                fullWidth
                onChange={(e) => debounceSearch(e, 500)}

                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search color="primary" />
                        </InputAdornment>
                    ),
                }}
                placeholder="Search for items/categories"
                name="search"
            />
            {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
            <Grid container direction="row" >
                <Grid item md={9} xs={12}>
                    <Grid container>
                        <Grid item className="product-grid">
                            <Box className="hero">
                                <p className="hero-heading">
                                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                                    to your door step
                                </p>
                            </Box>
                            {
                                isLoading
                                    ? <Grid container justifyContent="center">
                                        <Stack
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                            spacing={2}
                                            my={10}
                                        >
                                            <CircularProgress />
                                            <Typography variant="h6" component="div">
                                                Loading
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    : productData.length === 0
                                        ?
                                        <Grid container justifyContent="center">
                                            <Stack
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                                spacing={2}
                                                my={15}
                                            >
                                                <SentimentDissatisfied />
                                                <Typography variant="h5">No Products Found</Typography>
                                            </Stack>
                                        </Grid>
                                        :
                                        <Grid container spacing={2} justifyContent="space-evenly" my={2}>
                                            {productData.map(product => {
                                                return (
                                                    <Grid item key={product._id} xs={6} id={product._id} className="product-grid" md={3}>
                                                        <ProductCard product={product}
                                                            handleAddToCart={async () => {
                                                                await addToCart(
                                                                    token,
                                                                    cartData,
                                                                    productData,
                                                                    product._id,
                                                                    1,
                                                                    { preventDefault: true }
                                                                )
                                                            }} />
                                                    </Grid>)
                                            }
                                            )}
                                        </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={3} xs={12} bgcolor="#E9F5E1">

                    <Cart products={productData} items={filteredCartItems} handleQuantity={addToCart} />

                </Grid>
            </Grid>
            <Footer />
        </div>
    );
         
};


export default Products;
