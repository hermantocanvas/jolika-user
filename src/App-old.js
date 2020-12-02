import React, { Fragment, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./components/Home";
import Category from "./components/browseCategory/BrowseCategory";
import MarketplaceProduct from "./components/marketplaceProduct/MarketplaceProduct";
import Search from "./components/search/Search";
import Login from "./components/account/Login";
import ResetPassword from "./components/account/ResetPassword";
import ProcessResetPassword from "./components/account/ProcessResetPassword";
import Logout from "./components/account/Logout";
import Register from "./components/account/Register";
import VerifyRegister from "./components/account/VerifyRegister";
import RegisterSosmed from "./components/account/RegisterSosmed";
import NotFound from "./components/modules/NotFound";
import Alerts from "./components/modules/Alerts";
import Account from "./components/account/Account";
import AlertState from "./context/alert/AlertState";
import AuthState from "./context/auth/authState";
import CartState from "./context/cart/cartState";
import WishlistState from "./context/wishlist/wishlistState";
import CustomerRoute from "./components/routing/CustomerRoute";
import EditProduct from "./components/account/products/editProduct/EditProduct";
import Backup from "./components/account/products/editProduct/backup";
import EditBuyerOrder from "./components/account/orders/EditBuyerOrder";
import EditSellerOrder from "./components/account/orders/EditSellerOrder";
import Checkout from "./components/account/checkout/Checkout";
import CheckoutMarketplace from "./components/checkoutMarketplace/CheckoutMarketplace";
import Cart from "./components/cart/Cart";
import ScrollToTop from "./utils/ScrollToTop";
import Toc from "./components/Toc";
import Faq from "./components/Faq";
import About from "./components/About";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import HowTo from "./components/HowTo";
import SponsoredPage from "./components/SponsoredPage";
import { Helmet } from "react-helmet";
import Thankyou from "./components/checkoutMarketplace/Thankyou";
import ModalCategory from "./components/modalCategory/Categories";
import BrowseMarketplace from "./components/browseMarketplace/BrowseMarketplace";
import BrowseMarketplaceOfUser from "./components/browseMarketplaceOfUser/BrowseMarketplaceOfUser";
import BrowseAuction from "./components/browseAuction/BrowseAuction";

import EditVariant from "./components/account/products/editVariant/EditVariant";
import BrowseWishlist from "./components/browseWishlist/BrowseWishlist";
import AuctionProduct from "./components/auctionProduct/AuctionProduct";
import BrowseCurrentAuction from "./components/browseCurrentAuction/BrowseCurrentAuction";
import Pembayaran from "./components/checkoutMarketplace/pembayaran/Pembayaran";

const App = () => {
  const [isShowCategory, setIsShowCategory] = useState(false);
  const toggleCategory = () => setIsShowCategory(!isShowCategory);

  return (
    <Fragment>
      <Helmet>
        <title>Okebid | Situs Marketplace Lelang</title>
        <meta name="description" content={``} />
      </Helmet>

      <AuthState>
        <AlertState>
          <CartState>
            <WishlistState>
              <Router>
                <ScrollToTop>
                  <Header toggleCategory={toggleCategory} />
                  <div className="main_content">
                    <Alerts />
                    {isShowCategory && (
                      <ModalCategory toggleCategory={toggleCategory} />
                    )}
                    <Switch>
                      <Route exact path="/" component={Home} />
                      <Route
                        exact
                        path="/wishlist"
                        component={BrowseWishlist}
                      />
                      <Route
                        exact
                        path="/products-of-seller/:seller_username"
                        component={BrowseMarketplaceOfUser}
                      />
                      <Route
                        exact
                        path="/browse/marketplace"
                        component={BrowseMarketplace}
                      />

                      <Route
                        exact
                        path="/browse/auction"
                        component={BrowseAuction}
                      />
                      <Route
                        exact
                        path="/lelang-berjalan"
                        component={BrowseCurrentAuction}
                      />
                      <Route
                        exact
                        path="/kategori/:category"
                        component={Category}
                      />
                      <Route
                        exact
                        path="/kategori/:category/:subcategory1"
                        component={Category}
                      />
                      <Route
                        exact
                        path="/kategori/:category/:subcategory1/:subcategory2"
                        component={Category}
                      />
                      <Route exact path="/cari-produk/" component={Search} />
                      <Route path="/produk/:alias" component={AuctionProduct} />
                      <Route
                        path="/produk-marketplace/:alias"
                        component={MarketplaceProduct}
                      />

                      <Route exact path="/cart" component={Cart} />
                      <Route exact path="/login" component={Login} />
                      <Route exact path="/daftar" component={Register} />
                      <Route exact path="/faq" component={Faq} />
                      <Route exact path="/tentang-kami" component={About} />
                      <Route exact path="/hubungi-kami" component={Contact} />
                      <Route exact path="/privacy" component={PrivacyPolicy} />
                      <Route exact path="/cara-lelang" component={HowTo} />
                      <Route
                        exact
                        path="/sponsored"
                        component={SponsoredPage}
                      />
                      <Route
                        exact
                        path="/verifikasi-daftar/:token"
                        component={VerifyRegister}
                      />
                      <Route
                        exact
                        path="/reset-password"
                        component={ResetPassword}
                      />
                      <Route
                        exact
                        path="/proses-reset-password/:token"
                        component={ProcessResetPassword}
                      />
                      <Route
                        exact
                        path="/daftar-sosmed/:name/:email"
                        component={RegisterSosmed}
                      />
                      <Route exact path="/logout" component={Logout} />
                      <Route exact path="/syarat-ketentuan" component={Toc} />
                      <Route exact path="/thankyou" component={Thankyou} />
                      <CustomerRoute
                        path="/akun/:accountPage"
                        component={Account}
                      />
                      <CustomerRoute
                        path="/akun-edit-produk/:id"
                        component={EditProduct}
                      />
                      <CustomerRoute
                        path="/akun-edit-produk2/:id"
                        component={Backup}
                      />
                      <CustomerRoute
                        path="/akun-edit-variant-produk/:id"
                        component={EditVariant}
                      />

                      <CustomerRoute
                        path="/akun-checkout/:auctionId"
                        component={Checkout}
                      />
                      <CustomerRoute
                        path="/checkout/:paymentId"
                        component={Pembayaran}
                      />
                      <CustomerRoute
                        path="/checkout"
                        component={CheckoutMarketplace}
                      />

                      <CustomerRoute
                        path="/akun-edit-pembelian/:orderId"
                        component={EditBuyerOrder}
                      />
                      <CustomerRoute
                        path="/akun-edit-penjualan/:orderId"
                        component={EditSellerOrder}
                      />
                      <Route path="/" component={NotFound} />
                    </Switch>
                  </div>
                  <Footer toggleCategory={toggleCategory} />
                </ScrollToTop>
              </Router>
            </WishlistState>
          </CartState>
        </AlertState>
      </AuthState>
    </Fragment>
  );
};

export default App;
