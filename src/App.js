import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./components/Home";
import Category from "./components/browseCategory/BrowseCategory";
import Product from "./components/product/Product";
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
import CustomerRoute from "./components/routing/CustomerRoute";
import CheckoutMarketplace from "./components/checkoutMarketplace/CheckoutMarketplace";
import Cart from "./components/cart/Cart";
import ScrollToTop from "./utils/ScrollToTop";
import Toc from "./components/Toc";
import Faq from "./components/Faq";
import About from "./components/About";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { Helmet } from "react-helmet";
import Thankyou from "./components/Thankyou";
import Pembayaran from "./components/checkoutMarketplace/pembayaran/Pembayaran";
import AlertState from "./context/alert/AlertState";
import AuthState from "./context/auth/authState";
import CartState from "./context/cart/cartState";
import LocationState from "./context/location/locationState";

const App = () => {
  return (
    <>
      <Helmet>
        <title>Jolika | All Products</title>
        <meta name="description" content={``} />
      </Helmet>
      <AuthState>
        <AlertState>
          <CartState>
            <LocationState>
              <Router>
                <ScrollToTop>
                  <Header />
                  <Alerts />
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route
                      exact
                      path="/category/:category"
                      component={Category}
                    />
                    <Route
                      exact
                      path="/category/:category/:subcategory1"
                      component={Category}
                    />
                    <Route
                      exact
                      path="/category/:category/:subcategory1/:subcategory2"
                      component={Category}
                    />
                    <Route exact path="/search/" component={Search} />
                    <Route path="/product/:alias" component={Product} />
                    <Route exact path="/cart" component={Cart} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/faq" component={Faq} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/contact" component={Contact} />
                    <Route exact path="/privacy" component={PrivacyPolicy} />
                    <Route
                      exact
                      path="/verify/:token"
                      component={VerifyRegister}
                    />
                    <Route
                      exact
                      path="/reset-password"
                      component={ResetPassword}
                    />
                    <Route
                      exact
                      path="/process-reset-password/:token"
                      component={ProcessResetPassword}
                    />
                    <Route
                      exact
                      path="/register-sosmed/:name/:email"
                      component={RegisterSosmed}
                    />
                    <Route exact path="/logout" component={Logout} />
                    <Route exact path="/toc" component={Toc} />
                    <Route exact path="/thankyou" component={Thankyou} />
                    <CustomerRoute
                      path="/account/:accountPage"
                      component={Account}
                    />
                    <CustomerRoute
                      path="/checkout/:paymentId"
                      component={Pembayaran}
                    />
                    <CustomerRoute
                      path="/checkout"
                      component={CheckoutMarketplace}
                    />
                    <Route path="/" component={NotFound} />
                  </Switch>
                  <Footer />
                </ScrollToTop>
              </Router>
            </LocationState>
          </CartState>
        </AlertState>
      </AuthState>
    </>
  );
};

export default App;
